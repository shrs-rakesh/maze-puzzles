import Phaser from "phaser";
import { StatsService } from "./StatsService";

const HUD_DEPTH = 15;
const HUD_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
	fontSize: "16px",
	color: "#ffffff",
	fontStyle: "bold",
	shadow: {
		offsetX: 1,
		offsetY: 1,
		color: "#000000",
		blur: 2,
		fill: true,
	},
};

export class HUDService {
	private scene: Phaser.Scene;
	private statsService: StatsService;

	private levelText!: Phaser.GameObjects.Text;
	private stepsText!: Phaser.GameObjects.Text;
	private timerText!: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, statsService: StatsService) {
		this.scene = scene;
		this.statsService = statsService;
	}

	create(levelIndex: number, totalLevels: number): void {
		const { width } = this.scene.scale;
		const padding = 12;

		// Level indicator — top left
		this.levelText = this.scene.add
			.text(padding, padding, this.levelLabel(levelIndex, totalLevels), HUD_STYLE)
			.setScrollFactor(0)
			.setDepth(HUD_DEPTH);

		// Step counter — top center
		this.stepsText = this.scene.add
			.text(width / 2, padding, "Steps: 0", HUD_STYLE)
			.setOrigin(0.5, 0)
			.setScrollFactor(0)
			.setDepth(HUD_DEPTH);

		// Timer — top right
		this.timerText = this.scene.add
			.text(width - padding, padding, "00:00", HUD_STYLE)
			.setOrigin(1, 0)
			.setScrollFactor(0)
			.setDepth(HUD_DEPTH);
	}

	// Call every frame from GameScene.update()
	update(): void {
		if (this.stepsText) {
			this.stepsText.setText(`Steps: ${this.statsService.getSteps()}`);
		}
		if (this.timerText) {
			this.timerText.setText(this.statsService.getFormattedTime());
		}
	}

	clear(): void {
		this.levelText?.destroy();
		this.stepsText?.destroy();
		this.timerText?.destroy();
	}

	private levelLabel(levelIndex: number, totalLevels: number): string {
		return `Level ${levelIndex + 1} / ${totalLevels}`;
	}
}