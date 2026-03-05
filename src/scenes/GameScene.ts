import Phaser from "phaser";
import { LevelManager } from "../LevelManager";
import { LevelService } from "../services/LevelService";
import { PlayerService } from "../services/PlayerService";
import { UIService } from "../services/UIService";
import { MazeService } from "../services/MazeService";
import { InputService } from "../services/InputService";
import { CameraService } from "../services/CameraService";
import { TransitionService } from "../services/TransitionService";
import { StatsService } from "../services/StatsService";
import { HUDService } from "../services/HUDService";
import { EnemyService } from "../services/EnemyService";
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
	private transitionService!: TransitionService;
	private statsService!: StatsService;
	private hudService!: HUDService;
	private wallCollider!: Phaser.Physics.Arcade.Collider;
	private enemyService!: EnemyService;

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
		this.statsService = new StatsService();
		this.hudService = new HUDService(this, this.statsService);
		this.enemyService = new EnemyService(this);
		this.loadCurrentLevel();
	}

	update(): void {
		this.inputService.update((dx, dy) => this.handleMove(dx, dy));
		this.hudService.update(); // refreshes timer + step counter every frame
	}

	private handleMove(dx: number, dy: number) {
		this.playerService.movePlayer(
			dx, dy,
			this.currentLevelService,
			() => {
				// onGoal
				this.statsService.stopLevel();
				const currentIndex = this.levelManager.getCurrentIndex();
				const nextLevel = this.levelManager.nextLevel();
				this.transitionService.showLevelComplete(
					this.statsService,
					currentIndex,
					LEVELS[currentIndex].par,
					() => {
						if (nextLevel) {
							this.transitionService.showLevelStart(
								this.levelManager.getCurrentIndex() + 1,
								() => this.loadCurrentLevel()
							);
						} else {
							this.transitionService.showVictory(this.statsService, () => {
								this.scene.start("MenuScene");
							});
						}
					}
				);
			},
			() => {
				// onStep: fires immediately on valid move — trigger enemy movement
				this.statsService.incrementSteps();
				this.enemyService.onPlayerStep(
					this.currentLevelService,
					() => ({
						x: this.playerService.player.tileX,
						y: this.playerService.player.tileY,
					}),
					() => this.handleCaught()
				);
			},
			(tileX, tileY) => {
				// onArrive: fires when player tween completes — check if landed on enemy
				const enemyTile = this.enemyService.getEnemyTile();
				if (enemyTile && tileX === enemyTile.x && tileY === enemyTile.y) {
					this.handleCaught();
				}
			}
		);
	}


	private clearLevel() {
		this.mazeService.clear();
		this.uiService.clear();
		this.hudService.clear();
		this.enemyService.clear();
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

		const gameplayH = screenH - UI_HEIGHT;
		const offsetX = mazePixelW < screenW ? (screenW - mazePixelW) / 2 : 0;
		const offsetY = mazePixelH < gameplayH ? (gameplayH - mazePixelH) / 2 : 0;

		// Build maze
		this.mazeService.createMaze(this.currentLevelService, tileSize, offsetX, offsetY);

		// Place player
		this.playerService.createPlayer(
			this.currentLevelService.startX,
			this.currentLevelService.startY,
			tileSize,
			offsetX,
			offsetY
		);

		// Spawn enemy on open tile away from player
		this.enemyService.createEnemy(
			this.currentLevelService,
			tileSize,
			offsetX,
			offsetY,
			this.currentLevelService.startX,
			this.currentLevelService.startY
		);

		// Physics collider
		this.wallCollider = this.physics.add.collider(
			this.playerService.player,
			this.mazeService.walls
		);

		// UI controls
		this.uiService.createControls((dx, dy) => this.handleMove(dx, dy));

		// HUD — level indicator, steps, timer
		this.hudService.create(
			this.levelManager.getCurrentIndex(),
			LEVELS.length
		);

		// Camera
		this.cameraService.reset(this.playerService);
		this.cameraService.setupCamera(cols, rows, offsetX, offsetY);

		// Start tracking stats for this level
		this.statsService.startLevel();
	}
	private handleCaught(): void {
		// Flash screen red then restart the level
		this.cameras.main.flash(300, 255, 0, 0);
		this.statsService.stopLevel();
		this.time.delayedCall(400, () => {
			this.levelManager.resetCurrentLevel();
			this.loadCurrentLevel();
		});
	}
}