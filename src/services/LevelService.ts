export type Level = {
    maze: number[][];
    startX: number;
    startY: number;
};

export class LevelService {
    public currentMaze: number[][];
    public startX: number;
    public startY: number;

    constructor(level: Level) {
        this.currentMaze = level.maze;
        this.startX = level.startX;
        this.startY = level.startY;
    }

    isWall(x: number, y: number) {
        return this.currentMaze[y][x] === 1;
    }

    isGoal(x: number, y: number) {
        return this.currentMaze[y][x] === 2;
    }

    getRows() {
        return this.currentMaze.length;
    }

    getCols() {
        return this.currentMaze[0].length;
    }
}