import Phaser from "phaser";
import Player from "../entities/Player";

const TILE_SIZE = 70;

const MAZE = [
	[1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 1, 1, 0, 1],
	[1, 0, 1, 0, 1, 0, 1],
	[1, 0, 1, 0, 0, 2, 1],
	[1, 0, 0, 0, 1, 0, 1],
	[1, 1, 1, 1, 1, 1, 1],
];

export default class GameScene extends Phaser.Scene {
	private player!: Player;
	private walls!: Phaser.Physics.Arcade.StaticGroup;
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private wasd!: any;

	constructor() {
		super("GameScene");
	}

	create(): void {
		this.walls = this.physics.add.staticGroup();

		this.cursors = this.input.keyboard!.createCursorKeys();

		this.wasd = this.input.keyboard!.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		// Create maze and goal tiles
		this.createMaze();

		// Create player
		this.player = new Player(this, 1, 1, TILE_SIZE);

		// Enable collision
		this.physics.add.collider(this.player, this.walls);

		this.createControls();
	}

	private createControls(): void {
		const baseX = 230;   // left side
		const baseY = 625;   // bottom area
		const spacing = 70;
		const directions = [
			{ dx: 0, dy: -1, x: baseX, y: baseY - spacing, label: "↑" },
			{ dx: 0, dy: 1, x: baseX, y: baseY + spacing, label: "↓" },
			{ dx: -1, dy: 0, x: baseX - spacing, y: baseY, label: "←" },
			{ dx: 1, dy: 0, x: baseX + spacing, y: baseY, label: "→" },
		];

		directions.forEach((dir) => {
			const button = this.add.circle(dir.x, dir.y, 35, 0xffee00, 0.6);
			button.setStrokeStyle(3, 0xffffff);
			button.setInteractive({
				useHandCursor: true
			});

			const text = this.add.text(dir.x, dir.y, dir.label, {
				fontSize: "30px",
				color: "#ffffff",
			}).setOrigin(0.5);

			button.on("pointerdown", () => {
				this.tryMove(dir.dx, dir.dy);
			});

			button.on("pointerup", () => { });
		});
	}

	update(): void {
		if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) this.tryMove(-1, 0);
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.right!))
			this.tryMove(1, 0);
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.up!))
			this.tryMove(0, -1);
		else if (Phaser.Input.Keyboard.JustDown(this.cursors.down!))
			this.tryMove(0, 1);
	}

	private tryMove(dx: number, dy: number) {
		if (this.player.isMoving) return;

		const newX = this.player.tileX + dx;
		const newY = this.player.tileY + dy;

		// Prevent moving into walls
		if (MAZE[newY][newX] === 1) return;

		this.player.tileX = newX;
		this.player.tileY = newY;
		this.player.isMoving = true;

		this.tweens.add({
			targets: this.player,
			x: this.player.tileX * TILE_SIZE + TILE_SIZE / 2,
			y: this.player.tileY * TILE_SIZE + TILE_SIZE / 2,
			duration: 120,
			onComplete: () => {
				this.player.isMoving = false;
			},
		});

		if (MAZE[newY][newX] === 2) {
			this.player.isMoving = false;
			this.time.delayedCall(100, () => {
				alert("You reached the goal! 🎉");
				// Or restart / load next level
			});
			return;
		}
	}

	private createMaze(): void {
		for (let row = 0; row < MAZE.length; row++) {
			for (let col = 0; col < MAZE[row].length; col++) {

				// Walls
				if (MAZE[row][col] === 1) {
					const wall = this.add.rectangle(
						col * TILE_SIZE,
						row * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE,
						0x8ecae6
					).setOrigin(0);

					this.physics.add.existing(wall, true);
					this.walls.add(wall);
				}

				// Goal tile
				if (MAZE[row][col] === 2) {
					this.add.rectangle(
						col * TILE_SIZE,
						row * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE,
						0x00ff00 // green
					).setOrigin(0);
				}
			}
		}
	}
}
