import Phaser from "phaser";

export class UIService {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    createControls(onMove: (dx: number, dy: number) => void) {
        const baseX = 230;
        const baseY = 625;
        const spacing = 70;

        const directions = [
            { dx: 0, dy: -1, x: baseX, y: baseY - spacing, label: "↑" },
            { dx: 0, dy: 1, x: baseX, y: baseY + spacing, label: "↓" },
            { dx: -1, dy: 0, x: baseX - spacing, y: baseY, label: "←" },
            { dx: 1, dy: 0, x: baseX + spacing, y: baseY, label: "→" },
        ];

        directions.forEach(dir => {
            const button = this.scene.add.circle(dir.x, dir.y, 35, 0xffee00, 0.6);
            button.setStrokeStyle(3, 0xffffff);
            button.setInteractive({ useHandCursor: true });

            this.scene.add.text(dir.x, dir.y, dir.label, {
                fontSize: "30px",
                color: "#ffffff"
            }).setOrigin(0.5);

            button.on("pointerdown", () => onMove(dir.dx, dir.dy));
        });
    }
}