import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 480,
    height: 800,
    backgroundColor: "#f8f6f0",
    parent: "game-container",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [BootScene, PreloadScene, MenuScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

export default config;
