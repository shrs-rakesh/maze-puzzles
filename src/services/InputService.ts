import Phaser from "phaser";

export type MoveCallback = (dx: number, dy: number) => void;

export class InputService {
	private scene: Phaser.Scene;
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private wasd: Record<string, Phaser.Input.Keyboard.Key>;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.cursors = this.scene.input.keyboard!.createCursorKeys();
		this.wasd = this.scene.input.keyboard!.addKeys("W,A,S,D") as Record<
			string,
			Phaser.Input.Keyboard.Key
		>;
	}

	/**
	 * Call this in update() to handle keyboard input.
	 * Supports both arrow keys and WASD.
	 */
	update(moveCallback: MoveCallback) {
		const { JustDown } = Phaser.Input.Keyboard;

		if (JustDown(this.cursors.left)  || JustDown(this.wasd.A)) moveCallback(-1, 0);
		if (JustDown(this.cursors.right) || JustDown(this.wasd.D)) moveCallback(1, 0);
		if (JustDown(this.cursors.up)    || JustDown(this.wasd.W)) moveCallback(0, -1);
		if (JustDown(this.cursors.down)  || JustDown(this.wasd.S)) moveCallback(0, 1);
	}
}
