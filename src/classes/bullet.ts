import RAPIER from "@dimforge/rapier2d-compat";

export class Bullet {
    scene: Phaser.Scene;
    world: RAPIER.World;
    x: number;
    y: number;
    body: Phaser.GameObjects.Rectangle;
    rigidBody: RAPIER.RigidBody;
    angle: number;
    type: string;
    damage: number;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number,
        angle: number,
        type: string,
        damage: number
    ) {
        this.scene = scene;
        this.world = world;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.type = type;
        this.damage = damage;
        this.createBulletBody();
    }

    createBulletBody() {
        this.body = this.scene.add.rectangle(this.x, this.y, 10, 5, 0xffff00);
        this.body.rotation = this.angle;
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(this.x, this.y)
            .setUserData({ type: this.type });
        this.rigidBody = this.world.createRigidBody(rigidBodyDesc);
        const colliderDesc = RAPIER.ColliderDesc.cuboid(5, 2.5)
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
            .setSensor(true);
        this.world.createCollider(colliderDesc, this.rigidBody);
    }
    moveBullet(speed: number) {
        const vx = Math.cos(this.angle) * speed;
        const vy = Math.sin(this.angle) * speed;
        this.rigidBody.setLinvel({ x: vx, y: vy }, true);
    }
    sync() {
        const position = this.rigidBody.translation();
        this.body.x = position.x;
        this.body.y = position.y;
    }
    destroyBullet() {
        this.world.removeRigidBody(this.rigidBody);
        this.body.destroy();
    }
}

