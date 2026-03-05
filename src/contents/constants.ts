// Tile size 
export const TILE_SIZE = 70;

// Tile type constants — single source of truth for maze cell values
export const TILE = {
	EMPTY: 0,
	WALL: 1,
	GOAL: 2,
} as const;

// Player movement tween duration (ms)
export const MOVE_DURATION_MS = 120;

// Player visual size ratio within a tile
export const PLAYER_SIZE_RATIO = 0.8;

// Reserve bottom for UI so maze centers only within the gameplay area
export const UI_HEIGHT = 180;

// Fixed tile size regardless - world scrolls instead of shrinking
export const FIXED_TILE_SIZE = 48;

// Smooth camera follow lerp factor (0-1)
export const CAMERA_LERP = 0.12;