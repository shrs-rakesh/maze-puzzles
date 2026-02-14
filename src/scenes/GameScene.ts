import Phaser from "phaser";
import { LevelManager } from "../LevelManager";
import { LevelService, type Level } from "../services/LevelService";
import { PlayerService } from "../services/PlayerService";
import { UIService } from "../services/UIService";
import { MazeService } from "../services/MazeService";
import { InputService } from "../services/InputService";
import { CameraService } from "../services/CameraService";
import { LEVELS } from "../contents/levels";
import { TILE_SIZE } from "../contents/constants";

export default class GameScene extends Phaser.Scene {
	private levelManager!: LevelManager;
	private playerService!: PlayerService;
	private uiService!: UIService;
	private mazeService!: MazeService;
	private inputService!: InputService;
	private cameraService!: CameraService;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

	constructor() {
		super("GameScene");
	}

	create(): void {
		// Initialize keyboard cursors
		this.cursors = this.input.keyboard!.createCursorKeys();

		// Initialize services
		this.levelManager = new LevelManager(LEVELS);
		this.playerService = new PlayerService(this);
		this.uiService = new UIService(this);
		this.mazeService = new MazeService(this);
		this.inputService = new InputService(this);
		this.cameraService = new CameraService(this, this.playerService, TILE_SIZE);

		// Load the first level
		this.loadCurrentLevel();
	}

	update(): void {
		if (!this.cursors) return; // safety check
		this.handleKeyboardInput();
	}

	// Handle keyboard input
	private handleKeyboardInput() {
		this.inputService.update((dx, dy) => this.handleMove(dx, dy));
	}

	/** Centralized move logic for both keyboard & arrow buttons */
	private handleMove(dx: number, dy: number) {
		// Wrap the current Level in a LevelService for compatibility
		const currentLevelService = new LevelService(this.levelManager.getCurrentLevel());

		this.playerService.movePlayer(dx, dy, currentLevelService, () => {
			// Advance to the next level
			const nextLevel = this.levelManager.nextLevel();

			if (nextLevel) {
				alert(`Level ${this.levelManager.getCurrentIndex() + 1} loading...`);
				this.loadCurrentLevel();
			} else {
				alert("All levels complete!");
				this.scene.start("MenuScene");
			}
		});
	}

	/** Load the current level from LevelManager */
	private loadCurrentLevel() {
		// Wrap the current Level in a LevelService
		const levelService = new LevelService(this.levelManager.getCurrentLevel());

		// Create maze and goal
		this.mazeService.createMaze(levelService);

		// Spawn player at start position
		this.playerService.createPlayer(levelService.startX, levelService.startY);

		// Add physics collider for walls
		this.physics.add.collider(this.playerService.player, this.mazeService.walls);

		// Arrow button controls
		this.uiService.createControls((dx, dy) => this.handleMove(dx, dy));

		// Camera setup
		const rows = levelService.getRows();
    	const cols = levelService.getCols();
    	this.cameraService.setupCamera(cols, rows);
	}
}