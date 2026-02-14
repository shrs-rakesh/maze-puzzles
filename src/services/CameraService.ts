import Phaser from "phaser";
import { PlayerService } from "./PlayerService";

export class CameraService {
    private scene: Phaser.Scene;
    private playerService: PlayerService;
    private tileSize: number;

    constructor(scene: Phaser.Scene, playerService: PlayerService, tileSize: number) {
        this.scene = scene;
        this.playerService = playerService;
        this.tileSize = tileSize;
    }

    /**
     * Setup the camera to follow the player within the maze bounds
     */
    setupCamera(mazeWidthInTiles: number, mazeHeightInTiles: number) {
        const mazeWidth = mazeWidthInTiles * this.tileSize;
        const mazeHeight = mazeHeightInTiles * this.tileSize;

        // Set world bounds
        this.scene.physics.world.setBounds(0, 0, mazeWidth, mazeHeight);
        this.scene.cameras.main.setBounds(0, 0, mazeWidth, mazeHeight);

        // Make camera follow the player with smooth lerp
        this.scene.cameras.main.startFollow(this.playerService.player, true, 0.1, 0.1);

        // Optional: set zoom if needed
        this.scene.cameras.main.setZoom(1);

        // Optional: add deadzone for arcade-style camera
        // this.scene.cameras.main.setDeadzone(150, 150);
    }
}