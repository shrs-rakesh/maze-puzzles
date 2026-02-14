import Phaser from "phaser";
import { LevelService } from "../services/LevelService";
import type { Level } from "../services/LevelService";
import { PlayerService } from "../services/PlayerService";
import { UIService } from "../services/UIService";
import { MazeService } from "../services/MazeService";
import { InputService } from "../services/InputService";


const LEVEL: Level = {
	maze: [
		[1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 1, 1, 0, 1],
		[1, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 0, 0, 2, 1],
		[1, 0, 0, 0, 1, 0, 1],
		[1, 1, 1, 1, 1, 1, 1],
	],
	startX: 1,
	startY: 1
};

export default class GameScene extends Phaser.Scene {
	private levelService!: LevelService;
	private playerService!: PlayerService;
	private uiService!: UIService;
	private mazeService!: MazeService;
	private inputService!: InputService;
	private walls!: Phaser.Physics.Arcade.StaticGroup;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

	constructor() {
		super("GameScene");
	}

	create(): void {
		this.cursors = this.input.keyboard?.createCursorKeys()!;

		// Services
		this.levelService = new LevelService(LEVEL);
		this.playerService = new PlayerService(this);
		this.uiService = new UIService(this);
		this.mazeService = new MazeService(this);
		this.inputService = new InputService(this);

		this.walls = this.physics.add.staticGroup();

		// Maze & goal
		this.mazeService.createMaze(this.levelService);

		// Player
		const { startX, startY } = LEVEL;
		this.playerService.createPlayer(startX, startY);
		this.physics.add.collider(this.playerService.player, this.walls);

		// UI Controls (arrow buttons)
		this.uiService.createControls((dx, dy) => this.handleMove(dx, dy));
	}

	update(): void {
		if (!this.cursors) return; // safety check
		this.handleKeyboardInput();
	}

	// Handle keyboard input
	private handleKeyboardInput() {
		this.inputService.update((dx, dy) => this.handleMove(dx, dy));
	}

	// Centralized move logic
	private handleMove(dx: number, dy: number) {
		this.playerService.movePlayer(dx, dy, this.levelService, () => {
			alert("You reached the goal!");
		});
	}
}