import Phaser from "phaser";
import { PLAYER_SIZE_RATIO } from "../contents/constants";

const PLAYER_COLOR = 0xffb703; 

export default class Player extends Phaser.GameObjects.Rectangle {
	public tileX: number;
	public tileY: number;
	public isMoving: boolean = false;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		size: number,
		tileX: number,
		tileY: number
	) {
		super(scene, x, y, size * PLAYER_SIZE_RATIO, size * PLAYER_SIZE_RATIO, PLAYER_COLOR);
		this.tileX = tileX;
		this.tileY = tileY;
		scene.add.existing(this);
	}
}
