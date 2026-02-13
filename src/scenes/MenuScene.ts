import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    create(): void {
        this.add.text(140, 300, "Maze Puzzles", {
            fontSize: "32px",
            color: "#333",
        });

        const startButton = this.add.text(180, 400, "Start", {
            fontSize: "28px",
            backgroundColor: "#ffcc00",
            padding: { x: 20, y: 10 },
        });

        startButton.setInteractive();
        startButton.on("pointerdown", () => {
            this.scene.start("GameScene");
        });
    }
}
