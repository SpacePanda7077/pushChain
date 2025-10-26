import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Menu extends Scene {
    playBtn: Phaser.GameObjects.Rectangle;
    constructor() {
        super("Menu");
    }

    preload() {
        // set root path
        this.load.setPath("assets");
        this.load.image("bg", "bg.png");
    }

    create() {
        const bg = this.add.image(0, 0, "bg").setOrigin(0);
        let scaleX = Number(this.game.config.width) / bg.width;
        let scaleY = Number(this.game.config.height) / bg.height;

        let centerX = Number(this.game.config.width) / 2;
        let centerY = Number(this.game.config.height) / 2;
        bg.setScale(scaleX, scaleY);

        this.playBtn = this.add
            .rectangle(centerX, centerY, 300, 40, 0x000000, 0.2)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start("Physics");
            });
        const playBtnText = this.add
            .text(centerX, centerY, "PLAY")
            .setOrigin(0.5)
            .setScale(2);

        EventBus.emit("current-scene-ready", this);
    }
}

