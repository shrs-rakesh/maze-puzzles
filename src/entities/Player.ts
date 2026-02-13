import Phaser from "phaser";

export default class Player extends Phaser.GameObjects.Rectangle {
    public tileX: number;
    public tileY: number;
    public isMoving: boolean = false;

    constructor(scene: Phaser.Scene, tileX: number, tileY: number, tileSize: number) {
        // Rectangle with width = tileSize and height = tileSize
        super(
            scene,
            tileX * tileSize + tileSize / 2,
            tileY * tileSize + tileSize / 2,
            tileSize,
            tileSize,
            0xffb703
        );

        this.tileX = tileX;
        this.tileY = tileY;

        scene.add.existing(this);
    }
}