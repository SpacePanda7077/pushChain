import RAPIER from "@dimforge/rapier2d-compat";

export class Coin {
    scene: Phaser.Scene;
    x: number;
    y: number;
    coin: Phaser.GameObjects.Arc;
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
        this.coin = this.scene.add.circle(this.x, this.y, 10, 0xfff000);
        const rbDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(this.x, this.y)
            .setUserData({ type: "coin" });
        this.rigidBody = this.world.createRigidBody(rbDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(10, 10).setSensor(true);
        this.world.createCollider(colliderDesc, this.rigidBody);
    }
}

