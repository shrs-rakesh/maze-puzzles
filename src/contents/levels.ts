import type { Level } from "../LevelManager";

/**
 * Automatically find the first open tile (0) in the maze
 */
function findStart(maze: number[][]): { startX: number; startY: number } {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 0) {
                return { startX: x, startY: y };
            }
        }
    }
    // fallback if no open space found
    return { startX: 1, startY: 1 };
}

export const LEVELS: Level[] = [
    (() => {
        const maze = [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 2, 1],
            [1, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1],
        ];
        const start = findStart(maze);
        return { maze, ...start };
    })(),

    (() => {
        const maze = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 2, 0, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
        ];
        const start = findStart(maze);
        return { maze, ...start };
    })(),
];