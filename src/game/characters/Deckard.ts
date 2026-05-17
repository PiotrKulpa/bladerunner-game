import { GameObjects, Input, Math as PhaserMath, Scene } from "phaser";

export interface DeckardConfig {
  textureKey: string;
  runAnimationKey: string;
  jumpAnimationKey: string;
  x: number;
  y: number;
  moveSpeed: number;
  horizontalPadding: number;
  jumpHeight: number;
  jumpRiseDurationMs: number;
  jumpFallDurationMs: number;
  jumpMovementStartDelayMs: number;
}

export class Deckard extends GameObjects.Sprite {
  private readonly cursors: Input.Keyboard.CursorKeys;
  private readonly idleTextureKey: string;
  private readonly runAnimationKey: string;
  private readonly jumpAnimationKey: string;
  private readonly moveSpeed: number;
  private readonly horizontalPadding: number;
  private readonly jumpHeight: number;
  private readonly jumpRiseDurationMs: number;
  private readonly jumpFallDurationMs: number;
  private readonly jumpMovementStartDelayMs: number;
  private readonly groundY: number;
  private moveDirection = 0;
  private isJumping = false;

  constructor(scene: Scene, config: DeckardConfig) {
    super(scene, config.x, config.y, config.textureKey);

    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is unavailable for Deckard.");
    }

    this.cursors = keyboard.createCursorKeys();
    this.idleTextureKey = config.textureKey;
    this.runAnimationKey = config.runAnimationKey;
    this.jumpAnimationKey = config.jumpAnimationKey;
    this.moveSpeed = config.moveSpeed;
    this.horizontalPadding = config.horizontalPadding;
    this.jumpHeight = config.jumpHeight;
    this.jumpRiseDurationMs = config.jumpRiseDurationMs;
    this.jumpFallDurationMs = config.jumpFallDurationMs;
    this.jumpMovementStartDelayMs = config.jumpMovementStartDelayMs;
    this.groundY = config.y;

    scene.add.existing(this);

    this.setOrigin(0.5, 1);
  }

  updateMovement(
    deltaSeconds: number,
    viewportWidth: number,
    minCenterX?: number,
  ): void {
    this.moveDirection = 0;

    if (this.cursors.left.isDown) {
      this.moveDirection = -1;
    } else if (this.cursors.right.isDown) {
      this.moveDirection = 1;
    }
    this.tryStartJump();

    const nextX = this.x + this.moveDirection * this.moveSpeed * deltaSeconds;
    const defaultMinX = this.displayWidth * 0.5 + this.horizontalPadding;
    const minX = Math.max(defaultMinX, minCenterX ?? defaultMinX);
    const maxX = viewportWidth - this.displayWidth * 0.5 - this.horizontalPadding;

    this.x = PhaserMath.Clamp(nextX, minX, maxX);

    if (this.moveDirection < 0) {
      this.setFlipX(true);
    } else if (this.moveDirection > 0) {
      this.setFlipX(false);
    }

    this.updateRunAnimation();
  }

  getMoveDirection(): number {
    return this.moveDirection;
  }

  private tryStartJump(): void {
    if (this.isJumping || !Input.Keyboard.JustDown(this.cursors.up)) {
      return;
    }

    this.isJumping = true;
    this.scene.tweens.killTweensOf(this);
    if (this.jumpMovementStartDelayMs > 0) {
      this.playAfterDelay(this.jumpAnimationKey, this.jumpMovementStartDelayMs);
    } else {
      this.play(this.jumpAnimationKey, true);
    }

    this.scene.tweens.add({
      targets: this,
      y: this.groundY - this.jumpHeight,
      delay: this.jumpMovementStartDelayMs,
      duration: this.jumpRiseDurationMs,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          y: this.groundY,
          duration: this.jumpFallDurationMs,
          ease: "Sine.easeIn",
          onComplete: () => {
            this.y = this.groundY;
            this.isJumping = false;
          },
        });
      },
    });
  }

  private updateRunAnimation(): void {
    if (this.isJumping) {
      return;
    }

    if (this.moveDirection !== 0) {
      this.play(this.runAnimationKey, true);
      return;
    }

    if (!this.anims.isPlaying && this.texture.key === this.idleTextureKey) {
      return;
    }

    this.stop();
    this.setTexture(this.idleTextureKey);
    this.setOrigin(0.5, 1);
  }
}
