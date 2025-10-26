import RAPIER from "@dimforge/rapier2d-compat";

export class Coin {
    scene: Phaser.Scene;
    x: number;
    y: number;
    coin: Phaser.GameObjects.Sprite;
    world: RAPIER.World;
    rigidBody: RAPIER.RigidBody;
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
    }
    createCoin() {
        this.coin = this.scene.add.sprite(this.x, this.y, "coin");
        this.coin.anims.create({
            key: "roll",
            frames: this.coin.anims.generateFrameNumbers("coin", {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.coin.play("roll");
        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(this.x, this.y)
            .setUserData({ type: "coin" });
        this.rigidBody = this.world.createRigidBody(rbDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(10, 10).setSensor(true);
        this.world.createCollider(colliderDesc, this.rigidBody);
    }
}

