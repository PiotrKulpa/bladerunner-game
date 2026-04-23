import { Scene } from "phaser";
import {
  ASSETS,
  COLOR_PALETTE,
  CONTENT_TEXT,
  MAIN_MENU_AUDIO,
  MAIN_MENU_LAYOUT,
  MAIN_MENU_TIMINGS,
  SCENE_KEYS,
  UI_TOKENS,
} from "../config/app-config";
import { AnchoredAnimatedSprite } from "../scene-objects/AnchoredAnimatedSprite";
import { LoopedBurstAnimation } from "../scene-objects/LoopedBurstAnimation";
import { MainMenuFlyingCar } from "../scene-objects/MainMenuFlyingCar";
import { MenuZoomBackground } from "../scene-objects/MenuZoomBackground";
import type { SpriteAnimationConfig } from "../scene-objects/SpriteAnimationConfig";
import { UIButton } from "../ui-components/Button";
import { UIHeader } from "../ui-components/Header";

const MAIN_MENU_ANIMATION_KEYS = {
  fireBurn: "fire-burn-sprite",
  fireBurstUp: "fire-burst-up-sprite",
  smokeLoop: "smoke-loop-sprite",
} as const;

export class MainMenu extends Scene {
  menuBackground: MenuZoomBackground;
  logo: UIHeader;
  startButton: UIButton;
  anchoredEffects: AnchoredAnimatedSprite[] = [];
  menuMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super(SCENE_KEYS.mainMenu);
  }

  create() {
    const { centerX, centerY } = this.cameras.main;

    this.menuBackground = new MenuZoomBackground(this, {
      textureKey: ASSETS.images.mainMenuBackground.key,
      zoomScale: MAIN_MENU_LAYOUT.backgroundZoomScale,
      zoomDurationMs: MAIN_MENU_TIMINGS.backgroundZoomDurationMs,
    });

    new MainMenuFlyingCar(this, {
      textureKey: ASSETS.images.flyingCar.key,
      depth: 1,
      startOffsetY: -100,
      endOffsetY: -30,
      primaryEndOffsetX: 140,
      exitOffsetY: -30,
      startScale: 0.6,
      midScale: 0.3,
      endScale: 0.1,
      primaryDurationMs: MAIN_MENU_TIMINGS.flyingCarPrimaryDurationMs,
      exitDurationMs: MAIN_MENU_TIMINGS.flyingCarExitDurationMs,
    });

    this.ensureAnimations();
    this.createAmbientEffects(centerX, centerY);

    this.logo = new UIHeader(
      this,
      centerX,
      centerY + MAIN_MENU_LAYOUT.headerOffsetY,
      {
        title: CONTENT_TEXT.mainMenu.headerTitle,
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
    this.logo.setAlpha(0);
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
      targets: this.logo,
      alpha: 1,
      delay: MAIN_MENU_TIMINGS.headerFadeDelayMs,
      duration: MAIN_MENU_TIMINGS.headerFadeDurationMs,
      ease: "Sine.easeInOut",
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
        key: MAIN_MENU_ANIMATION_KEYS.fireBurn,
        textureKey: ASSETS.spritesheets.fireAnimation.key,
        frameStart: 0,
        frameEnd: 5,
        frameRate: 10,
        repeat: -1,
      },
      {
        key: MAIN_MENU_ANIMATION_KEYS.fireBurstUp,
        textureKey: ASSETS.spritesheets.fireAnimationUp.key,
        frameStart: 0,
        frameEnd: 7,
        frameRate: 14,
        repeat: 0,
        showOnStart: true,
        hideOnComplete: true,
      },
      {
        key: MAIN_MENU_ANIMATION_KEYS.smokeLoop,
        textureKey: ASSETS.spritesheets.smokeAnimation.key,
        frameStart: 0,
        frameEnd: 7,
        frameRate: 10,
        repeat: -1,
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

  private createAmbientEffects(centerX: number, centerY: number) {
    const fireSprite = new AnchoredAnimatedSprite(this, centerX, centerY, {
      x: 96,
      y: 200,
      textureKey: ASSETS.spritesheets.fireAnimation.key,
      depth: 2,
      scale: 0.4,
      animationKey: MAIN_MENU_ANIMATION_KEYS.fireBurn,
    });

    const fireUpSprite = new AnchoredAnimatedSprite(this, centerX, centerY, {
      x: 1018,
      y: 490,
      textureKey: ASSETS.spritesheets.fireAnimationUp.key,
      depth: 2,
      scale: 0.4,
      visible: false,
      animationTimeScale: 0.6,
    });

    const fireUpSpriteClone = new AnchoredAnimatedSprite(
      this,
      centerX,
      centerY,
      {
        x: 256,
        y: 416,
        textureKey: ASSETS.spritesheets.fireAnimationUp.key,
        depth: 2,
        scale: 0.4,
        visible: false,
        animationTimeScale: 0.8,
      },
    );

    const fireUpSpriteClone2 = new AnchoredAnimatedSprite(
      this,
      centerX,
      centerY,
      {
        x: 456,
        y: 616,
        textureKey: ASSETS.spritesheets.fireAnimationUp.key,
        depth: 2,
        scale: 0.7,
        visible: false,
        animationTimeScale: 0.8,
      },
    );

    const smokeSprite = new AnchoredAnimatedSprite(this, centerX, centerY, {
      x: 918,
      y: 430,
      textureKey: ASSETS.spritesheets.smokeAnimation.key,
      depth: 2,
      scale: 0.4,
      alpha: 0.55,
      animationKey: MAIN_MENU_ANIMATION_KEYS.smokeLoop,
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
        animationKey: MAIN_MENU_ANIMATION_KEYS.smokeLoop,
      },
    );

    this.anchoredEffects = [
      fireSprite,
      fireUpSprite,
      fireUpSpriteClone,
      fireUpSpriteClone2,
      smokeSprite,
      smokeSpriteClone,
    ];

    const fireBurstLoop = new LoopedBurstAnimation(
      this,
      MAIN_MENU_ANIMATION_KEYS.fireBurstUp,
      MAIN_MENU_TIMINGS.fireBurstLoopDelayMs,
      [
        { actor: fireUpSprite, delayMs: 0, timeScale: 0.6 },
        {
          actor: fireUpSpriteClone,
          delayMs: MAIN_MENU_TIMINGS.fireBurstCloneDelayMs,
          timeScale: 0.9,
        },
        {
          actor: fireUpSpriteClone2,
          delayMs: MAIN_MENU_TIMINGS.fireBurstClone2DelayMs,
          timeScale: 0.7,
        },
      ],
    );
    fireBurstLoop.start();
  }
}
