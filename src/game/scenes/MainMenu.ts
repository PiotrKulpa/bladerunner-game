import { Scene, GameObjects } from "phaser";
import { UIButton } from "../ui-components/Button";
import { UIHeader } from "../ui-components/Header";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: UIHeader;
  startButton: UIButton;
  fireSprite: GameObjects.Sprite;
  fireUpSprite: GameObjects.Sprite;
  fireUpSpriteClone: GameObjects.Sprite;
  fireUpSpriteClone2: GameObjects.Sprite;
  smokeSprite: GameObjects.Sprite;
  smokeSpriteClone: GameObjects.Sprite;
  backgroundBaseScaleX: number;
  backgroundBaseScaleY: number;
  fireBaseOffsetX: number;
  fireBaseOffsetY: number;
  fireUpBaseOffsetX: number;
  fireUpBaseOffsetY: number;
  fireUpCloneBaseOffsetX: number;
  fireUpCloneBaseOffsetY: number;
  fireUpClone2BaseOffsetX: number;
  fireUpClone2BaseOffsetY: number;
  smokeBaseOffsetX: number;
  smokeBaseOffsetY: number;
  smokeCloneBaseOffsetX: number;
  smokeCloneBaseOffsetY: number;
  menuMusic?: Phaser.Sound.BaseSound;

  constructor() {
    super("MainMenu");
  }

  create() {
    const { centerX, centerY } = this.cameras.main;
    const bgZoomScale = 1.35;

    // Local override for menu background to reduce scaling artifacts.
    this.cameras.main.roundPixels = false;
    this.textures.get("main-menu-bg").setFilter(0);

    this.background = this.add.image(centerX, centerY, "main-menu-bg");
    this.background.setDisplaySize(this.scale.width, this.scale.height);
    this.backgroundBaseScaleX = this.background.scaleX;
    this.backgroundBaseScaleY = this.background.scaleY;

    this.tweens.add({
      targets: this.background,
      scaleX: this.backgroundBaseScaleX * bgZoomScale,
      scaleY: this.backgroundBaseScaleY * bgZoomScale,
      duration: 45000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    const flyingCar = this.add.image(0, 0, "flying-car");
    flyingCar.setDepth(1);

    const startCarX = -flyingCar.width * 0.5;
    const startCarY = centerY - 100;
    const endCarX = this.scale.width + flyingCar.width * 0.5;
    const endCarY = centerY - 30;
    const startCarScale = 0.6;
    const midCarScale = 0.3;
    const endCarScale = 0.1;

    const playFlyingCarFlyby = () => {
      flyingCar.setPosition(startCarX, startCarY);
      flyingCar.setScale(startCarScale);
      flyingCar.setAlpha(1);

      this.tweens.add({
        targets: flyingCar,
        x: endCarX - 140,
        y: endCarY,
        scaleX: midCarScale,
        scaleY: midCarScale,
        duration: 25000,
        ease: "Sine.easeInOut",
        onComplete: () => {
          this.tweens.add({
            targets: flyingCar,
            x: endCarX,
            y: endCarY - 30,
            alpha: 0,
            scaleX: endCarScale,
            scaleY: endCarScale,
            duration: 1200,
            ease: "Linear",
          });
        },
      });
    };

    playFlyingCarFlyby();

    if (!this.anims.exists("fire-burn-sprite")) {
      this.anims.create({
        key: "fire-burn-sprite",
        frames: this.anims.generateFrameNumbers("fire-animation", {
          start: 0,
          end: 5,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.anims.exists("fire-burst-up-sprite")) {
      this.anims.create({
        key: "fire-burst-up-sprite",
        frames: this.anims.generateFrameNumbers("fire-animation-up", {
          start: 0,
          end: 7,
        }),
        frameRate: 14,
        repeat: 0,
        showOnStart: true,
        hideOnComplete: true,
      });
    }

    if (!this.anims.exists("smoke-loop-sprite")) {
      this.anims.create({
        key: "smoke-loop-sprite",
        frames: this.anims.generateFrameNumbers("smoke-animation", {
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    this.fireSprite = this.add.sprite(96, 200, "fire-animation");
    this.fireSprite.setDepth(2);
    this.fireSprite.setScale(0.4);
    this.fireSprite.play("fire-burn-sprite");
    this.fireBaseOffsetX = this.fireSprite.x - centerX;
    this.fireBaseOffsetY = this.fireSprite.y - centerY;

    this.fireUpSprite = this.add.sprite(1018, 490, "fire-animation-up");
    this.fireUpSprite.setDepth(2);
    this.fireUpSprite.setScale(0.4);
    this.fireUpSprite.setVisible(false);
    this.fireUpSprite.anims.timeScale = 0.6;
    this.fireUpBaseOffsetX = this.fireUpSprite.x - centerX;
    this.fireUpBaseOffsetY = this.fireUpSprite.y - centerY;

    this.fireUpSpriteClone = this.add.sprite(256, 416, "fire-animation-up");
    this.fireUpSpriteClone.setDepth(2);
    this.fireUpSpriteClone.setScale(0.4);
    this.fireUpSpriteClone.setVisible(false);
    this.fireUpSpriteClone.anims.timeScale = 0.8;
    this.fireUpCloneBaseOffsetX = this.fireUpSpriteClone.x - centerX;
    this.fireUpCloneBaseOffsetY = this.fireUpSpriteClone.y - centerY;
    const fireUpCloneDelayMs = 1200;

    this.fireUpSpriteClone2 = this.add.sprite(456, 616, "fire-animation-up");
    this.fireUpSpriteClone2.setDepth(2);
    this.fireUpSpriteClone2.setScale(0.7);
    this.fireUpSpriteClone2.setVisible(false);
    this.fireUpSpriteClone2.anims.timeScale = 0.8;
    this.fireUpClone2BaseOffsetX = this.fireUpSpriteClone2.x - centerX;
    this.fireUpClone2BaseOffsetY = this.fireUpSpriteClone2.y - centerY;
    const fireUpClone2DelayMs = 700;

    this.smokeSprite = this.add.sprite(918, 430, "smoke-animation");
    this.smokeSprite.setDepth(2);
    this.smokeSprite.setScale(0.4);
    this.smokeSprite.setAlpha(0.55);
    this.smokeSprite.play("smoke-loop-sprite");
    this.smokeBaseOffsetX = this.smokeSprite.x - centerX;
    this.smokeBaseOffsetY = this.smokeSprite.y - centerY;

    this.smokeSpriteClone = this.add.sprite(296, 500, "smoke-animation");
    this.smokeSpriteClone.setDepth(2);
    this.smokeSpriteClone.setScale(1);
    this.smokeSpriteClone.setAlpha(0.55);
    this.smokeSpriteClone.play("smoke-loop-sprite");
    this.smokeCloneBaseOffsetX = this.smokeSpriteClone.x - centerX;
    this.smokeCloneBaseOffsetY = this.smokeSpriteClone.y - centerY;

    this.time.addEvent({
      delay: 6000,
      loop: true,
      callback: () => {
        this.fireUpSprite.play("fire-burst-up-sprite", true);
        this.fireUpSprite.anims.timeScale = 0.6;
        this.time.delayedCall(fireUpCloneDelayMs, () => {
          this.fireUpSpriteClone.play("fire-burst-up-sprite", true);
          this.fireUpSpriteClone.anims.timeScale = 0.9;
        });
        this.time.delayedCall(fireUpClone2DelayMs, () => {
          this.fireUpSpriteClone2.play("fire-burst-up-sprite", true);
          this.fireUpSpriteClone2.anims.timeScale = 0.7;
        });
      },
    });

    this.logo = new UIHeader(this, centerX, centerY, {
      title: "blade runner",
      width: this.scale.width * 0.7,
      align: "center",
      backgroundAlpha: 0,
      paddingX: 0,
      paddingY: 0,
      titleStyle: {
        fontFamily: "BladeRunner",
        fontSize: "30px",
        color: "#ed3d29",
      },
    });
    this.logo.getTitleText().setScale(3);
    this.logo.setAlpha(0);
    this.logo.setDepth(3);

    this.startButton = new UIButton(this, centerX, centerY + 100, {
      label: "START",
      onClick: () => {
        this.startButton.setDisabled(true);
        this.menuMusic?.stop();
        this.scene.start("Game");
      },
    });
    this.startButton.setScale(0.5);
    this.startButton.setDepth(3);
    this.startButton.setAlpha(0);

    this.input.enabled = false;

    const fadeOverlay = this.add
      .rectangle(
        centerX,
        centerY,
        this.scale.width,
        this.scale.height,
        0x000000,
      )
      .setDepth(1000);

    this.tweens.add({
      targets: fadeOverlay,
      alpha: 0,
      duration: 2000,
      ease: "Linear",
      onComplete: () => {
        fadeOverlay.destroy();
        this.input.enabled = true;
      },
    });

    this.tweens.add({
      targets: this.logo,
      alpha: 1,
      delay: 5000,
      duration: 1200,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: this.startButton,
      alpha: 1,
      delay: 5400,
      duration: 800,
      ease: "Sine.easeInOut",
    });

    this.menuMusic = this.sound.add("main-menu-theme", {
      loop: true,
      volume: 0.5,
    });
    this.menuMusic.play();
  }

  update() {
    if (
      !this.fireSprite ||
      !this.fireUpSprite ||
      !this.fireUpSpriteClone ||
      !this.fireUpSpriteClone2 ||
      !this.smokeSprite ||
      !this.smokeSpriteClone ||
      !this.background
    ) {
      return;
    }

    const { centerX, centerY } = this.cameras.main;
    const bgScaleRatioX = this.background.scaleX / this.backgroundBaseScaleX;
    const bgScaleRatioY = this.background.scaleY / this.backgroundBaseScaleY;

    this.fireSprite.x = centerX + this.fireBaseOffsetX * bgScaleRatioX;
    this.fireSprite.y = centerY + this.fireBaseOffsetY * bgScaleRatioY;

    this.fireUpSprite.x = centerX + this.fireUpBaseOffsetX * bgScaleRatioX;
    this.fireUpSprite.y = centerY + this.fireUpBaseOffsetY * bgScaleRatioY;

    this.fireUpSpriteClone.x =
      centerX + this.fireUpCloneBaseOffsetX * bgScaleRatioX;
    this.fireUpSpriteClone.y =
      centerY + this.fireUpCloneBaseOffsetY * bgScaleRatioY;

    this.fireUpSpriteClone2.x =
      centerX + this.fireUpClone2BaseOffsetX * bgScaleRatioX;
    this.fireUpSpriteClone2.y =
      centerY + this.fireUpClone2BaseOffsetY * bgScaleRatioY;

    this.smokeSprite.x = centerX + this.smokeBaseOffsetX * bgScaleRatioX;
    this.smokeSprite.y = centerY + this.smokeBaseOffsetY * bgScaleRatioY;

    this.smokeSpriteClone.x =
      centerX + this.smokeCloneBaseOffsetX * bgScaleRatioX;
    this.smokeSpriteClone.y =
      centerY + this.smokeCloneBaseOffsetY * bgScaleRatioY;
  }
}
