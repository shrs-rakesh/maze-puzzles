import Phaser from "phaser";

import { StatsService, type LevelRecord } from "./StatsService";

export class TransitionService {
	private scene: Phaser.Scene;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	private showOverlay(lines: string[], onDone: () => void, duration = 1800): void {
		const { width, height } = this.scene.scale;

		const overlay = this.scene.add
			.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75)
			.setScrollFactor(0)
			.setDepth(20);

		const text = this.scene.add
			.text(width / 2, height / 2, lines, {
				fontSize: "22px",
				color: "#ffffff",
				fontStyle: "bold",
				align: "center",
				lineSpacing: 10,
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

	// Show level start banner e.g. "Level 3"
	showLevelStart(levelNumber: number, onDone: () => void): void {
		this.showOverlay([`Level ${levelNumber}`], onDone, 1000);
	}

	// Show level complete with stats summary
	showLevelComplete(
		statsService: StatsService,
		levelIndex: number,
		par: number | undefined,
		onDone: () => void
	): void {
		const summary = statsService.getSummary(levelIndex);
		const lines: string[] = [
			"Level Complete!",
			"",
			`Steps:  ${summary.steps}${par ? "  (par " + par + ")" : ""}`,
			`Time:   ${summary.time}`,
		];

		if (summary.best) {
			lines.push("");
			if (summary.isNewRecord) {
				lines.push("🏆 New Best Record!");
			} else {
				lines.push(`Best:  ${summary.best.bestSteps} steps  |  ${this.formatTime(summary.best.bestTime)}`);
			}
		}

		this.showOverlay(lines, onDone, 2500);
	}

	// Show victory screen at the end of all levels
	showVictory(statsService: StatsService, onDone: () => void): void {
		const lines = [
			"🎉 You Win!",
			"",
			"All levels complete!",
		];
		this.showOverlay(lines, onDone, 2500);
	}

	private formatTime(totalSeconds: number): string {
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}
}