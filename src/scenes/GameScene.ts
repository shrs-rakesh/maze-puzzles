import Phaser from "phaser";
import { LevelManager } from "../LevelManager";
import { LevelService } from "../services/LevelService";
import { PlayerService } from "../services/PlayerService";
import { UIService } from "../services/UIService";
import { MazeService } from "../services/MazeService";
import { InputService } from "../services/InputService";
import { CameraService } from "../services/CameraService";
import { LEVELS } from "../contents/levels";

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
		this.cursors = this.input.keyboard!.createCursorKeys();

		this.levelManager = new LevelManager(LEVELS);
		this.playerService = new PlayerService(this);
		this.uiService = new UIService(this);
		this.mazeService = new MazeService(this);
		this.inputService = new InputService(this);

		this.loadCurrentLevel();
	}

	update(): void {
		if (!this.cursors) return;
		this.handleKeyboardInput();
	}

	private handleKeyboardInput() {
		this.inputService.update((dx, dy) => this.handleMove(dx, dy));
	}

	private handleMove(dx: number, dy: number) {
		const currentLevelService = new LevelService(
			this.levelManager.getCurrentLevel()
		);

		this.playerService.movePlayer(dx, dy, currentLevelService, () => {
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

	private loadCurrentLevel() {
		const level = this.levelManager.getCurrentLevel();
		const levelService = new LevelService(level);

		const rows = level.maze.length;
		const cols = level.maze[0].length;

		const GAME_WIDTH = 480;
		const WORLD_HEIGHT = 600; // reserve bottom for UI

		// Dynamic tile size
		const tileSize = Math.floor(
			Math.min(
				GAME_WIDTH / cols,
				WORLD_HEIGHT / rows
			)
		);

		// Maze offsets
		const offsetX = (GAME_WIDTH - cols * tileSize) / 2;
		const offsetY = (WORLD_HEIGHT - rows * tileSize) / 2;

		// Create maze
		this.mazeService.createMaze(levelService, tileSize, offsetX, offsetY);

		// Create player aligned with maze
		this.playerService.createPlayer(
			levelService.startX,
			levelService.startY,
			tileSize,
			offsetX,
			offsetY
		);

		// Physics collider
		this.physics.add.collider(
			this.playerService.player,
			this.mazeService.walls
		);

		// Arrow UI
		this.uiService.createControls((dx, dy) =>
			this.handleMove(dx, dy)
		);

		// Camera setup
		this.cameraService = new CameraService(
			this,
			this.playerService,
			tileSize
		);

		this.cameraService.setupCamera(cols, rows);
	}
}