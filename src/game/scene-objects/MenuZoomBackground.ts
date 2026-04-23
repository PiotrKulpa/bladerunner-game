import { Scene, GameObjects } from "phaser";

export interface MenuZoomBackgroundConfig {
  textureKey: string;
  zoomScale: number;
  zoomDurationMs: number;
}

export class MenuZoomBackground {
  readonly image: GameObjects.Image;
  private readonly baseScaleX: number;
  private readonly baseScaleY: number;

  constructor(scene: Scene, config: MenuZoomBackgroundConfig) {
    const { centerX, centerY } = scene.cameras.main;

    scene.cameras.main.roundPixels = false;
    scene.textures.get(config.textureKey).setFilter(0);

    this.image = scene.add.image(centerX, centerY, config.textureKey);
    this.image.setDisplaySize(scene.scale.width, scene.scale.height);

    this.baseScaleX = this.image.scaleX;
    this.baseScaleY = this.image.scaleY;

    scene.tweens.add({
      targets: this.image,
      scaleX: this.baseScaleX * config.zoomScale,
      scaleY: this.baseScaleY * config.zoomScale,
      duration: config.zoomDurationMs,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  getScaleRatios() {
    return {
      x: this.image.scaleX / this.baseScaleX,
      y: this.image.scaleY / this.baseScaleY,
    };
  }
}
