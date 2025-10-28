import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { WeaponObject } from "../../classes/loots/weaponObject";
import { weaponInfo } from "../../classes/weaponInfo";
import { normalUpgrade } from "../../classes/loots/upgrades";
import { Choice } from "../../classes/loots/choice";
import { Player } from "../../classes/player/player";

export class Ui extends Scene {
    barBackground: Phaser.GameObjects.Rectangle;
    barFill: Phaser.GameObjects.Rectangle;
    energyBackground: Phaser.GameObjects.Rectangle;
    energyFill: Phaser.GameObjects.Rectangle;
    enemyKilledText: Phaser.GameObjects.Text;
    inventory: {
        weapon: {
            sprite: Phaser.GameObjects.Sprite | null;
            ammo: Phaser.GameObjects.Text | null;
            maxAmmo: Phaser.GameObjects.Text | null;
        };
        grenade: number;
        stims: number;
    };
    grenadeText: Phaser.GameObjects.Text;
    stimText: Phaser.GameObjects.Text;
    secondaryWeaponText: Phaser.GameObjects.Text;
    primaryWeaponText: Phaser.GameObjects.Text;
    options: Choice[];
    weaponText: Phaser.GameObjects.Text;
    coinCollectedText: Phaser.GameObjects.Text;
    loseMenu: Phaser.GameObjects.Container;
    highScore: Phaser.GameObjects.Text;
    coins: Phaser.GameObjects.Text;
    coinToClaim: number;
    constructor() {
        super("Ui");
    }

    preload() {}

    create() {
        this.inventory = {
            weapon: { sprite: null, ammo: null, maxAmmo: null },
            grenade: 0,
            stims: 0,
        };
        this.createHealthBar(150, 100, 200, 20);
        this.createEnergyBar();
        this.createEnemyKilledText();
        this.createCoinsCollectedText();
        this.createInventory();
        this.createLoseMenu();
        this.events.on(
            "update-health",
            (data: { health: number; maxHealth: number }) => {
                const percentage = Phaser.Math.Clamp(
                    data.health / data.maxHealth,
                    0,
                    1
                );
                this.redrawHealthBar(percentage);
            }
        );
        this.events.on("enemy-killed", (count: number) => {
            this.enemyKilledText.setText(`Enemies Killed: ${count}`);
        });
        this.events.on("collected_coin", (count: number) => {
            this.coinCollectedText.setText(`Coins Collected: ${count}`);
        });

        this.events.on(
            "player-shot",
            (data: { ammoCount: number; maxAmmo: number }) => {
                this.weaponText.setText(`${data.ammoCount}/${data.maxAmmo}`);
                // To be implemented for reducing ammo count
            }
        );
        this.events.on(
            "reload",
            (data: { ammoCount: number; maxAmmo: number }) => {
                this.weaponText.setText(`${data.ammoCount}/${data.maxAmmo}`);
                // To be implemented for reducing ammo count
            }
        );

        this.events.on("open-options-menu", (player: Player) => {});
        this.events.on("delete", () => {
            this.options.forEach((choice) => {
                choice.container.destroy();
            });
            this.options = [];
            this.scene.get("Game").events.emit("Option_Chosen");
        });

        this.events.on(
            "show_lose_menu",
            (data: { highScore: number; coinsCollected: number }) => {
                this.loseMenu.setActive(true).setVisible(true);
                this.highScore.text = `HighScore : ${data.highScore}`;
                this.coins.text = `Coins Collected : ${data.coinsCollected}`;
                this.coinToClaim = data.coinsCollected;
            }
        );
        EventBus.emit("current-scene-ready", this);
    }
    createHealthBar(x: number, y: number, width: number, height: number) {
        this.barBackground = this.add
            .rectangle(x, y, width, height, 0x555555)
            .setScrollFactor(0);
        this.barFill = this.add.rectangle(
            x - width / 2,
            y,
            width,
            height,
            0xff0000
        );
        this.barFill.setOrigin(0, 0.5);
        return { backGround: this.barBackground, barFill: this.barFill };
    }
    redrawHealthBar(percentage: number) {
        const width = this.barBackground.width;
        this.barFill.width = width * percentage;
    }
    createEnergyBar() {
        // To be implemented
        this.energyBackground = this.add
            .rectangle(150, 130, 200, 20, 0x555555)
            .setScrollFactor(0);
        this.energyFill = this.add
            .rectangle(50, 130, 200, 20, 0x0000ff)
            .setOrigin(0, 0.5)
            .setScrollFactor(0);
    }
    createEnemyKilledText() {
        // To be implemented
        this.enemyKilledText = this.add
            .text(
                Number(this.game.config.width) - 50,
                100,
                "Enemies Killed: 0",
                {
                    fontSize: "20px",
                    color: "#ffffff",
                }
            )
            .setOrigin(1, 0.5)
            .setScrollFactor(0);
    }
    createCoinsCollectedText() {
        // To be implemented
        this.coinCollectedText = this.add
            .text(
                Number(this.game.config.width) - 50,
                150,
                "Coins Collected: 0",
                {
                    fontSize: "20px",
                    color: "#ffffff",
                }
            )
            .setOrigin(1, 0.5)
            .setScrollFactor(0);
    }
    createInventory() {
        const centerX = Number(this.game.config.width) / 2;
        const centerY = Number(this.game.config.height) - 50;
        const bg = this.add.rectangle(
            centerX + 350,
            centerY,
            400,
            50,
            0x000000,
            0.5
        );
        this.weaponText = this.add
            .text(centerX + 250, centerY, "0/30")
            .setScale(2)
            .setOrigin(0.5);
        this.grenadeText = this.add
            .text(centerX + 350, centerY, "0/4")
            .setScale(2)
            .setOrigin(0.5);
        this.stimText = this.add
            .text(centerX + 450, centerY, "0/4")
            .setScale(2)
            .setOrigin(0.5);
    }

