import Phaser from "phaser";
import { LevelService } from "./LevelService";

const TILE_SIZE = 70;

export class MazeService {
	private scene: Phaser.Scene;
	public walls!: Phaser.Physics.Arcade.StaticGroup;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.walls = this.scene.physics.add.staticGroup();
	}

	/**
	 * Creates maze walls and goal based on the current level.
	 */
	createMaze(levelService: LevelService) {
		// Clear previous walls
		this.walls.clear(true, true);

		const maze = levelService.currentMaze;

		for (let row = 0; row < maze.length; row++) {
			for (let col = 0; col < maze[row].length; col++) {
				if (maze[row][col] === 1) {
					const wall = this.scene.add.rectangle(
						col * TILE_SIZE,
						row * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE,
						0x8ecae6
					).setOrigin(0);

					this.scene.physics.add.existing(wall, true);
					this.walls.add(wall);
				} else if (maze[row][col] === 2) {
					this.scene.add.rectangle(
						col * TILE_SIZE,
						row * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE,
						0x00ff00
					).setOrigin(0);
				}
			}
		}
	}
}