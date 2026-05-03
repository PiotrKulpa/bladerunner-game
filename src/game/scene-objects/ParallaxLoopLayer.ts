import { Scene, GameObjects } from "phaser";

export interface ParallaxLoopLayerConfig {
  textureKey: string;
  y: number;
  depth: number;
}

export class ParallaxLoopLayer {
  private readonly segments: GameObjects.Image[] = [];
  private readonly segmentWidth: number;
  private readonly sceneWidth: number;

  constructor(scene: Scene, config: ParallaxLoopLayerConfig) {
    const textureFrame = scene.textures.get(config.textureKey).get();
    const displayWidth = textureFrame.cutWidth;

    this.segmentWidth = displayWidth;
    this.sceneWidth = scene.scale.width;

    const segmentCount = Math.ceil(this.sceneWidth / displayWidth) + 2;

    for (let index = 0; index < segmentCount; index += 1) {
      const segment = scene.add.image(index * displayWidth, config.y, config.textureKey);
      segment.setOrigin(0, 0);
      segment.setDepth(config.depth);

      this.segments.push(segment);
    }
  }

  scroll(deltaSeconds: number, speedPxPerSecond: number) {
    const shift = speedPxPerSecond * deltaSeconds;

    if (shift === 0) {
      return;
    }

    for (const segment of this.segments) {
      segment.x -= shift;
    }

    if (shift > 0) {
      for (const segment of this.segments) {
        if (segment.x + this.segmentWidth <= 0) {
          segment.x = this.getRightmostX() + this.segmentWidth;
        }
      }

      return;
    }

    for (const segment of this.segments) {
      if (segment.x >= this.sceneWidth) {
        segment.x = this.getLeftmostX() - this.segmentWidth;
      }
    }
  }

  private getRightmostX() {
    return this.segments.reduce(
      (rightmostX, segment) => Math.max(rightmostX, segment.x),
      Number.NEGATIVE_INFINITY,
    );
  }

  private getLeftmostX() {
    return this.segments.reduce(
      (leftmostX, segment) => Math.min(leftmostX, segment.x),
      Number.POSITIVE_INFINITY,
    );
  }
}
