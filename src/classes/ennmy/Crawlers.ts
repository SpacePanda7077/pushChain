import RAPIER from "@dimforge/rapier2d-compat";
import { IEnemy } from "../interface/IEnemy";
import { Player } from "../player/player";
import { ScentNode } from "../player/scentNode";
import { Coin } from "../loots/pickUps";

export class Crawlers extends IEnemy {
    scene: Phaser.Scene;
    world: RAPIER.World;
    x: number;
    y: number;
    declare body: Phaser.GameObjects.Sprite;
    declare rigidBody: RAPIER.RigidBody;
    health: number;
    canShoot: boolean;
    isAttacking: boolean;
    attackRadius: number;
    weapons: { name: string; shootInterval: number; ammo: number }[];
    weapon: Phaser.GameObjects.Sprite;
    declare angle: number;
    desiredWeapon: { name: string; shootInterval: number; ammo: number };
    lastAttackTime: number;
    shootInterval: number;
    shadow: Phaser.GameObjects.Ellipse;
    speed: number;
    declare knockBackForce: number;
    hitBox: RAPIER.RigidBody;
    hitbody: Phaser.GameObjects.Rectangle;
    directionSensor: RAPIER.Ray[];
    debugGraphics: Phaser.GameObjects.Graphics;
    lookSensor: RAPIER.Ray;
    followRadius: number;
    collider: RAPIER.Collider;
    ScentSensor: RAPIER.Ray;

    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {
        super(scene, world, x, y);
        this.scene = scene;
        this.world = world;
        this.x = x;
        this.y = y;
        this.speed = 60;
        this.health = 100;
        this.knockBackForce = 1000;
        this.followRadius = 500;
        this.attackRadius = 50;
        this.canShoot = true;
        this.isAttacking = false;
        this.lastAttackTime = 0;
        this.shootInterval = 1000;
        this.debugGraphics = scene.add.graphics();

        this.CreateEnemy();
    }
    onCreate(): void {
        //throw new Error("Method not implemented.");
    }
    CreateEnemy(): void {
        this.onCreate();
        this.shadow = this.scene.add.ellipse(
            this.x,
            this.y + 20,
            60,
            20,
            0x000000,
            0.5
        );
        this.body = this.scene.add.sprite(this.x, this.y, "crawler");
        this.createDirectionSensor();
        this.CreateAnimations();
        this.body.play("crawler_run");
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(this.x, this.y)
            .setUserData({ type: "enemy" });
        this.rigidBody = this.world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.capsule(32 / 2, 32 / 2);
        this.collider = this.world.createCollider(colliderDesc, this.rigidBody);
        this.addHitBox(this.x + 15, this.y);
        //throw new Error("Method not implemented.");
    }
    createDirectionSensor() {
        this.directionSensor = [];
        const sensorAmount = 12;
        for (let i = 0; i < sensorAmount; i++) {
            const angle = (i / sensorAmount) * Math.PI * 2;

            const dirX = Math.cos(angle);
            const dirY = Math.sin(angle);
            const ray = new RAPIER.Ray(
                { x: this.body.x, y: this.body.y },
                { x: dirX, y: dirY }
            );
            this.directionSensor.push(ray);
        }

        this.lookSensor = new RAPIER.Ray(
            { x: this.body.x, y: this.body.y },
            { x: 1, y: 0 }
        );
        this.ScentSensor = new RAPIER.Ray(
            { x: this.body.x, y: this.body.y },
            { x: 1, y: 0 }
        );
    }

