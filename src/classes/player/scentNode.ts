import RAPIER from "@dimforge/rapier2d-compat";

export class ScentNode {
    scene: Phaser.Scene;
    scentNode: Phaser.GameObjects.Rectangle;
    world: RAPIER.World;
    scent: RAPIER.RigidBody;
    constructor(scene: Phaser.Scene, world: RAPIER.World) {
        this.scene = scene;
        this.world = world;
    }
    createScent(x: number, y: number, scentArray: this[]) {
        this.scentNode = this.scene.add.rectangle(x, y, 20, 20, 0xff0000);
        const scentDesc = RAPIER.RigidBodyDesc.fixed()
            .setTranslation(x, y)
            .setUserData({ type: "scent" });
        // this.hitbody = this.scene.add.rectangle(x, y, 32, 32, 0xff0000);
        this.scent = this.world.createRigidBody(scentDesc);
        const hitColDesc = RAPIER.ColliderDesc.cuboid(10, 10).setSensor(true);

        this.world.createCollider(hitColDesc, this.scent);

        this.scene.time.addEvent({
            delay: 2000,
            callbackScope: this.scene,
            callback: () => {
                const scent = scentArray.findIndex((scent) => scent === this);
                scentArray.splice(scent, 1);
                this.scentNode.destroy();
                this.world.removeRigidBody(this.scent);
            },
        });
    }
}

