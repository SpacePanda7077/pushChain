import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // set root path
        this.load.setPath("assets");
        // raiders
        this.load.spritesheet("crawler", "enemy/crawler/crawlers.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
    }

    create() {
        this.scene.start("Menu");
        EventBus.emit("current-scene-ready", this);
    }
}

