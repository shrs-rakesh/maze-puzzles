import Phaser from "phaser";
import { LevelManager } from "../LevelManager";
import { LevelService } from "../services/LevelService";
import { PlayerService } from "../services/PlayerService";
import { UIService } from "../services/UIService";
import { MazeService } from "../services/MazeService";
import { InputService } from "../services/InputService";
import { CameraService } from "../services/CameraService";
import { TransitionService } from "../services/TransitionService";
import { LEVELS } from "../contents/levels";
import { UI_HEIGHT, FIXED_TILE_SIZE } from "../contents/constants";

export default class GameScene extends Phaser.Scene {
	private levelManager!: LevelManager;
	private currentLevelService!: LevelService;
	private playerService!: PlayerService;
	private uiService!: UIService;
	private mazeService!: MazeService;
	private inputService!: InputService;
	private cameraService!: CameraService;
	private wallCollider!: Phaser.Physics.Arcade.Collider;
	private transitionService!: TransitionService;

	constructor() {
		super("GameScene");
	}

	create(): void {
		this.levelManager = new LevelManager(LEVELS);
		this.playerService = new PlayerService(this);
		this.uiService = new UIService(this);
		this.mazeService = new MazeService(this);
		this.inputService = new InputService(this);
		this.cameraService = new CameraService(this, this.playerService);
		this.transitionService = new TransitionService(this);
		this.loadCurrentLevel();
	}

	update(): void {
		this.inputService.update((dx, dy) => this.handleMove(dx, dy));
	}

	private handleMove(dx: number, dy: number) {
		this.playerService.movePlayer(dx, dy, this.currentLevelService, () => {
			const nextLevel = this.levelManager.nextLevel();
			if (nextLevel) {
				this.transitionService.showLevelStart(this.levelManager.getCurrentIndex() + 1, () => {
					this.loadCurrentLevel();
				});
			} else {
				this.transitionService.showVictory(() => {
					this.scene.start("MenuScene");
				});
			}
		});
	}

	private clearLevel() {
		this.mazeService.clear();
		this.uiService.clear();
		if (this.wallCollider) {
			this.physics.world.removeCollider(this.wallCollider);
		}
	}

	private loadCurrentLevel() {
		this.clearLevel();

		const level = this.levelManager.getCurrentLevel();
		this.currentLevelService = new LevelService(level);

		const rows = level.maze.length;
		const cols = level.maze[0].length;

		const tileSize = FIXED_TILE_SIZE;

		const mazePixelW = cols * tileSize;
		const mazePixelH = rows * tileSize;
		const { width: screenW, height: screenH } = this.scale;

		// Reserve bottom for UI so maze centers only within the gameplay area
		const gameplayH = screenH - UI_HEIGHT;

		// Center maze if it fits; scroll if it is larger than screen
		const offsetX = mazePixelW < screenW ? (screenW - mazePixelW) / 2 : 0;
		const offsetY = mazePixelH < gameplayH ? (gameplayH - mazePixelH) / 2 : 0;

		// Build maze at world coordinates
		this.mazeService.createMaze(this.currentLevelService, tileSize, offsetX, offsetY);

		// Place player
		this.playerService.createPlayer(
			this.currentLevelService.startX,
			this.currentLevelService.startY,
			tileSize,
			offsetX,
			offsetY
		);

		// Physics collider
		this.wallCollider = this.physics.add.collider(
			this.playerService.player,
			this.mazeService.walls
		);

		// UI is fixed to camera — not affected by world scroll
		this.uiService.createControls((dx, dy) => this.handleMove(dx, dy));

		// Setup scrolling camera
		this.cameraService.reset(this.playerService);
		this.cameraService.setupCamera(cols, rows, offsetX, offsetY);
	}

}