import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import RAPIER from "@dimforge/rapier2d-compat";

export class Physics extends Scene {
    constructor() {
        super("Physics");
    }

    async preload() {
        await this.initializePhysics();
    }

    create() {
        EventBus.emit("current-scene-ready", this);
    }

    async initializePhysics() {
        await RAPIER.init();
        this.scene.start("Game");
    }
}

