import Phaser from "phaser";
import Player from "../entities/Player";
import { LevelService } from "./LevelService";
import { MOVE_DURATION_MS } from "../contents/constants";

interface Layout {
	tileSize: number;
	offsetX: number;
	offsetY: number;
}

export class PlayerService {
	private scene: Phaser.Scene;
	public player!: Player;
	private layout: Layout | null = null;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	createPlayer(
		tileX: number,
		tileY: number,
		tileSize: number,
		offsetX: number,
		offsetY: number
	): Player {
		// Kill any running tween and destroy old player cleanly
		if (this.player) {
			this.scene.tweens.killTweensOf(this.player);
			this.player.destroy();
		}

		this.layout = { tileSize, offsetX, offsetY };

		const px = offsetX + tileX * tileSize + tileSize / 2;
		const py = offsetY + tileY * tileSize + tileSize / 2;

		this.player = new Player(this.scene, px, py, tileSize, tileX, tileY);
		this.player.isMoving = false;

		// Add arcade physics body so colliders work
		this.scene.physics.add.existing(this.player);
		const body = this.player.body as Phaser.Physics.Arcade.Body;
		body.setCollideWorldBounds(true);

		return this.player;
	}

	movePlayer(
		dx: number,
		dy: number,
		levelService: LevelService,
		onGoal: () => void,
		onStep?: () => void,
		onArrive?: (tileX: number, tileY: number) => void
	) {
		if (!this.layout) return;
		if (this.player.isMoving) return;

		const newX = this.player.tileX + dx;
		const newY = this.player.tileY + dy;

		if (levelService.isWall(newX, newY)) return;

		// Count only successful moves
		onStep?.();

		this.player.tileX = newX;
		this.player.tileY = newY;
		this.player.isMoving = true;

		const { tileSize, offsetX, offsetY } = this.layout;

		this.scene.tweens.add({
			targets: this.player,
			x: offsetX + newX * tileSize + tileSize / 2,
			y: offsetY + newY * tileSize + tileSize / 2,
			duration: MOVE_DURATION_MS,
			ease: "Quad.easeOut",
			onComplete: () => {
				if (!this.player?.active) return;
				this.player.isMoving = false;
				// onArrive fires first so enemy collision is checked before goal
				onArrive?.(newX, newY);
				if (levelService.isGoal(newX, newY)) {
					onGoal();
				}
			},
		});
	}
}