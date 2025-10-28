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
    shadow: Phaser.GameObjects.Ellipse;
    mouseButtons: Phaser.Input.Pointer;
    canRoll: boolean;
    isRolling: boolean;
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
        this.speed = 500;
        this.health = 100;
        this.MaxHealth = 100;
        this.inputVector = { x: 0, y: 0 };
        this.createPlayerBody();
        this.createInput();
        this.enemyKilled = 0;
        this.coinsCollected = 0;
        this.isBeingKnockedBack = false;
        this.isMoving = false;
        this.canRoll = true;
        this.isRolling = false;

        this.lastShotTime = 0;
        this.lastScentDropTime = 0;
        this.inventory = {
            ammo: 30,
            maxAmmo: 30,
            fireRate: 150,
            reloadTime: 2000,
            damage: 50,
            grenade: 0,
            stims: 0,
        };

        this.currentInventoryIndex = 0;
        this.createGun();
    }

    createPlayerBody() {
        this.body = this.scene.add
            .sprite(this.x, this.y, "player")
            .setScale(1.3);
        this.shadow = this.scene.add.ellipse(
            this.x,
            this.y + 20,
            30,
            20,
            0x000000,
            0.5
        );
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
                end: 1,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.body.anims.create({
            key: "run",
            frames: this.body.anims.generateFrameNumbers("player", {
                start: 2,
                end: 10,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.body.anims.create({
            key: "roll",
            frames: this.body.anims.generateFrameNumbers("player", {
                start: 11,
                end: 15,
            }),
            frameRate: 15,
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
        this.mouseButtons = this.scene.input.mousePointer;
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

        if (this.isMoving && !this.isRolling) {
            this.body.play("run", true);
        } else if (this.isMoving && this.isRolling) {
            this.body.play("roll", true);
        } else {
            this.body.play("idle", true);
        }
        if (
            this.mouseButtons.isDown &&
            this.mouseButtons.button === 2 &&
            this.canRoll
        ) {
            this.playerRoll();
        }
        this.body.on("animationcomplete", (anim: any) => {
            if (anim.key === "roll") {
                this.speed = 500;
                this.isRolling = false;
                this.scene.time.addEvent({
                    delay: 500,
                    callbackScope: this.scene,
                    callback: () => {
                        this.canRoll = true;
                    },
                });
            }
        });
    }
    sync() {
        this.updateYSort();
        const position = this.rigidBody.translation();
        this.body.x = position.x;
        this.body.y = position.y;
        this.shadow.setPosition(this.body.x, this.body.y + 20);
        if (!this.gun) return;
        this.gun.x = position.x;
        this.gun.y = position.y;
        this.AimGunAt();
        this.checkForDeath();
    }

    updateVelocity(delta: number) {
        if (!this.isBeingKnockedBack) {
            this.rigidBody.setLinvel(
                {
                    x: this.inputVector.x * this.speed * (delta / 60),
                    y: this.inputVector.y * this.speed * (delta / 60),
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
    createBullet(bulletArray: Bullet[]) {
        type userData = { type: string };

        const bullet = bulletArray.find((bullet) => bullet.isActive === false);

        if (bullet) {
            bullet.isActive = true;
            bullet.rigidBody.setTranslation(
                { x: this.body.x, y: this.body.y },
                true
            );
            bullet.angle = this.angle;
            bullet.body.rotation = bullet.angle;
            (bullet.rigidBody.userData as userData).type = "player_bullet";
            bullet.damage = this.inventory.damage;
            return bullet;
        }
    }
    shoot(time: number, bulletArray: Bullet[], activeBullets: Bullet[]) {
        const ammoCount = this.inventory.ammo;
        if (
            this.mouseButtons.isDown &&
            this.mouseButtons.button === 0 &&
            !this.isBeingKnockedBack &&
            ammoCount &&
            ammoCount > 0
        ) {
            if (time - this.lastShotTime < this.inventory.fireRate) {
                return;
            }
            this.lastShotTime = time;
            const bullet = this.createBullet(bulletArray);

            activeBullets.push(bullet as Bullet);
            this.inventory.ammo -= 1;
            this.scene.sound.play("gunSound");
            this.scene.cameras.main.shake(50, 0.005);
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
            this.scene.scene.get("Ui").events.emit("show_lose_menu", {
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
    playerRoll() {
        this.canRoll = false;
        this.isRolling = true;
        this.speed = 1200;
    }
}

