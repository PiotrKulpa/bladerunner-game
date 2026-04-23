import { Scene } from "phaser";
import { FlybyObject } from "./FlybyObject";

export interface MainMenuFlyingCarConfig {
  textureKey: string;
  depth: number;
  startOffsetY: number;
  endOffsetY: number;
  primaryEndOffsetX: number;
  exitOffsetY: number;
  startScale: number;
  midScale: number;
  endScale: number;
  primaryDurationMs: number;
  exitDurationMs: number;
}

export class MainMenuFlyingCar {
  constructor(
    private readonly scene: Scene,
    private readonly config: MainMenuFlyingCarConfig,
  ) {
    this.createFlybyObject();
  }

  private createFlybyObject() {
    const { centerY } = this.scene.cameras.main;

    const textureFrame = this.scene.textures.get(this.config.textureKey).get();
    const halfTextureWidth = textureFrame.cutWidth * 0.5;

    const startX = -halfTextureWidth;
    const startY = centerY + this.config.startOffsetY;
    const endX = this.scene.scale.width + halfTextureWidth;
    const endY = centerY + this.config.endOffsetY;

    return new FlybyObject(this.scene, {
      textureKey: this.config.textureKey,
      depth: this.config.depth,
      start: {
        x: startX,
        y: startY,
        scale: this.config.startScale,
        alpha: 1,
      },
      segments: [
        {
          x: endX - this.config.primaryEndOffsetX,
          y: endY,
          scale: this.config.midScale,
          durationMs: this.config.primaryDurationMs,
          ease: "Sine.easeInOut",
        },
        {
          x: endX,
          y: endY + this.config.exitOffsetY,
          scale: this.config.endScale,
          alpha: 0,
          durationMs: this.config.exitDurationMs,
          ease: "Linear",
        },
      ],
    });
  }
}
