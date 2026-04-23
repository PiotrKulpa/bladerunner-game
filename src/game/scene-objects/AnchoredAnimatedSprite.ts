import { Scene, GameObjects } from "phaser";

export interface AnchoredAnimatedSpriteConfig {
  x: number;
  y: number;
  textureKey: string;
  depth: number;
  scale: number;
  alpha?: number;
  visible?: boolean;
  animationKey?: string;
  animationTimeScale?: number;
}

export class AnchoredAnimatedSprite {
  readonly sprite: GameObjects.Sprite;
  private readonly baseOffsetX: number;
  private readonly baseOffsetY: number;

  constructor(
    scene: Scene,
    centerX: number,
    centerY: number,
    config: AnchoredAnimatedSpriteConfig,
  ) {
    this.sprite = scene.add.sprite(config.x, config.y, config.textureKey);
    this.baseOffsetX = config.x - centerX;
    this.baseOffsetY = config.y - centerY;

    this.sprite.setDepth(config.depth);
    this.sprite.setScale(config.scale);

    if (config.alpha !== undefined) {
      this.sprite.setAlpha(config.alpha);
    }

    if (config.visible !== undefined) {
      this.sprite.setVisible(config.visible);
    }

    if (config.animationKey) {
      this.sprite.play(config.animationKey);
    }

    if (config.animationTimeScale !== undefined) {
      this.sprite.anims.timeScale = config.animationTimeScale;
    }
  }

  play(animationKey: string, ignoreIfPlaying = true, timeScale?: number) {
    this.sprite.play(animationKey, ignoreIfPlaying);

    if (timeScale !== undefined) {
      this.sprite.anims.timeScale = timeScale;
    }
  }

  syncWithBackground(
    centerX: number,
    centerY: number,
    bgScaleRatioX: number,
    bgScaleRatioY: number,
  ) {
    this.sprite.x = centerX + this.baseOffsetX * bgScaleRatioX;
    this.sprite.y = centerY + this.baseOffsetY * bgScaleRatioY;
  }
}
