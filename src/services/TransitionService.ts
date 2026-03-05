import Phaser from "phaser";

export class TransitionService {
	private scene: Phaser.Scene;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	show(message: string, onDone: () => void, duration = 1200): void {
		const { width, height } = this.scene.scale;

		const overlay = this.scene.add
			.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
			.setScrollFactor(0)
			.setDepth(20);

		const text = this.scene.add
			.text(width / 2, height / 2, message, {
				fontSize: "36px",
				color: "#ffffff",
				fontStyle: "bold",
			})
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setDepth(21);

		// Fade in
		overlay.setAlpha(0);
		text.setAlpha(0);
		this.scene.tweens.add({
			targets: [overlay, text],
			alpha: 1,
			duration: 200,
			ease: "Quad.easeIn",
		});

		// Wait, then fade out and call onDone
		this.scene.time.delayedCall(duration, () => {
			this.scene.tweens.add({
				targets: [overlay, text],
				alpha: 0,
				duration: 200,
				ease: "Quad.easeOut",
				onComplete: () => {
					overlay.destroy();
					text.destroy();
					onDone();
				},
			});
		});
	}

	showLevelStart(levelNumber: number, onDone: () => void): void {
		this.show(`Level ${levelNumber}`, onDone);
	}

	showVictory(onDone: () => void): void {
		this.show("You Win!", onDone, 2000);
	}
}