import { Scene } from "phaser";
import { ASSETS, COLOR_PALETTE, SCENE_KEYS } from "../config/app-config";

export class Preloader extends Scene {
  constructor() {
    super(SCENE_KEYS.preloader);
  }

  init() {
    const { centerX, centerY } = this.cameras.main;
    this.cameras.main.setBackgroundColor(COLOR_PALETTE.preloaderBackground);

    this.add
      .rectangle(centerX, centerY, 468, 32)
      .setStrokeStyle(1, COLOR_PALETTE.preloaderBar);

    const bar = this.add.rectangle(
      centerX - 230,
      centerY,
      4,
      28,
      COLOR_PALETTE.preloaderBar,
    );

    this.load.on("progress", (progress: number) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets");

    this.load.image(
      ASSETS.images.mainMenuBackground.key,
      ASSETS.images.mainMenuBackground.path,
    );
    this.load.image(
      ASSETS.images.uiButtonBackground.key,
      ASSETS.images.uiButtonBackground.path,
    );
    this.load.image(ASSETS.images.flyingCar.key, ASSETS.images.flyingCar.path);

    this.load.spritesheet(
      ASSETS.spritesheets.fireAnimation.key,
      ASSETS.spritesheets.fireAnimation.path,
      {
        frameWidth: ASSETS.spritesheets.fireAnimation.frameWidth,
        frameHeight: ASSETS.spritesheets.fireAnimation.frameHeight,
      },
    );
    this.load.spritesheet(
      ASSETS.spritesheets.fireAnimationUp.key,
      ASSETS.spritesheets.fireAnimationUp.path,
      {
        frameWidth: ASSETS.spritesheets.fireAnimationUp.frameWidth,
        frameHeight: ASSETS.spritesheets.fireAnimationUp.frameHeight,
      },
    );
    this.load.spritesheet(
      ASSETS.spritesheets.smokeAnimation.key,
      ASSETS.spritesheets.smokeAnimation.path,
      {
        frameWidth: ASSETS.spritesheets.smokeAnimation.frameWidth,
        frameHeight: ASSETS.spritesheets.smokeAnimation.frameHeight,
      },
    );
    this.load.spritesheet(
      ASSETS.spritesheets.gameOverOwlAnimation.key,
      ASSETS.spritesheets.gameOverOwlAnimation.path,
      {
        frameWidth: ASSETS.spritesheets.gameOverOwlAnimation.frameWidth,
        frameHeight: ASSETS.spritesheets.gameOverOwlAnimation.frameHeight,
      },
    );

    this.load.audio(ASSETS.audio.mainMenuTheme.key, ASSETS.audio.mainMenuTheme.path);
  }

  create() {
    this.scene.start(SCENE_KEYS.mainMenu);
  }
}
