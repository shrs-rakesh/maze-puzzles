import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload(): void {
        // Placeholder assets
        this.load.image("player", "assets/player.png");
    }

    create(): void {
        this.scene.start("MenuScene");
    }
}
