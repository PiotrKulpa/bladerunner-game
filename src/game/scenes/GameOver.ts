import { Scene } from "phaser";
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
import { AnchoredAnimatedSprite } from "../scene-objects/AnchoredAnimatedSprite";
import { MenuZoomBackground } from "../scene-objects/MenuZoomBackground";
import { RainEffect } from "../scene-objects/RainEffect";
import type { SpriteAnimationConfig } from "../scene-objects/SpriteAnimationConfig";
import { UIButton } from "../ui-components/Button";
import { UIHeader } from "../ui-components/Header";

const GAME_OVER_ANIMATION_KEYS = {
  smokeLoop: "smoke-loop-sprite",
} as const;

export class GameOver extends Scene {
  menuBackground: MenuZoomBackground;
  logo: UIHeader;
  startButton: UIButton;
  anchoredEffects: AnchoredAnimatedSprite[] = [];
  menuMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super(SCENE_KEYS.gameOver);
  }

  create() {
    const { centerX, centerY } = this.cameras.main;

    this.menuBackground = new MenuZoomBackground(this, {
      textureKey: ASSETS.images.mainMenuBackground.key,
      zoomScale: MAIN_MENU_LAYOUT.backgroundZoomScale,
      zoomDurationMs: MAIN_MENU_TIMINGS.backgroundZoomDurationMs,
    });

    this.createRainEffect();
    this.ensureAnimations();
    this.createAmbientEffects(centerX, centerY);
    this.createBottomCenterSmoke(centerX);
    this.createOwl();

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
          this.scene.start(SCENE_KEYS.neonCity);
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
    if (!this.menuBackground) {
      return;
    }

    const { centerX, centerY } = this.cameras.main;
    const bgScaleRatios = this.menuBackground.getScaleRatios();

    for (const effect of this.anchoredEffects) {
      effect.syncWithBackground(
        centerX,
        centerY,
        bgScaleRatios.x,
        bgScaleRatios.y,
      );
    }
  }

  private ensureAnimations() {
    const animationDefinitions: SpriteAnimationConfig[] = [
      {
        key: GAME_OVER_ANIMATION_KEYS.smokeLoop,
        textureKey: ASSETS.spritesheets.smokeAnimation.key,
        frameStart: 0,
        frameEnd: 7,
        frameRate: 10,
        repeat: -1,
      },
      {
        key: GAME_OVER_OWL.animationKey,
        textureKey: ASSETS.spritesheets.gameOverOwlAnimation.key,
        frameStart: GAME_OVER_OWL.frameStart,
        frameEnd: GAME_OVER_OWL.frameEnd,
        frameRate: GAME_OVER_OWL.frameRate,
        repeat: GAME_OVER_OWL.repeat,
      },
    ];

    for (const config of animationDefinitions) {
      this.ensureAnimation(config);
    }
  }

  private ensureAnimation(config: SpriteAnimationConfig) {
    if (this.anims.exists(config.key)) {
      return;
    }

    this.anims.create({
      key: config.key,
      frames: this.anims.generateFrameNumbers(config.textureKey, {
        start: config.frameStart,
        end: config.frameEnd,
      }),
      frameRate: config.frameRate,
      repeat: config.repeat,
      showOnStart: config.showOnStart,
      hideOnComplete: config.hideOnComplete,
    });
  }

  private createRainEffect() {
    new RainEffect(this, GAME_OVER_RAIN);
  }

  private createAmbientEffects(centerX: number, centerY: number) {
    const smokeSprite = new AnchoredAnimatedSprite(this, centerX, centerY, {
      x: 918,
      y: 430,
      textureKey: ASSETS.spritesheets.smokeAnimation.key,
      depth: 2,
      scale: 0.4,
      alpha: 0.55,
      animationKey: GAME_OVER_ANIMATION_KEYS.smokeLoop,
    });

    const smokeSpriteClone = new AnchoredAnimatedSprite(
      this,
      centerX,
      centerY,
      {
        x: 296,
        y: 500,
        textureKey: ASSETS.spritesheets.smokeAnimation.key,
        depth: 2,
        scale: 1,
        alpha: 0.55,
        animationKey: GAME_OVER_ANIMATION_KEYS.smokeLoop,
      },
    );

    this.anchoredEffects = [smokeSprite, smokeSpriteClone];
  }

  private createBottomCenterSmoke(centerX: number) {
    const smokeSpriteBottomCenter = this.add.sprite(
      centerX,
      this.scale.height,
      ASSETS.spritesheets.smokeAnimation.key,
    );
    smokeSpriteBottomCenter.setDepth(2);
    smokeSpriteBottomCenter.setScale(1.2);
    smokeSpriteBottomCenter.setOrigin(0.5, 1);
    smokeSpriteBottomCenter.setAlpha(0.55);
    smokeSpriteBottomCenter.play(GAME_OVER_ANIMATION_KEYS.smokeLoop);
  }

  private createOwl() {
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
  }
}
