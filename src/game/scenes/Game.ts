import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import RAPIER from "@dimforge/rapier2d-compat";
import { Player } from "../../classes/player/player";
import { Crawlers } from "../../classes/ennmy/Crawlers";
import { IEnemy } from "../../classes/interface/IEnemy";
import { Bullet } from "../../classes/bullet";
import { ScentNode } from "../../classes/player/scentNode";
import { Coin } from "../../classes/loots/pickUps";
import { normalUpgrade } from "../../classes/loots/upgrades";
import { Choice } from "../../classes/loots/choice";

export class Game extends Scene {
    world: RAPIER.World;
    player: Player;
    timeElapsed: any;
    threatLevel: number;
    spawnTimer: number;
    availableEnemies: IEnemy[];
    activeBullet: Bullet[];
    eventQueue: RAPIER.EventQueue;
    ground: Phaser.GameObjects.Image;
    playersScents: ScentNode[];
    mapGrid: any[];
    dungeonSize: number;
    tileSize: number;
    rooms: any;
    tileArray: any;
    optionIsOpen: boolean;
    enemyAmountToKillBeforeOptions: number;
    availablePickups: Coin[];
    options: Choice[];
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");
        this.load.audio("gunSound", "sound/gun.mp3");
        this.load.image("ground", "maps/grass_vally_ground.png");
        this.load.image("walls", "maps/grass_vally_wall.png");
        this.load.tilemapTiledJSON("map", "json/grass_vally.json");
        this.load.spritesheet("player", "player/player.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("coin", "coin.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    create() {
        if (!this.scene.isActive("Ui")) {
            this.scene.launch("Ui");
        }

        // this.input.mouse?.disableContextMenu();
        this.initializeWorld();
        this.optionIsOpen = false;
        this.enemyAmountToKillBeforeOptions = 5;
        this.timeElapsed = 0;
        this.threatLevel = 1;
        this.spawnTimer = 0;
        this.mapGrid = [];
        this.tileArray = {};
        this.activeBullet = [];
        this.availableEnemies = [];
        this.availablePickups = [];
        this.playersScents = [];
        this.ground = this.add.image(0, 0, "ground").setOrigin(0);
        this.tileSize = 64;
        this.dungeonSize = this.ground.width / this.tileSize;

        this.add.image(0, 0, "walls").setOrigin(0).setDepth(6);

        this.createMap();
        this.player = new Player(
            this,
            this.world,
            this.ground.width / 2,
            this.ground.height / 2
        );
        this.cameras.main.startFollow(this.player.body);

        // this.cameras.main.setBounds(
        //     0,
        //     0,
        //     this.ground.width,
        //     this.ground.height
        // );
        const enemy = new Crawlers(
            this,
            this.world,
            this.player.body.x + 200,
            this.player.body.y
        );
        this.availableEnemies.push(enemy);

        EventBus.emit("current-scene-ready", this);
    }
    update(time: number, delta: number): void {
        // Update RAPIER world
        this.world.step(this.eventQueue);
        // Handle player input
        this.player.handleInput();
        // update player based on input
        this.player.updateVelocity();
        // Sync player position
        this.player.sync();
        // shoot gun
        this.player.shoot(time, this.activeBullet);
        //recover from knockback
        this.player.recoverFromKnockBack();

        // Spawn enemies based on threat level
        this.spawnEnemy(this.player.body.x, this.player.body.y, delta);
        // Move enemies toward player
        this.moveEnemies(time);
        // Move bullets
        this.moveBullets();
        // Check for collisions
        this.checkCollisions();
        this.deleteCoinIfTooFar();

        // Check if options menu can be opened
        // this.checkIfOptionIsAvailable();
    }
    initializeWorld() {
        // Initialize RAPIER world here
        this.world = new RAPIER.World({ x: 0, y: 0 }); // No gravity
        this.eventQueue = new RAPIER.EventQueue(true);
    }
    createMap() {
        const map = this.make.tilemap({ key: "map" });
        map.objects.forEach((objectLayer) => {
            if (objectLayer.name === "collision") {
                console.log(objectLayer);
                objectLayer.objects.forEach((obj) => {
                    const { x, y, width, height } = obj;
                    const colliderDesc = RAPIER.ColliderDesc.cuboid(
                        width! / 2,
                        height! / 2
                    );
                    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
                        .setTranslation(x! + width! / 2, y! + height! / 2)
                        .setUserData({ type: "wall" });
                    const rigidBody = this.world.createRigidBody(rigidBodyDesc);
                    this.world.createCollider(colliderDesc, rigidBody);
                });
            }
        });
    }

    spawnEnemy(x: number, y: number, deltaTime: number) {
        if (this.availableEnemies.length > 20) return;
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const radius = Phaser.Math.FloatBetween(200, 400);
        x += Math.cos(angle) * radius;
        y += Math.sin(angle) * radius;
        if (x < 32 || x > this.ground.width || y < 32 || y > this.ground.height)
            return;
        // Implement enemy spawning logic here
        this.timeElapsed += deltaTime / 1000;
        this.threatLevel = 1 + this.timeElapsed * 0.02; // grows every second

        this.spawnTimer += deltaTime / 1000;
        if (this.spawnTimer >= 3 / this.threatLevel) {
            this.spawnTimer = 0;
            const enemy = new Crawlers(this, this.world, x, y);
            this.availableEnemies.push(enemy);
        }
    }
    moveEnemies(time: number) {
        this.availableEnemies.forEach((enemy) => {
            enemy.moveEnemy(this.player, this.playersScents);
            enemy.sync();
            enemy.separate(this.availableEnemies);
            enemy.surroundPlayer(
                this.player,
                this.availableEnemies as IEnemy[]
            );
            enemy.facePlayer(this.player);
            enemy.attack(this.player, time, this.activeBullet);
        });
    }

    moveBullets() {
        this.activeBullet.forEach((bulletData, index) => {
            const bullet = bulletData;
            const speed = 600;
            bullet.moveBullet(speed);
            bullet.sync();
            // Remove bullet if it goes out of bounds
            if (
                bullet.body.x <
                    this.player.body.x - this.cameras.main.width / 2 ||
                bullet.body.x >
                    this.player.body.x + this.cameras.main.width / 2 ||
                bullet.body.y <
                    this.player.body.y - this.cameras.main.height / 2 ||
                bullet.body.y >
                    this.player.body.y + this.cameras.main.height / 2
            ) {
                bullet.destroyBullet();
                this.activeBullet.splice(index, 1);
                console.log("Bullet removed");
            }
        });
    }
    checkCollisions() {
        type userData = { type: string };

        // Implement collision checking logic here
        this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
            // Handle collision events
            const collider1 = this.world.getCollider(handle1);
            const collider2 = this.world.getCollider(handle2);
            // Add your collision handling logic here
            const body1 = collider1?.parent();
            const body2 = collider2?.parent();
            let b1;
            let b2;
            if (
                (body1?.userData as userData).type === "player_bullet" ||
                (body1?.userData as userData).type === "player"
            ) {
                b1 = body1;
                b2 = body2;
            } else if (
                (body2?.userData as userData).type === "player_bullet" ||
                (body1?.userData as userData).type === "player"
            ) {
                b1 = body2;
                b2 = body1;
            } else {
                b1 = body1;
                b2 = body2;
            }
            if (started) {
                // Collision started
                // console.log(b1?.userData, "collided with ", b2?.userData);
                if (
                    (b1?.userData as userData).type === "player_bullet" &&
                    (b2?.userData as userData).type === "enemy"
                ) {
                    this.playerBulletToEnemy(b1, b2);
                }
                if (
                    (b1?.userData as userData).type === "player" &&
                    (b2?.userData as userData).type === "enemy_hitbox"
                ) {
                    this.EnemyHitBoxToPlayer(b1, b2);
                }
                if (
                    (b1?.userData as userData).type === "player" &&
                    (b2?.userData as userData).type === "coin"
                ) {
                    //collect pickup
                    this.collectPickUp(b1, b2);
                }
            } else {
                // Collision ended
            }
        });
    }
    playerBulletToEnemy(
        b1: RAPIER.RigidBody | null,
        b2: RAPIER.RigidBody | null
    ) {
        const collidedBullet = this.activeBullet.find(
            (bullet) => bullet.rigidBody === b1
        );
        if (collidedBullet) {
            collidedBullet.destroyBullet();
            const index = this.activeBullet.indexOf(collidedBullet);
            this.activeBullet.splice(index, 1);
            const collidedEnemy = this.availableEnemies.find(
                (enemy) => enemy.rigidBody === b2
            );
            if (collidedEnemy) {
                collidedEnemy.health -= collidedBullet?.damage;

                if (collidedEnemy.health <= 0) {
                    collidedEnemy.DestroyEnemy(this.availablePickups);
                    const index = this.availableEnemies.indexOf(collidedEnemy);
                    this.availableEnemies.splice(index, 1);
                    this.player.enemyKilled += 1;
                    this.scene
                        .get("Ui")
                        .events.emit("enemy-killed", this.player.enemyKilled);
                }
            }
        }
    }
    deleteCoinIfTooFar() {
        this.availablePickups.forEach((pickup) => {
            const distance = Phaser.Math.Distance.Between(
                pickup.x,
                pickup.y,
                this.player.body.x,
                this.player.body.y
            );
            if (distance > 800) {
                pickup.coin.destroy();
                this.world.removeRigidBody(pickup.rigidBody);
                const index = this.availablePickups.findIndex(
                    (pickup_) => pickup_ === pickup
                );
                this.availablePickups.splice(index, 1);
            }
        });
    }
    EnemyHitBoxToPlayer(
        b1: RAPIER.RigidBody | null,
        b2: RAPIER.RigidBody | null
    ) {
        type enemyUserData = { type: string; owner: IEnemy };
        console.log(b1?.userData, "collided with ", b2?.userData);
        const collidedEnemy = (b2?.userData as enemyUserData).owner;
        if (collidedEnemy) {
            console.log(collidedEnemy.isAttacking);
            collidedEnemy.isAttacking = true;
        }
    }
    checkIfOptionIsAvailable() {
        if (this.optionIsOpen) {
            return;
        } else {
            if (
                this.player.enemyKilled >= this.enemyAmountToKillBeforeOptions
            ) {
                this.openOptionsMenu();
            }
        }
    }
    collectPickUp(b1: RAPIER.RigidBody | null, b2: RAPIER.RigidBody | null) {
        const collidedPickup = this.availablePickups.find(
            (pickup) => pickup.rigidBody === b2
        );
        if (collidedPickup) {
            collidedPickup.coin.destroy();
            this.world.removeRigidBody(collidedPickup.rigidBody);
            const index = this.availablePickups.findIndex(
                (pickup) => pickup === collidedPickup
            );
            this.availablePickups.splice(index, 1);
            this.player.coinsCollected += 1;
            this.scene
                .get("Ui")
                .events.emit("collected_coin", this.player.coinsCollected);
        }
    }

    openOptionsMenu() {
        this.openOption();
        this.scene.pause();
        this.optionIsOpen = true;
    }

    openOption() {
        const canBringWeapon = 1; //Math.round(Math.random());
        const randItems = [];
        for (let i = 0; i < 3; i++) {
            const randindex = Math.floor(Math.random() * normalUpgrade.length);
            const randItem = normalUpgrade[randindex];
            randItems.push(randItem);
        }
        console.log(randItems);
        this.createOptionsMenu(randItems, this.player);
    }

    createOptionsMenu(items: any[], player: Player) {
        // To be implemented
        const centerX = Number(this.game.config.width) / 2;
        const centerY = Number(this.game.config.height) / 2;

        // console.log(player);
        this.options = [];

        for (let i = 0; i < 3; i++) {
            const choice = new Choice(
                this,
                centerX + (i - 1) * 200,
                centerY,
                "",
                player,
                items[i].effect
            );
            choice.name.setText(items[i].name);
            choice.description.setText(items[i].description);
            console.log(choice);
            this.options.push(choice);
        }
    }
}

