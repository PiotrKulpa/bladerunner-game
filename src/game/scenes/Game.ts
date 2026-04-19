import { Scene } from "phaser";
import {
  COLOR_PALETTE,
  CONTENT_TEXT,
  FONT_FAMILIES,
  SCENE_KEYS,
} from "../config/app-config";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super(SCENE_KEYS.game);
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(COLOR_PALETTE.gameBackground);
    const { centerX, centerY } = this.camera;

    this.background = this.add.image(centerX, centerY, "background");
    this.background.setAlpha(0.5);

    this.msg_text = this.add.text(centerX, centerY, CONTENT_TEXT.game.message, {
      fontFamily: FONT_FAMILIES.fallback,
      fontSize: 38,
      color: COLOR_PALETTE.whiteHex,
      stroke: COLOR_PALETTE.blackHex,
      strokeThickness: 8,
      align: "center",
    });
    this.msg_text.setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start(SCENE_KEYS.gameOver);
    });
  }
}
