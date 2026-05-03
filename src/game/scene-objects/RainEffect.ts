import { Scene } from "phaser";

export interface RainEffectConfig {
  textureKey: string;
  dropWidth: number;
  dropHeight: number;
  dropColor: number;
  dropAlpha: number;
  yStart: number;
  lifespanMs: number;
  speedYMin: number;
  speedYMax: number;
  speedXMin: number;
  speedXMax: number;
  quantity: number;
  alphaStart: number;
  alphaEnd: number;
  depth: number;
}

export class RainEffect {
  readonly emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Scene, config: RainEffectConfig) {
    this.ensureDropTexture(scene, config);

    this.emitter = scene.add.particles(0, 0, config.textureKey, {
      x: { min: 0, max: scene.scale.width },
      y: config.yStart,
      lifespan: config.lifespanMs,
      speedY: { min: config.speedYMin, max: config.speedYMax },
      speedX: { min: config.speedXMin, max: config.speedXMax },
      quantity: config.quantity,
      alpha: { start: config.alphaStart, end: config.alphaEnd },
    });
    this.emitter.setDepth(config.depth);
  }

  private ensureDropTexture(scene: Scene, config: RainEffectConfig) {
    if (scene.textures.exists(config.textureKey)) {
      return;
    }

    const dropTexture = scene.add.graphics();
    dropTexture.setVisible(false);
    dropTexture.fillStyle(config.dropColor, config.dropAlpha);
    dropTexture.fillRect(0, 0, config.dropWidth, config.dropHeight);
    dropTexture.generateTexture(
      config.textureKey,
      config.dropWidth,
      config.dropHeight,
    );
    dropTexture.destroy();
  }
}
