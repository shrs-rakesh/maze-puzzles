import { TILE } from "../contents/constants";

export type Level = {
	maze: number[][];
	startX: number;
	startY: number;
};

export class LevelService {
	public readonly currentMaze: number[][];
	public readonly startX: number;
	public readonly startY: number;

	constructor(level: Level) {
		this.currentMaze = level.maze;
		this.startX = level.startX;
		this.startY = level.startY;
	}

	// General tile getter with bounds safety
	getTile(x: number, y: number): number {
		if (y < 0 || y >= this.getRows() || x < 0 || x >= this.getCols()) {
			return TILE.WALL; // treat out-of-bounds as wall
		}
		return this.currentMaze[y][x];
	}

	isWall(x: number, y: number): boolean {
		return this.getTile(x, y) === TILE.WALL;
	}

	isGoal(x: number, y: number): boolean {
		return this.getTile(x, y) === TILE.GOAL;
	}

	getRows(): number {
		return this.currentMaze.length;
	}

	getCols(): number {
		return this.currentMaze[0]?.length ?? 0;
	}
}
