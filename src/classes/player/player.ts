import RAPIER from "@dimforge/rapier2d-compat";
import { Bullet } from "../bullet";
import { WeaponObject } from "../loots/weaponObject";
import { weaponInfo } from "../weaponInfo";

export class Player {
    scene: Phaser.Scene;
    world: RAPIER.World;
    x: number;
    y: number;
    body: Phaser.GameObjects.Sprite;
    rigidBody: RAPIER.RigidBody;
    inputVector: { x: number; y: number };
    leftKey: Phaser.Input.Keyboard.Key | undefined;
    rightKey: Phaser.Input.Keyboard.Key | undefined;
    upKey: Phaser.Input.Keyboard.Key | undefined;
    downKey: Phaser.Input.Keyboard.Key | undefined;
    gun: Phaser.GameObjects.Sprite;
    angle: number;
    lastShotTime: number;
    isBeingKnockedBack: boolean;
    lastScentDropTime: number;
    enemyKilled: number;
    health: number;
    inventory: {
        ammo: number;
        maxAmmo: number;
        fireRate: number;
        reloadTime: number;
        damage: number;
        grenade: number;
        stims: number;
    };
    inVent1: Phaser.Input.Keyboard.Key | undefined;
    currentInventoryIndex: number;
    speed: number;
    MaxHealth: number;
    coinsCollected: number;
    isMoving: boolean;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        this.scene = scene;
        this.world = world;
        this.x = x;
        this.y = y;
        this.speed = 100;
        this.health = 10;
        this.MaxHealth = 100;
        this.inputVector = { x: 0, y: 0 };
        this.createPlayerBody();
        this.createInput();
        this.enemyKilled = 0;
        this.coinsCollected = 0;
        this.isBeingKnockedBack = false;
        this.isMoving = false;

        this.lastShotTime = 0;
        this.lastScentDropTime = 0;
        this.inventory = {
            ammo: 30,
            maxAmmo: 30,
            fireRate: 150,
            reloadTime: 4000,
            damage: 50,
            grenade: 0,
            stims: 0,
        };