    createOptionsMenu(items: any[], player: Player) {
        // To be implemented
        const centerX = Number(this.game.config.width) / 2;
        const centerY = Number(this.game.config.height) / 2;

        // console.log(player);
        this.options = [];

        for (let i = 0; i < 3; i++) {
            const choice = new Choice(
                this,
                centerX + (i - 1) * 200,
                centerY,
                "",
                player,
                items[i].effect
            );
            choice.name.setText(items[i].name);
            choice.description.setText(items[i].description);
            this.options.push(choice);
        }
    }
    createLoseMenu() {
        const centerX = Number(this.game.config.width) / 2;
        const centerY = Number(this.game.config.height) / 2;
        this.loseMenu = this.add.container(centerX, centerY);
        const bg = this.add.rectangle(0, 0, 400, 500, 0x000000, 0.7);
        const text = this.add.text(0, -40, "you lost").setOrigin(0.5);
        this.highScore = this.add.text(0, 0, "HighScore : 0").setOrigin(0.5);
        this.coins = this.add
            .text(0, 40, this.enemyKilledText.text)
            .setOrigin(0.5);
        const claimBtn = this.add
            .rectangle(
                100,
                150,
                120,
                40,
                Phaser.Display.Color.GetColor(248, 201, 129)
            )
            .setInteractive()
            .on("pointerdown", () => {
                claimBtn.setActive(false);
                EventBus.emit("claim", this.coinToClaim);
                this.scene.stop();
                this.scene.get("Game").scene.start("Menu");
                this.scene.get("Game").scene.stop();
            });
        const claimText = this.add.text(100, 150, "Claim").setOrigin(0.5);
        const mainMenuBtn = this.add
            .rectangle(-100, 150, 120, 40, 0xff0000)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.stop();
                this.scene.get("Game").scene.start("Menu");
                this.scene.get("Game").scene.stop();
            });
        const mainMenuText = this.add
            .text(-100, 150, "Main Menu")
            .setOrigin(0.5);

        this.loseMenu
            .add([
                bg,
                text,
                this.highScore,
                this.coins,
                claimBtn,
                claimText,
                mainMenuBtn,
                mainMenuText,
            ])
            .setActive(false)
            .setVisible(false);
    }
}

