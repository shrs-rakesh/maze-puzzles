import Phaser from "phaser";

export class UIService {
	private scene: Phaser.Scene;
	private buttons: Phaser.GameObjects.Arc[] = [];
	private labels: Phaser.GameObjects.Text[] = [];
	private holdTimers: (Phaser.Time.TimerEvent | null)[] = [];

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	createControls(onMove: (dx: number, dy: number) => void) {
		this.clear();

		const { width, height } = this.scene.scale;
		const baseX = width / 2;
		const baseY = height - 120; // pulled up from bottom edge
		const spacing = 60;
		const buttonRadius = Math.min(width * 0.07, 30); // cap radius at 30px

		const directions = [
			{ dx: 0,  dy: -1, x: baseX,           y: baseY - spacing, label: "↑" },
			{ dx: 0,  dy: 1,  x: baseX,           y: baseY + spacing, label: "↓" },
			{ dx: -1, dy: 0,  x: baseX - spacing, y: baseY,           label: "←" },
			{ dx: 1,  dy: 0,  x: baseX + spacing, y: baseY,           label: "→" },
		];

		directions.forEach((dir, i) => {
			// setScrollFactor(0) on each object individually
			const button = this.scene.add
				.circle(dir.x, dir.y, buttonRadius, 0xffee00, 0.6)
				.setStrokeStyle(3, 0xffffff)
				.setInteractive({ useHandCursor: true })
				.setScrollFactor(0)
				.setDepth(20);

			const label = this.scene.add
				.text(dir.x, dir.y, dir.label, { fontSize: "24px", color: "#ffffff" })
				.setOrigin(0.5)
				.setScrollFactor(0)
				.setDepth(21);

			this.holdTimers[i] = null;

			const press = () => button.setFillStyle(0xffee00, 1.0);
			const release = () => {
				button.setFillStyle(0xffee00, 0.6);
				this.holdTimers[i]?.remove();
				this.holdTimers[i] = null;
			};

			button.on("pointerdown", () => {
				press();
				onMove(dir.dx, dir.dy);
				this.holdTimers[i] = this.scene.time.addEvent({
					delay: 150,
					callback: () => onMove(dir.dx, dir.dy),
					loop: true,
				});
			});

			button.on("pointerup", release);
			button.on("pointerout", release);

			this.buttons.push(button);
			this.labels.push(label);
		});
	}

	clear() {
		this.buttons.forEach((b) => b.destroy());
		this.labels.forEach((l) => l.destroy());
		this.holdTimers.forEach((t) => t?.remove());
		this.buttons = [];
		this.labels = [];
		this.holdTimers = [];
	}
}