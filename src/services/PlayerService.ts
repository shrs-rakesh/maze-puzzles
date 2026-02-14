import Phaser from "phaser";
import Player from "../entities/Player";

const TILE_SIZE = 70;

export class PlayerService {
    private scene: Phaser.Scene;
    public player!: Player;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    createPlayer(x: number, y: number) {
        this.player = new Player(this.scene, x, y, TILE_SIZE);
        this.player.isMoving = false;
        return this.player;
    }

    movePlayer(dx: number, dy: number, levelService: any, onGoal: () => void) {
        if (this.player.isMoving) return;

        const newX = this.player.tileX + dx;
        const newY = this.player.tileY + dy;

        // Check wall
        if (levelService.isWall(newX, newY)) return;

        this.player.tileX = newX;
        this.player.tileY = newY;
        this.player.isMoving = true;

        this.scene.tweens.add({
            targets: this.player,
            x: this.player.tileX * TILE_SIZE + TILE_SIZE / 2,
            y: this.player.tileY * TILE_SIZE + TILE_SIZE / 2,
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