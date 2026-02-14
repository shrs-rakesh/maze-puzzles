export interface Level {
    maze: number[][];
    startX: number;
    startY: number;
}

export class LevelManager {
    private levels: Level[];
    private currentIndex: number = 0;

    constructor(levels: Level[]) {
        this.levels = levels;
    }

    public getCurrentLevel(): Level {
        return this.levels[this.currentIndex];
    }

    public nextLevel(): Level | null {
        if (this.currentIndex + 1 < this.levels.length) {
            this.currentIndex++;
            return this.levels[this.currentIndex];
        }
        return null; // No more levels
    }

    public resetLevel(): Level {
        return this.levels[this.currentIndex];
    }

    public getLevelCount(): number {
        return this.levels.length;
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }
}