    CreateAnimations(): void {
        if (this.body.anims.exists("crawler_run")) return;
        this.body.anims.create({
            key: "crawler_run",
            frames: this.scene.anims.generateFrameNumbers("crawler", {
                start: 1,
                end: 8,
            }),
            frameRate: 20,
            repeat: -1,
        });
        this.body.anims.create({
            key: "crawler_attack",
            frames: this.scene.anims.generateFrameNumbers("crawler", {
                start: 8,
                end: 12,
            }),
            frameRate: 10,
            repeat: 0,
        });
    }
    moveEnemy(player: Player): void {
        this.angle = Phaser.Math.Angle.Between(
            this.rigidBody.translation().x,
            this.rigidBody.translation().y,
            player.rigidBody.translation().x,
            player.rigidBody.translation().y
        );

        // this.drawDirectionDebugLine();

        // this.drawSensorDebugLine();
        // this.drawDirectionDebugLine(favDir);

        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.rigidBody.setLinvel({ x: vx, y: vy }, true);
    }
    separate(availableEnemies: this[]): void {
        availableEnemies.forEach((otherEnemy) => {
            if (otherEnemy === this) return;
            const posA = this.rigidBody.translation();
            const posB = otherEnemy.rigidBody.translation();
            const distance = Phaser.Math.Distance.Between(
                posA.x,
                posA.y,
                posB.x,
                posB.y
            );
            const minDistance = 60; // Minimum distance to maintain
            if (distance < minDistance) {
                const overlap = minDistance - distance;
                const angle = Phaser.Math.Angle.Between(
                    posB.x,
                    posB.y,
                    posA.x,
                    posA.y
                );
                const moveX = Math.cos(angle) * (overlap / 2);
                const moveY = Math.sin(angle) * (overlap / 2);
                const newPosA = {
                    x: posA.x + moveX,
                    y: posA.y + moveY,
                };
                const newPosB = {
                    x: posB.x - moveX,
                    y: posB.y - moveY,
                };
                this.rigidBody.setTranslation(newPosA, true);
                otherEnemy.rigidBody.setTranslation(newPosB, true);
            }
        });
        //throw new Error("Method not implemented.");
    }
    surroundPlayer(player: Player, enemies: Crawlers[]): void {
        //throw new Error("Method not implemented.");
        enemies.forEach((enemy, index) => {
            const angle = (index / enemies.length) * Math.PI * 2;
            const radius = 40; // Distance from player
            const targetX =
                player.rigidBody.translation().x + Math.cos(angle) * radius;
            const targetY =
                player.rigidBody.translation().y + Math.sin(angle) * radius;
            const enemyPos = enemy.rigidBody.translation();
            const moveAngle = Phaser.Math.Angle.Between(
                enemyPos.x,
                enemyPos.y,
                targetX,
                targetY
            );

            const vx = Math.cos(moveAngle) * this.speed;
            const vy = Math.sin(moveAngle) * this.speed;
            enemy.rigidBody.setLinvel({ x: vx, y: vy }, true);
        });
    }
    attack(player: Player, time: number): void {
        const distance = Phaser.Math.Distance.Between(
            this.rigidBody.translation().x,
            this.rigidBody.translation().y,
            player.rigidBody.translation().x,
            player.rigidBody.translation().y
        );
        if (distance <= this.attackRadius) {
            if (time > this.lastAttackTime + this.shootInterval) {
                this.body.play("crawler_attack");
                this.rigidBody.setLinvel(
                    {
                        x: Math.cos(this.angle) * 400,
                        y: Math.sin(this.angle) * 400,
                    },
                    true
                );

                this.body.on("animationupdate", (anim: any, frame: any) => {
                    if (anim.key === "crawler_attack") {
                        if (frame.index >= 4) {
                            if (this.isAttacking) {
                                player.isBeingKnockedBack = true;
                                player.knockBack(this.angle, 500);
                                player.health -= 5;
                                this.scene.scene
                                    .get("Ui")
                                    .events.emit("update-health", {
                                        health: player.health,
                                        maxHealth: player.MaxHealth,
                                    });
                            }
                        }
                    }
                });
                this.body.on("animationcomplete", (anim: any) => {
                    if (anim.key === "crawler_attack") {
                        this.body.play("crawler_run");
                        this.isAttacking = false;
                    }
                });

                this.lastAttackTime = time;
            }
        }
    }
    sync(): void {
        const position = this.rigidBody.translation();
        this.body.x = position.x;
        this.body.y = position.y;
        this.shadow.setPosition(this.body.x, this.body.y + 20);

        //sync hitbox
        this.hitBox.setTranslation(
            {
                x: position.x + 20 * Math.cos(this.angle),
                y: position.y + 20 * Math.sin(this.angle),
            },
            true
        );
        this.directionSensor.forEach((ray) => {
            ray.origin = position;
        });
        this.lookSensor.origin = position;
        this.ScentSensor.origin = position;
    }
    facePlayer(player: Player): void {
        const x = player.body.x - this.body.x;
        if (x > 0) {
            this.body.flipX = false;
        } else {
            this.body.flipX = true;
        }
    }
    DestroyEnemy(pickUpArray: Coin[]): void {
        this.onDestroy();
        const dropChance = Math.random();
        if (dropChance < 0.8) {
            const pickUp = new Coin(
                this.scene,
                this.world,
                this.body.x,
                this.body.y
            );
            pickUp.createCoin();
            pickUpArray.push(pickUp);
        }
        this.world.removeRigidBody(this.rigidBody);
        this.body.destroy();
        this.shadow.destroy();
        //throw new Error("Method not implemented.");
    }
    onDestroy(): void {
        //throw new Error("Method not implemented.");
    }
    addHitBox(x: number, y: number) {
        const hitBoxDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(x, y)
            .setUserData({ type: "enemy_hitbox", owner: this });
        hitBoxDesc.setSleeping(true);
        // this.hitbody = this.scene.add.rectangle(x, y, 32, 32, 0xff0000);
        this.hitBox = this.world.createRigidBody(hitBoxDesc);
        const hitColDesc = RAPIER.ColliderDesc.cuboid(16, 16).setSensor(true);

        this.world.createCollider(hitColDesc, this.hitBox);
    }
    dropObject() {}
}

