// Stored best record for a single level
export interface LevelRecord {
	bestSteps: number;
	bestTime: number; // in seconds
}

// Stats for the current active play session
export interface SessionStats {
	steps: number;
	elapsedMs: number;
	isRunning: boolean;
}

export class StatsService {
	private steps: number = 0;
	private startTime: number = 0;
	private elapsedMs: number = 0;
	private isRunning: boolean = false;

	private static storageKey(levelIndex: number): string {
		return `maze_level_${levelIndex}`;
	}

	// ── Session controls ──────────────────────────────────────────

	startLevel(): void {
		this.steps = 0;
		this.elapsedMs = 0;
		this.startTime = performance.now();
		this.isRunning = true;
	}

	stopLevel(): void {
		if (this.isRunning) {
			this.elapsedMs += performance.now() - this.startTime;
			this.isRunning = false;
		}
	}

	incrementSteps(): void {
		if (this.isRunning) this.steps++;
	}

	// ── Current session getters ───────────────────────────────────

	getSteps(): number {
		return this.steps;
	}

	getElapsedMs(): number {
		if (this.isRunning) {
			return this.elapsedMs + (performance.now() - this.startTime);
		}
		return this.elapsedMs;
	}

	getElapsedSeconds(): number {
		return Math.floor(this.getElapsedMs() / 1000);
	}

	// Format as MM:SS
	getFormattedTime(): string {
		const totalSeconds = this.getElapsedSeconds();
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}

	// ── Best score (localStorage) ─────────────────────────────────

	getBestRecord(levelIndex: number): LevelRecord | null {
		try {
			const raw = localStorage.getItem(StatsService.storageKey(levelIndex));
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}

	// Save current session as best if it beats existing record.
	// Returns true if a new record was set.
	saveIfBest(levelIndex: number): boolean {
		const current: LevelRecord = {
			bestSteps: this.steps,
			bestTime: this.getElapsedSeconds(),
		};

		const existing = this.getBestRecord(levelIndex);
		const isNewRecord =
			!existing ||
			current.bestSteps < existing.bestSteps ||
			(current.bestSteps === existing.bestSteps &&
				current.bestTime < existing.bestTime);

		if (isNewRecord) {
			try {
				localStorage.setItem(
					StatsService.storageKey(levelIndex),
					JSON.stringify(current)
				);
			} catch {
				console.warn("Could not save best record to localStorage");
			}
		}

		return isNewRecord;
	}

	// ── Summary for level complete screen ────────────────────────

	getSummary(levelIndex: number): {
		steps: number;
		time: string;
		isNewRecord: boolean;
		best: LevelRecord | null;
	} {
		const isNewRecord = this.saveIfBest(levelIndex);
		return {
			steps: this.steps,
			time: this.getFormattedTime(),
			isNewRecord,
			best: this.getBestRecord(levelIndex),
		};
	}
}