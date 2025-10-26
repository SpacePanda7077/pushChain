import { Player } from "../player/player";

export class Choice {
    name: Phaser.GameObjects.Text;
    description: Phaser.GameObjects.Text;
    container: Phaser.GameObjects.Container;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        player: any,
        effect: any
    ) {
        this.container = scene.add.container(x, y);
        const bg = scene.add
            .rectangle(0, 0, 150, 200, 0x000000, 0.8)
            .setScrollFactor(0)
            .setInteractive()
            .on("pointerdown", () => {
                effect(player);
            });
        this.name = scene.add
            .text(0, -40, "", { wordWrap: { width: 150 }, align: "center" })
            .setOrigin(0.5);
        this.description = scene.add
            .text(0, 0, "", { wordWrap: { width: 150 }, align: "center" })
            .setOrigin(0.5);

        this.container.add([bg, this.name, this.description]).setDepth(100000);
        // const choice = scene.add.sprite(x, y, texture);

        // choice.setOrigin(0.5, 0.5);
    }
}

