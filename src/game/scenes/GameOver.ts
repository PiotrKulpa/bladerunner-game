import { Scene } from "phaser";
import {
  COLOR_PALETTE,
  CONTENT_TEXT,
  FONT_FAMILIES,
  SCENE_KEYS,
} from "../config/app-config";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.gameOver);
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(COLOR_PALETTE.gameOverBackground);
    const { centerX, centerY } = this.camera;

    this.background = this.add.image(centerX, centerY, "background");
    this.background.setAlpha(0.5);

    this.gameover_text = this.add.text(centerX, centerY, CONTENT_TEXT.gameOver.title, {
      fontFamily: FONT_FAMILIES.fallback,
      fontSize: 64,
      color: COLOR_PALETTE.whiteHex,
      stroke: COLOR_PALETTE.blackHex,
      strokeThickness: 8,
      align: "center",
    });
    this.gameover_text.setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start(SCENE_KEYS.mainMenu);
    });
  }
}
