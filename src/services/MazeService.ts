import Phaser from "phaser";
import { LevelService } from "./LevelService";

export class MazeService {
    private scene: Phaser.Scene;
    public walls!: Phaser.Physics.Arcade.StaticGroup;
    private goals: Phaser.GameObjects.Rectangle[] = []; // track goal tiles

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.walls = this.scene.physics.add.staticGroup();
    }

    createMaze(levelService: LevelService, tileSize: number, offsetX: number, offsetY: number) {
        // Clear walls
        this.walls.clear(true, true);

        // Clear previous goal tiles
        this.goals.forEach(goal => goal.destroy());
        this.goals = [];

        const maze = levelService.currentMaze;
        const rows = maze.length;
        const cols = maze[0].length;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = offsetX + col * tileSize;
                const y = offsetY + row * tileSize;

                if (maze[row][col] === 1) {
                    const wall = this.scene.add.rectangle(
                        x,
                        y,
                        tileSize,
                        tileSize,
                        0x8ecae6
                    ).setOrigin(0);

                    this.scene.physics.add.existing(wall, true);
                    this.walls.add(wall);

                } else if (maze[row][col] === 2) {
                    const goal = this.scene.add.rectangle(
                        x,
                        y,
                        tileSize,
                        tileSize,
                        0x00ff00
                    ).setOrigin(0);
                    this.goals.push(goal);
                }
            }
        }
    }
}