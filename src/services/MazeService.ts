import Phaser from "phaser";
import { LevelService } from "./LevelService";
import { TILE } from "../contents/constants";

export class MazeService {
	private scene: Phaser.Scene;
	public walls!: Phaser.Physics.Arcade.StaticGroup;
	public goalGroup!: Phaser.Physics.Arcade.StaticGroup;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.walls = this.scene.physics.add.staticGroup();
		this.goalGroup = this.scene.physics.add.staticGroup();
	}

	createMaze(
		levelService: LevelService,
		tileSize: number,
		offsetX: number,
		offsetY: number
	) {
		this.clear();

		const maze = levelService.currentMaze;
		const rows = maze.length;
		const cols = maze[0].length;

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				// Use center-based coords (no setOrigin needed — physics bodies align correctly)
				const cx = offsetX + col * tileSize + tileSize / 2;
				const cy = offsetY + row * tileSize + tileSize / 2;

				if (maze[row][col] === TILE.WALL) {
					// Add directly to staticGroup via add.rectangle + physics.add.existing
					const wall = this.scene.add.rectangle(cx, cy, tileSize, tileSize, 0x8ecae6);
					this.scene.physics.add.existing(wall, true);
					this.walls.add(wall);
				} else if (maze[row][col] === TILE.GOAL) {
					const goal = this.scene.add.rectangle(cx, cy, tileSize, tileSize, 0x00ff00);
					this.scene.physics.add.existing(goal, true);
					this.goalGroup.add(goal);
				}
			}
		}
	}

	// Destroy all maze objects — call before loading a new level
	clear() {
		this.walls.clear(true, true);
		this.goalGroup.clear(true, true);
	}
}
