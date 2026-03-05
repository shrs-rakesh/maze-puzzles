import Phaser from "phaser";
import Enemy from "../entities/Enemy";
import { LevelService } from "./LevelService";
import { MOVE_DURATION_MS, TILE } from "../contents/constants";

// Enemy takes one step every N player moves
const ENEMY_MOVE_INTERVAL = 2;

// Cardinal directions the enemy can move
const DIRECTIONS = [
	{ dx: 0, dy: -1 },
	{ dx: 0, dy: 1 },
	{ dx: -1, dy: 0 },
	{ dx: 1, dy: 0 },
];

interface Layout {
	tileSize: number;
	offsetX: number;
	offsetY: number;
}

export class EnemyService {
	private scene: Phaser.Scene;
	private enemy: Enemy | null = null;
	private layout: Layout | null = null;
	private stepsSinceLastMove: number = 0;
	private lastDirection: { dx: number; dy: number } = { dx: 1, dy: 0 };

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	createEnemy(
		levelService: LevelService,
		tileSize: number,
		offsetX: number,
		offsetY: number,
		playerTileX: number,
		playerTileY: number
	): void {
		this.clear();
		this.layout = { tileSize, offsetX, offsetY };
		this.stepsSinceLastMove = 0;

		const spawnTile = this.findSpawnTile(levelService, playerTileX, playerTileY);
		if (!spawnTile) return; // no valid spawn found — skip enemy for this level

		const px = offsetX + spawnTile.x * tileSize + tileSize / 2;
		const py = offsetY + spawnTile.y * tileSize + tileSize / 2;

		this.enemy = new Enemy(this.scene, px, py, tileSize, spawnTile.x, spawnTile.y);
	}

	// Get current enemy tile position — used by GameScene to check player collision
	getEnemyTile(): { x: number; y: number } | null {
		if (!this.enemy) return null;
		return { x: this.enemy.tileX, y: this.enemy.tileY };
	}

	// Call this after every successful player step.
	// getPlayerTile is a getter so the catch check always reads the latest position.
	onPlayerStep(
		levelService: LevelService,
		getPlayerTile: () => { x: number; y: number },
		onCatch: () => void
	): void {
		if (!this.enemy || !this.layout) return;

		this.stepsSinceLastMove++;
		if (this.stepsSinceLastMove < ENEMY_MOVE_INTERVAL) return;
		this.stepsSinceLastMove = 0;

		this.moveEnemy(levelService, getPlayerTile, onCatch);
	}

	clear(): void {
		if (this.enemy) {
			this.scene.tweens.killTweensOf(this.enemy);
			this.enemy.destroy();
			this.enemy = null;
		}
		this.layout = null;
		this.stepsSinceLastMove = 0;
	}

	// ── Private helpers ───────────────────────────────────────────

	private moveEnemy(
		levelService: LevelService,
		getPlayerTile: () => { x: number; y: number },
		onCatch: () => void
	): void {
		if (!this.enemy || !this.layout || this.enemy.isMoving) return;

		// Read current player position for chase direction
		const { x: px, y: py } = getPlayerTile();
		const next = this.chooseNextTile(levelService, px, py);
		if (!next) return;

		this.enemy.tileX = next.x;
		this.enemy.tileY = next.y;
		this.enemy.isMoving = true;

		const { tileSize, offsetX, offsetY } = this.layout;

		this.scene.tweens.add({
			targets: this.enemy,
			x: offsetX + next.x * tileSize + tileSize / 2,
			y: offsetY + next.y * tileSize + tileSize / 2,
			duration: MOVE_DURATION_MS * 1.5,
			ease: "Quad.easeOut",
			onComplete: () => {
				if (!this.enemy?.active) return;
				this.enemy.isMoving = false;

				// Read player's CURRENT tile at tween completion — not stale coords
				const { x: currentPX, y: currentPY } = getPlayerTile();
				if (this.enemy.tileX === currentPX && this.enemy.tileY === currentPY) {
					onCatch();
				}
			},
		});
	}

	// Enemy moves toward the player using simple direction bias,
	// falling back to a random valid direction to avoid getting stuck
	private chooseNextTile(
		levelService: LevelService,
		playerTileX: number,
		playerTileY: number
	): { x: number; y: number } | null {
		if (!this.enemy) return null;

		const ex = this.enemy.tileX;
		const ey = this.enemy.tileY;

		// Build list of valid (non-wall) moves
		const valid = DIRECTIONS.filter(
			({ dx, dy }) => !levelService.isWall(ex + dx, ey + dy)
		);
		if (valid.length === 0) return null;

		// Prefer direction that moves closer to the player
		const toward = valid.sort((a, b) => {
			const distA = this.distToPlayer(ex + a.dx, ey + a.dy, playerTileX, playerTileY);
			const distB = this.distToPlayer(ex + b.dx, ey + b.dy, playerTileX, playerTileY);
			return distA - distB;
		});

		// 70% chance to chase, 30% chance random — prevents enemy getting trapped
		const chosen =
			Math.random() < 0.7
				? toward[0]
				: valid[Math.floor(Math.random() * valid.length)];

		this.lastDirection = chosen;
		return { x: ex + chosen.dx, y: ey + chosen.dy };
	}

	// Manhattan distance
	private distToPlayer(
		ex: number,
		ey: number,
		px: number,
		py: number
	): number {
		return Math.abs(ex - px) + Math.abs(ey - py);
	}

	// Find a random open tile that is far enough from the player
	private findSpawnTile(
		levelService: LevelService,
		playerTileX: number,
		playerTileY: number
	): { x: number; y: number } | null {
		const rows = levelService.getRows();
		const cols = levelService.getCols();
		const candidates: { x: number; y: number }[] = [];

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const tile = levelService.getTile(x, y);
				const dist = Math.abs(x - playerTileX) + Math.abs(y - playerTileY);
				// Must be open, not goal, and at least 5 tiles away from player
				if (tile === TILE.EMPTY && dist >= 5) {
					candidates.push({ x, y });
				}
			}
		}

		if (candidates.length === 0) return null;

		// Pick a random candidate
		return candidates[Math.floor(Math.random() * candidates.length)];
	}
}