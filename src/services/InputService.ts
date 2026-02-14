import Phaser from "phaser";

export type MoveCallback = (dx: number, dy: number) => void;

export class InputService {
	private scene: Phaser.Scene;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.cursors = this.scene.input.keyboard!.createCursorKeys();
	}

	/**
	 * Call this in update() to handle keyboard input
	 */
	update(moveCallback: MoveCallback) {
		if (!this.cursors) return;

		if (Phaser.Input.Keyboard.JustDown(this.cursors.left))  moveCallback(-1, 0);
		if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) moveCallback(1, 0);
		if (Phaser.Input.Keyboard.JustDown(this.cursors.up))    moveCallback(0, -1);
		if (Phaser.Input.Keyboard.JustDown(this.cursors.down))  moveCallback(0, 1);
	}
}