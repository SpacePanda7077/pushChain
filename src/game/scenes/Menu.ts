import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Menu extends Scene {
    playBtn: Phaser.GameObjects.Rectangle;
    craftBtn: Phaser.GameObjects.Rectangle;
    myWeaponBtn: Phaser.GameObjects.Rectangle;
    menu_container: Phaser.GameObjects.Container;
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

        this.menu_container = this.add.container(centerX, centerY);

        this.playBtn = this.add
            .rectangle(0, 0, 300, 40, 0x000000, 0.2)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive()
            .on("pointerdown", () => {
                EventBus.emit("check_for_nft");
            });
        const playBtnText = this.add
            .text(0, 0, "PLAY")
            .setOrigin(0.5)
            .setScale(2);
        this.myWeaponBtn = this.add
            .rectangle(0, 70, 300, 40, 0x000000, 0.2)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive()
            .on("pointerdown", () => {
                EventBus.emit("open_weapon_modal");
                this.menu_container.setActive(false).setVisible(false);
            });
        const myWeaponBtnText = this.add
            .text(0, 70, "MY WEAPONS")
            .setOrigin(0.5)
            .setScale(2);

        this.craftBtn = this.add
            .rectangle(0, 140, 300, 40, 0x000000, 0.2)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive()
            .on("pointerdown", () => {
                EventBus.emit("open_craft_modal");
                this.menu_container.setActive(false).setVisible(false);
            });
        const craftBtnText = this.add
            .text(0, 140, "CRAFT WEAPON")
            .setOrigin(0.5)
            .setScale(2);

        this.menu_container
            .add([
                this.playBtn,
                playBtnText,
                this.myWeaponBtn,
                myWeaponBtnText,
                this.craftBtn,
                craftBtnText,
            ])
            .setActive(false)
            .setVisible(false);

        EventBus.on("has_nft", () => {
            this.menu_container.setActive(true).setVisible(true);
        });
        EventBus.on("open_menu", () => {
            this.menu_container.setActive(true).setVisible(true);
        });
        EventBus.on("start_game", () => {
            this.scene.start("Physics");
        });

        EventBus.emit("current-scene-ready", this);
    }
}

