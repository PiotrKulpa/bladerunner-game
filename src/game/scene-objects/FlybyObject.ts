import { Scene, GameObjects } from "phaser";

export interface FlybyTransform {
  x: number;
  y: number;
  scale: number;
  alpha?: number;
}

export interface FlybySegment {
  x: number;
  y: number;
  scale: number;
  durationMs: number;
  ease: string;
  alpha?: number;
}

export interface FlybyObjectConfig {
  textureKey: string;
  depth: number;
  start: FlybyTransform;
  segments: FlybySegment[];
}

export class FlybyObject {
  readonly image: GameObjects.Image;

  constructor(scene: Scene, config: FlybyObjectConfig) {
    this.image = scene.add.image(config.start.x, config.start.y, config.textureKey);
    this.image.setDepth(config.depth);
    this.image.setScale(config.start.scale);

    if (config.start.alpha !== undefined) {
      this.image.setAlpha(config.start.alpha);
    }

    this.playSegments(scene, config.segments, 0);
  }

  private playSegments(scene: Scene, segments: FlybySegment[], index: number) {
    const segment = segments[index];

    if (!segment) {
      return;
    }

    scene.tweens.add({
      targets: this.image,
      x: segment.x,
      y: segment.y,
      scaleX: segment.scale,
      scaleY: segment.scale,
      ...(segment.alpha !== undefined ? { alpha: segment.alpha } : {}),
      duration: segment.durationMs,
      ease: segment.ease,
      onComplete: () => {
        this.playSegments(scene, segments, index + 1);
      },
    });
  }
}
