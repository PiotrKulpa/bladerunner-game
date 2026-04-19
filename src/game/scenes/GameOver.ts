import { Scene, GameObjects } from "phaser";
import {
  ASSETS,
  COLOR_PALETTE,
  CONTENT_TEXT,
  GAME_OVER_OWL,
  GAME_OVER_RAIN,
  MAIN_MENU_AUDIO,
  MAIN_MENU_LAYOUT,
  MAIN_MENU_TIMINGS,
  SCENE_KEYS,
  UI_TOKENS,
} from "../config/app-config";
import { UIButton } from "../ui-components/Button";
import { UIHeader } from "../ui-components/Header";

export class GameOver extends Scene {
  background: GameObjects.Image;
  logo: UIHeader;
  startButton: UIButton;
  smokeSprite: GameObjects.Sprite;
  smokeSpriteClone: GameObjects.Sprite;
  backgroundBaseScaleX: number;
  backgroundBaseScaleY: number;
  smokeBaseOffsetX: number;
  smokeBaseOffsetY: number;
  smokeCloneBaseOffsetX: number;
  smokeCloneBaseOffsetY: number;
  menuMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super(SCENE_KEYS.gameOver);
  }

  create() {
    const { centerX, centerY } = this.cameras.main;
    const bgZoomScale = MAIN_MENU_LAYOUT.backgroundZoomScale;

    // Local override for menu background to reduce scaling artifacts.
    this.cameras.main.roundPixels = false;
    this.textures.get(ASSETS.images.mainMenuBackground.key).setFilter(0);

    this.background = this.add.image(
      centerX,
      centerY,
      ASSETS.images.mainMenuBackground.key,
    );
    this.background.setDisplaySize(this.scale.width, this.scale.height);
    this.backgroundBaseScaleX = this.background.scaleX;
    this.backgroundBaseScaleY = this.background.scaleY;

    this.tweens.add({
      targets: this.background,
      scaleX: this.backgroundBaseScaleX * bgZoomScale,
      scaleY: this.backgroundBaseScaleY * bgZoomScale,
      duration: MAIN_MENU_TIMINGS.backgroundZoomDurationMs,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    if (!this.textures.exists(GAME_OVER_RAIN.textureKey)) {
      const dropTexture = this.add.graphics();
      dropTexture.setVisible(false);
      dropTexture.fillStyle(GAME_OVER_RAIN.dropColor, GAME_OVER_RAIN.dropAlpha);
      dropTexture.fillRect(
        0,
        0,
        GAME_OVER_RAIN.dropWidth,
        GAME_OVER_RAIN.dropHeight,
      );
      dropTexture.generateTexture(
        GAME_OVER_RAIN.textureKey,
        GAME_OVER_RAIN.dropWidth,
        GAME_OVER_RAIN.dropHeight,
      );
      dropTexture.destroy();
    }

    const rain = this.add.particles(0, 0, GAME_OVER_RAIN.textureKey, {
      x: { min: 0, max: this.scale.width },
      y: GAME_OVER_RAIN.yStart,
      lifespan: GAME_OVER_RAIN.lifespanMs,
      speedY: { min: GAME_OVER_RAIN.speedYMin, max: GAME_OVER_RAIN.speedYMax },
      speedX: { min: GAME_OVER_RAIN.speedXMin, max: GAME_OVER_RAIN.speedXMax },
      quantity: GAME_OVER_RAIN.quantity,
      alpha: { start: GAME_OVER_RAIN.alphaStart, end: GAME_OVER_RAIN.alphaEnd },
    });
    rain.setDepth(GAME_OVER_RAIN.depth);

    if (!this.anims.exists("smoke-loop-sprite")) {
      this.anims.create({
        key: "smoke-loop-sprite",
        frames: this.anims.generateFrameNumbers(
          ASSETS.spritesheets.smokeAnimation.key,
          {
            start: 0,
            end: 7,
          },
        ),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists(GAME_OVER_OWL.animationKey)) {
      this.anims.create({
        key: GAME_OVER_OWL.animationKey,
        frames: this.anims.generateFrameNumbers(
          ASSETS.spritesheets.gameOverOwlAnimation.key,
          {
            start: GAME_OVER_OWL.frameStart,
            end: GAME_OVER_OWL.frameEnd,
          },
        ),
        frameRate: GAME_OVER_OWL.frameRate,
        repeat: GAME_OVER_OWL.repeat,
      });
    }

    this.smokeSprite = this.add.sprite(
      918,
      430,
      ASSETS.spritesheets.smokeAnimation.key,
    );
    this.smokeSprite.setDepth(2);
    this.smokeSprite.setScale(0.4);
    this.smokeSprite.setAlpha(0.55);
    this.smokeSprite.play("smoke-loop-sprite");
    this.smokeBaseOffsetX = this.smokeSprite.x - centerX;
    this.smokeBaseOffsetY = this.smokeSprite.y - centerY;

    this.smokeSpriteClone = this.add.sprite(
      296,
      500,
      ASSETS.spritesheets.smokeAnimation.key,
    );
    this.smokeSpriteClone.setDepth(2);
    this.smokeSpriteClone.setScale(1);
    this.smokeSpriteClone.setAlpha(0.55);
    this.smokeSpriteClone.play("smoke-loop-sprite");
    this.smokeCloneBaseOffsetX = this.smokeSpriteClone.x - centerX;
    this.smokeCloneBaseOffsetY = this.smokeSpriteClone.y - centerY;

    const smokeSpriteBottomCenter = this.add.sprite(
      centerX,
      this.scale.height,
      ASSETS.spritesheets.smokeAnimation.key,
    );
    smokeSpriteBottomCenter.setDepth(2);
    smokeSpriteBottomCenter.setScale(1.2);
    smokeSpriteBottomCenter.setOrigin(0.5, 1);
    smokeSpriteBottomCenter.setAlpha(0.55);
    smokeSpriteBottomCenter.play("smoke-loop-sprite");

    const owlSprite = this.add.sprite(
      GAME_OVER_OWL.marginLeft,
      this.scale.height - GAME_OVER_OWL.marginBottom,
      ASSETS.spritesheets.gameOverOwlAnimation.key,
    );
    owlSprite.setOrigin(0, 1);
    owlSprite.setDepth(GAME_OVER_OWL.depth);
    owlSprite.setScale(GAME_OVER_OWL.scale);
    owlSprite.setFrame(GAME_OVER_OWL.frameStart);

    this.time.addEvent({
      delay: GAME_OVER_OWL.triggerIntervalMs,
      loop: true,
      callback: () => {
        if (!owlSprite.anims.isPlaying) {
          owlSprite.play(GAME_OVER_OWL.animationKey, true);
        }
      },
    });

    this.logo = new UIHeader(
      this,
      centerX,
      centerY + MAIN_MENU_LAYOUT.headerOffsetY,
      {
        title: CONTENT_TEXT.gameOver.headerTitle,
        width: this.scale.width * MAIN_MENU_LAYOUT.headerWidthRatio,
        align: "center",
        backgroundAlpha: 0,
        paddingX: 0,
        paddingY: 0,
        titleStyle: {
          fontFamily: UI_TOKENS.header.titleStyle.fontFamily,
          fontSize: "30px",
          color: COLOR_PALETTE.headerPrimaryHex,
        },
      },
    );
    this.logo.getTitleText().setScale(MAIN_MENU_LAYOUT.headerScale);
    this.logo.setAlpha(1);
    this.logo.setDepth(3);

    this.startButton = new UIButton(
      this,
      centerX,
      centerY + MAIN_MENU_LAYOUT.startButtonOffsetY,
      {
        label: CONTENT_TEXT.mainMenu.startButtonLabel,
        onClick: () => {
          this.startButton.setDisabled(true);
          this.menuMusic?.stop();
          this.scene.start(SCENE_KEYS.game);
        },
      },
    );
    this.startButton.setScale(UI_TOKENS.button.defaultScale);
    this.startButton.setDepth(3);
    this.startButton.setAlpha(0);

    this.input.enabled = false;

    const fadeOverlay = this.add
      .rectangle(
        centerX,
        centerY,
        this.scale.width,
        this.scale.height,
        COLOR_PALETTE.preloaderBackground,
      )
      .setDepth(1000);

    this.tweens.add({
      targets: fadeOverlay,
      alpha: 0,
      duration: MAIN_MENU_TIMINGS.overlayFadeDurationMs,
      ease: "Linear",
      onComplete: () => {
        fadeOverlay.destroy();
        this.input.enabled = true;
      },
    });

    this.tweens.add({
      targets: this.startButton,
      alpha: 1,
      delay: MAIN_MENU_TIMINGS.buttonFadeDelayMs,
      duration: MAIN_MENU_TIMINGS.buttonFadeDurationMs,
      ease: "Sine.easeInOut",
    });

    this.menuMusic = this.sound.add(ASSETS.audio.mainMenuTheme.key, {
      loop: MAIN_MENU_AUDIO.themeLoop,
      volume: MAIN_MENU_AUDIO.themeVolume,
    });
    this.menuMusic.play();
  }

  update() {
    if (!this.smokeSprite || !this.smokeSpriteClone || !this.background) {
      return;
    }

    const { centerX, centerY } = this.cameras.main;
    const bgScaleRatioX = this.background.scaleX / this.backgroundBaseScaleX;
    const bgScaleRatioY = this.background.scaleY / this.backgroundBaseScaleY;

    this.smokeSprite.x = centerX + this.smokeBaseOffsetX * bgScaleRatioX;
    this.smokeSprite.y = centerY + this.smokeBaseOffsetY * bgScaleRatioY;

    this.smokeSpriteClone.x =
      centerX + this.smokeCloneBaseOffsetX * bgScaleRatioX;
    this.smokeSpriteClone.y =
      centerY + this.smokeCloneBaseOffsetY * bgScaleRatioY;
  }
}
