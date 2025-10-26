import { Player } from "../player/player";
import { weaponInfo } from "../weaponInfo";
import { WeaponObject } from "./weaponObject";

export const normalUpgrade = [
    {
        name: "Adrenaline Rush",
        description: "increases player speed by 15%",
        effect: (player: Player) => {
            const upgrade = (15 / 100) * player.speed;
            player.speed += upgrade;
        },
    },
    {
        name: "Recovery",
        description: "increase Players health by 15",
        effect: (player: Player) => {
            player.health += 15;
            player.health = Phaser.Math.Clamp(
                player.health,
                0,
                player.MaxHealth
            );
        },
    },
    {
        name: "Reinforced Health",
        description: "increase Players Max Health by 15%",
        effect: (player: Player) => {
            const healthUpgrade = (15 / 100) * player.MaxHealth;
            player.MaxHealth += healthUpgrade;
        },
    },
    {
        name: "High Calibar",
        description: "increase Players Damage by 15%",
        effect: (player: Player) => {
            const healthDamage = (15 / 100) * player.inventory.damage;
            player.inventory.damage += healthDamage;
        },
    },
    {
        name: "High Magazine",
        description: "increase Players Max Ammo by 2",
        effect: (player: Player) => {
            player.inventory.maxAmmo += 2;
        },
    },
    {
        name: "High fire rate",
        description: "increase Players fireRate by 5%",
        effect: (player: Player) => {
            const increasedFireRate = (5 / 100) * player.inventory.fireRate;
            player.inventory.fireRate -= increasedFireRate;
        },
    },
];

