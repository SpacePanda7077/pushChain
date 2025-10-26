export class Coin {
    scene: Phaser.Scene;
    x: number;
    y: number;
    coin: Phaser.GameObjects.Arc;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }
    createCoin(pickUpArray: this[]) {
        this.coin = this.scene.add.circle(this.x, this.y, 10, 0xfff000);
        this.scene.time.addEvent({
            delay: 10000,
            callback: () => {
                const coin = this;
                this.coin.destroy();
                const index = pickUpArray.findIndex(
                    (pickup) => pickup === coin
                );
                pickUpArray.splice(index, 1);
            },
        });
    }
}

