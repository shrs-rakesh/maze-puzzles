// Player.ts
import Phaser from "phaser";
export default class Player extends Phaser.GameObjects.Rectangle {
	public tileX!: number;
	public tileY!: number;
	public isMoving: boolean = false;

	constructor(scene: Phaser.Scene, x: number, y: number, size: number) {
		super(scene, 
                x, 
                y, 
                size * 0.8, 
                size * 0.8, 0xffb703
        ); 
		scene.add.existing(this);
	}
}