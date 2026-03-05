import Phaser from "phaser";
import { PlayerService } from "./PlayerService";

// Fixed tile size regardless - world scrolls instead of shrinking
import { FIXED_TILE_SIZE, CAMERA_LERP } from "../contents/constants";

export class CameraService {
	private scene: Phaser.Scene;
	private playerService: PlayerService;

	constructor(scene: Phaser.Scene, playerService: PlayerService) {
		this.scene = scene;
		this.playerService = playerService;
	}

	reset(playerService: PlayerService) {
		this.playerService = playerService;
	}

	setupCamera(
		mazeWidthInTiles: number,
		mazeHeightInTiles: number,
		offsetX = 0,
		offsetY = 0
	) {
		const mazeWidth = mazeWidthInTiles * FIXED_TILE_SIZE;
		const mazeHeight = mazeHeightInTiles * FIXED_TILE_SIZE;
		const { width: screenW, height: screenH } = this.scene.scale;
		const UI_HEIGHT = 180;
		const gameplayH = screenH - UI_HEIGHT;

		// If maze fits within gameplay area it is centered — lock camera to screen
		// If maze is larger — camera scrolls within maze bounds
		const isCenteredX = mazeWidth < screenW;
		const isCenteredY = mazeHeight < gameplayH;

		const boundsX = isCenteredX ? 0 : offsetX;
		const boundsY = isCenteredY ? 0 : offsetY;
		const boundsW = isCenteredX ? screenW : mazeWidth;
		const boundsH = isCenteredY ? screenH : mazeHeight;

		this.scene.physics.world.setBounds(boundsX, boundsY, boundsW, boundsH);
		this.scene.cameras.main.setBounds(boundsX, boundsY, boundsW, boundsH);

		// Smooth follow — camera scrolls to keep player centered
		this.scene.cameras.main.startFollow(
			this.playerService.player,
			true,
			CAMERA_LERP,
			CAMERA_LERP
		);

		this.scene.cameras.main.setZoom(1);

		// Small deadzone so camera doesn't jitter on every step
		this.scene.cameras.main.setDeadzone(FIXED_TILE_SIZE, FIXED_TILE_SIZE);
	}
}