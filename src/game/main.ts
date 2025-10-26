import { Game as MainGame } from "./scenes/Game";
import { Menu as MenuScene } from "./scenes/Menu";
import { Physics as PhysicsScene } from "./scenes/physics";
import { Ui as UiScene } from "./scenes/Ui";
import { Boot as BootScene } from "./scenes/Boot";
import { AUTO, Game, Types } from "phaser";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 720,
    parent: "game-container",
    backgroundColor: "#9b683b",
    scene: [BootScene, MenuScene, PhysicsScene, MainGame, UiScene],
    pixelArt: true,
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

