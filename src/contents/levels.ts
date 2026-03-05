import { TILE } from "./constants";
import type { Level } from "../services/LevelService";

// Validates and constructs a level — warns if goal count is wrong
function makeLevel(maze: number[][], startX: number, startY: number): Level {
	const goalCount = maze.flat().filter((t) => t === TILE.GOAL).length;
	if (goalCount !== 1) {
		console.warn(`Maze has ${goalCount} goal tile(s), expected exactly 1`);
	}
	return { maze, startX, startY };
}

export const LEVELS: Level[] = [
	makeLevel(
		[
			[1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 1],
			[1, 0, 1, 1, 1, 0, 1],
			[1, 0, 1, 0, 0, 2, 1],
			[1, 0, 0, 0, 1, 0, 1],
			[1, 1, 1, 1, 1, 1, 1],
		],
		1, 1 // explicit start position
	),
	makeLevel(
		[
			[1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 1, 1, 1, 1, 0, 1],
			[1, 0, 1, 0, 0, 1, 0, 1],
			[1, 0, 1, 0, 2, 0, 0, 1],
			[1, 0, 0, 0, 1, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1],
		],
		1, 1
	),
];