        this.currentInventoryIndex = 0;
        this.createGun();
    }

    createPlayerBody() {
        this.body = this.scene.add.sprite(this.x, this.y, "player");
        this.createAnimation();
        this.body.play("idle");
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(this.x, this.y)
            .setUserData({ type: "player" });
        this.rigidBody = this.world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(16, 16).setActiveEvents(
            RAPIER.ActiveEvents.COLLISION_EVENTS
        );
        this.world.createCollider(colliderDesc, this.rigidBody);
    }
    createAnimation() {
        this.body.anims.create({
            key: "idle",
            frames: this.body.anims.generateFrameNumbers("player", {
                start: 0,
                end: 2,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.body.anims.create({
            key: "run",
            frames: this.body.anims.generateFrameNumbers("player", {
                start: 3,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }
    createGun() {
        const gun = new WeaponObject(
            this.scene,
            this.x,
            this.y,
            weaponInfo.sub_machine.raptor
        );
        this.scene.load.image(
            gun.texture,
            `weapons/${gun.type}/${gun.texture}.png`
        );
        this.scene.load.once("complete", () => {
            this.scene.scene
                .get("Ui")
                .events.emit("update_inventory", { gun, index: 0 });
            this.gun = this.scene.add
                .sprite(this.x, this.y, gun.texture)
                .setOrigin(0.2, 0.5)
                .setDepth(15);
        });
        this.scene.load.start();
    }

    createInput() {
        this.leftKey = this.scene.input.keyboard?.addKey("a");
        this.rightKey = this.scene.input.keyboard?.addKey("d");
        this.upKey = this.scene.input.keyboard?.addKey("w");
        this.downKey = this.scene.input.keyboard?.addKey("s");
        this.inVent1 = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.ONE
        );
        this.inVent1 = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.TWO
        );
        this.inVent1 = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.THREE
        );
        this.inVent1 = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.FOUR
        );
        this.inVent1 = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.FIVE
        );
    }
    handleInput() {
        this.inputVector.x = 0;
        this.inputVector.y = 0;

        if (this.leftKey?.isDown) {
            this.inputVector.x = -1;
            this.isMoving = true;
        } else if (this.rightKey?.isDown) {
            this.inputVector.x = 1;
            this.isMoving = true;
        }
        if (this.upKey?.isDown) {
            this.inputVector.y = -1;
            this.isMoving = true;
        } else if (this.downKey?.isDown) {
            this.inputVector.y = 1;
            this.isMoving = true;
        }
        if (
            !this.leftKey?.isDown &&
            !this.rightKey?.isDown &&
            !this.upKey?.isDown &&
            !this.downKey?.isDown
        ) {
            this.isMoving = false;
        }

        if (this.isMoving) {
            this.body.play("run", true);
        } else {
            this.body.play("idle", true);
        }
    }
    sync() {
        this.updateYSort();
        const position = this.rigidBody.translation();
        this.body.x = position.x;
        this.body.y = position.y;
        if (!this.gun) return;
        this.gun.x = position.x;
        this.gun.y = position.y;
        this.AimGunAt();
        this.checkForDeath();
    }

    updateVelocity() {
        if (!this.isBeingKnockedBack) {
            this.rigidBody.setLinvel(
                {
                    x: this.inputVector.x * this.speed,
                    y: this.inputVector.y * this.speed,
                },
                true
            );
        }
    }
    updateYSort() {
        if (this.body.y < 208) {
            this.body.setDepth(10);
        } else {
            this.body.setDepth(5);
        }
    }
    AimGunAt() {
        const pointer = this.scene.input.activePointer;
        this.angle = Phaser.Math.Angle.Between(
            this.rigidBody.translation().x,
            this.rigidBody.translation().y,
            pointer.worldX,
            pointer.worldY
        );
        this.gun.rotation = this.angle;
        const fliped = this.flipPlayer(pointer.worldX);
        this.body.flipX = fliped;
        this.gun.flipY = fliped;
    }
    createBullet() {
        const bullet = new Bullet(
            this.scene,
            this.world,
            this.rigidBody.translation().x + Math.cos(this.angle) * 50, // Offset to gun tip
            this.rigidBody.translation().y + Math.sin(this.angle) * 50, // Offset to gun tip
            this.angle,
            "player_bullet",
            this.inventory.damage
        );
        return bullet;
    }
    shoot(time: number, activeBullets: Bullet[]) {
        const shootButton = this.scene.input.mousePointer;
        const ammoCount = this.inventory.ammo;
        if (
            shootButton.isDown &&
            shootButton.button === 0 &&
            !this.isBeingKnockedBack &&
            ammoCount &&
            ammoCount > 0
        ) {
            if (time - this.lastShotTime < this.inventory.fireRate) {
                return;
            }
            this.lastShotTime = time;
            const bullet = this.createBullet();
            activeBullets.push(bullet);
            this.inventory.ammo -= 1;
            this.scene.sound.play("gunSound");
            this.scene.scene.get("Ui").events.emit("player-shot", {
                ammoCount: this.inventory.ammo,
                maxAmmo: this.inventory.maxAmmo,
            });
            return bullet;
        } else if (ammoCount !== undefined && ammoCount <= 0) {
            console.log("Out of ammo!");
            this.reload();
        }
    }
    knockBack(angle: number, force: number) {
        if (this.isBeingKnockedBack) {
            this.scene.cameras.main.shake(100, 0.03);
            this.rigidBody.setLinvel(
                {
                    x: Math.cos(angle) * force,
                    y: Math.sin(angle) * force,
                },
                true
            );
            this.rigidBody.setLinearDamping(2);
        }
    }
    recoverFromKnockBack() {
        if (
            this.isBeingKnockedBack &&
            Math.abs(this.rigidBody.linvel().x) < 30 &&
            Math.abs(this.rigidBody.linvel().y) < 30
        ) {
            this.isBeingKnockedBack = false;
        }
    }

    reload() {
        this.scene.time.addEvent({
            delay: this.inventory.reloadTime,
            callback: () => {
                this.inventory.ammo = this.inventory.maxAmmo;
                this.scene.scene.get("Ui").events.emit("reload", {
                    ammoCount: this.inventory.ammo,
                    maxAmmo: this.inventory.maxAmmo,
                });
            },
            callbackScope: this.scene,
        });
    }
    checkForDeath() {
        if (this.health <= 0) {
            this.scene.scene.pause();
            this.scene.scene
                .get("Ui")
                .events.emit("show_lose_menu", {
                    highScore: this.enemyKilled,
                    coinsCollected: this.coinsCollected,
                });
        }
    }
    flipPlayer(MouseX: number) {
        const x = MouseX - this.body.x;

        if (x > 0) {
            return false;
        }
        return true;
    }
}

