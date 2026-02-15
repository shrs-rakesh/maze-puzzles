// PlayerService.ts
import Phaser from "phaser";
import Player from "../entities/Player";

export class PlayerService {
	private scene: Phaser.Scene;
	public player!: Player;

	private tileSize!: number;
	private offsetX!: number;
	private offsetY!: number;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	createPlayer(tileX: number, tileY: number, tileSize: number, offsetX: number, offsetY: number) {
        // Remove old player if exists
        if (this.player) this.player.destroy();

        this.tileSize = tileSize;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.player = new Player(
            this.scene,
            offsetX + tileX * tileSize + tileSize / 2,
            offsetY + tileY * tileSize + tileSize / 2,
            tileSize
        );

        this.player.tileX = tileX;
        this.player.tileY = tileY;
        this.player.isMoving = false;

        return this.player;
    }

	movePlayer(dx: number, dy: number, levelService: any, onGoal: () => void) {
		if (this.player.isMoving) return;

		const newX = this.player.tileX + dx;
		const newY = this.player.tileY + dy;

		if (levelService.isWall(newX, newY)) return;

		this.player.tileX = newX;
		this.player.tileY = newY;
		this.player.isMoving = true;

		this.scene.tweens.add({
			targets: this.player,
			x: this.offsetX + newX * this.tileSize + this.tileSize / 2,
			y: this.offsetY + newY * this.tileSize + this.tileSize / 2,
			duration: 120,
			onComplete: () => {
				this.player.isMoving = false;
				if (levelService.isGoal(newX, newY)) {
					onGoal();
				}
			}
		});
	}
}