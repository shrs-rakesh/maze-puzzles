import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload(): void {
        // Load minimal boot assets if needed
    }

    create(): void {
        this.scene.start("PreloadScene");
    }
}
