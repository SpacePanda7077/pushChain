import RAPIER from "@dimforge/rapier2d-compat";
import { Player } from "../player/player";
import { Bullet } from "../bullet";
import { ScentNode } from "../player/scentNode";
import { Coin } from "../loots/pickUps";

export class IEnemy {
    health: number;
    rigidBody: RAPIER.RigidBody;
    body: Phaser.GameObjects.Sprite;
    canShoot: boolean;
    isAttacking: boolean;
    angle: number;
    knockBackForce: number;
    constructor(
        scene: Phaser.Scene,
        world: RAPIER.World,
        x: number,
        y: number
    ) {}
    onCreate() {}
    CreateEnemy() {}
    CreateAnimations() {}
    moveEnemy(player: Player, scentNode: ScentNode[]) {}
    separate(availableEnemies: this[]) {}
    surroundPlayer(player: Player, enemies: this[]) {}
    attack(player: Player, time: number, activeBullet: Bullet[]) {}
    sync() {}
    facePlayer(player: Player) {}
    DestroyEnemy(pickUpArray: Coin[]) {}
    onDestroy() {}
}

