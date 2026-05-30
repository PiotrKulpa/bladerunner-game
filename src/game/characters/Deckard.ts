import { GameObjects, Input, Math as PhaserMath, Scene } from "phaser";

const RUN_SHOOT_FRAME_DURATION_MS = 85;

export interface DeckardConfig {
  textureKey: string;
  runAnimationKey: string;
  runFireTextureKey: string;
  runFireUpTextureKey: string;
  jumpAnimationKey: string;
  shootFrontAnimationKey: string;
  shootUpAnimationKey: string;
  crouchFireAnimationKey: string;
  crouchTextureKey: string;
  crouchFrame: number;
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
  private readonly jumpKey: Input.Keyboard.Key;
  private readonly shootKey: Input.Keyboard.Key;
  private readonly aimKey: Input.Keyboard.Key;
  private readonly idleTextureKey: string;
  private readonly runAnimationKey: string;
  private readonly runFireTextureKey: string;
  private readonly runFireUpTextureKey: string;
  private readonly jumpAnimationKey: string;
  private readonly shootFrontAnimationKey: string;
  private readonly shootUpAnimationKey: string;
  private readonly crouchFireAnimationKey: string;
  private readonly crouchTextureKey: string;
  private readonly crouchFrame: number;
  private readonly moveSpeed: number;
  private readonly horizontalPadding: number;
  private readonly jumpHeight: number;
  private readonly jumpRiseDurationMs: number;
  private readonly jumpFallDurationMs: number;
  private readonly jumpMovementStartDelayMs: number;
  private readonly groundY: number;
  private moveDirection = 0;
  private isJumping = false;
  private isShooting = false;
  private isCrouching = false;
  private isAiming = false;
  private runShootFrontFrameUntilMs = 0;
  private runShootUpFrameUntilMs = 0;

  constructor(scene: Scene, config: DeckardConfig) {
    super(scene, config.x, config.y, config.textureKey);

    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is unavailable for Deckard.");
    }

    this.cursors = keyboard.createCursorKeys();
    this.jumpKey = keyboard.addKey(Input.Keyboard.KeyCodes.X);
    this.shootKey = keyboard.addKey(Input.Keyboard.KeyCodes.Z);
    this.aimKey = keyboard.addKey(Input.Keyboard.KeyCodes.C);
    this.idleTextureKey = config.textureKey;
    this.runAnimationKey = config.runAnimationKey;
    this.runFireTextureKey = config.runFireTextureKey;
    this.runFireUpTextureKey = config.runFireUpTextureKey;
    this.jumpAnimationKey = config.jumpAnimationKey;
    this.shootFrontAnimationKey = config.shootFrontAnimationKey;
    this.shootUpAnimationKey = config.shootUpAnimationKey;
    this.crouchFireAnimationKey = config.crouchFireAnimationKey;
    this.crouchTextureKey = config.crouchTextureKey;
    this.crouchFrame = config.crouchFrame;
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
    this.isAiming = this.aimKey.isDown && !this.isJumping;
    this.isCrouching = this.cursors.down.isDown && !this.isJumping;

    if (this.isAiming || this.isCrouching) {
      this.moveDirection = 0;
    } else if (this.cursors.left.isDown) {
      this.moveDirection = -1;
    } else if (this.cursors.right.isDown) {
      this.moveDirection = 1;
    }

    this.tryStartJump();
    this.tryStartShootDown();
    this.tryStartShootUp();
    this.tryStartRunShootUp();
    this.tryStartRunShootFront();
    this.tryStartShootFront();

    if (this.isShooting) {
      this.moveDirection = 0;
    }

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
    if (
      this.isJumping ||
      this.isShooting ||
      this.isRunShootFrameActive() ||
      !Input.Keyboard.JustDown(this.jumpKey)
    ) {
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

  private tryStartShootFront(): void {
    if (
      this.isShooting ||
      this.isRunShootFrameActive() ||
      this.isJumping ||
      this.isCrouching ||
      this.moveDirection !== 0 ||
      !Input.Keyboard.JustDown(this.shootKey)
    ) {
      return;
    }

    this.isShooting = true;
    this.play(this.shootFrontAnimationKey, true);
    this.once(`animationcomplete-${this.shootFrontAnimationKey}`, () => {
      this.isShooting = false;
    });
  }

  private tryStartShootUp(): void {
    if (
      this.isShooting ||
      this.isRunShootFrameActive() ||
      this.isJumping ||
      this.isCrouching ||
      this.moveDirection !== 0 ||
      !this.cursors.up.isDown ||
      !Input.Keyboard.JustDown(this.shootKey)
    ) {
      return;
    }

    this.isShooting = true;
    this.play(this.shootUpAnimationKey, true);
    this.once(`animationcomplete-${this.shootUpAnimationKey}`, () => {
      this.isShooting = false;
    });
  }

  private tryStartShootDown(): void {
    if (
      this.isShooting ||
      this.isRunShootFrameActive() ||
      this.isJumping ||
      !this.isCrouching ||
      !Input.Keyboard.JustDown(this.shootKey)
    ) {
      return;
    }

    this.isShooting = true;
    this.play(this.crouchFireAnimationKey, true);
    this.once(`animationcomplete-${this.crouchFireAnimationKey}`, () => {
      this.isShooting = false;
    });
  }

  private tryStartRunShootUp(): void {
    if (
      this.isShooting ||
      this.isRunShootFrameActive() ||
      this.isJumping ||
      this.isCrouching ||
      !this.cursors.up.isDown ||
      this.moveDirection === 0 ||
      !Input.Keyboard.JustDown(this.shootKey)
    ) {
      return;
    }

    const runShootFrame = this.getRunShootFrameIndex(this.runFireUpTextureKey);
    this.setFlipX(this.moveDirection < 0);
    this.stop();
    this.setTexture(this.runFireUpTextureKey, runShootFrame);
    this.setOrigin(0.5, 1);
    this.runShootUpFrameUntilMs = this.scene.time.now + RUN_SHOOT_FRAME_DURATION_MS;
  }

  private tryStartRunShootFront(): void {
    if (
      this.isShooting ||
      this.isRunShootFrameActive() ||
      this.isJumping ||
      this.isCrouching ||
      this.cursors.up.isDown ||
      this.moveDirection === 0 ||
      !Input.Keyboard.JustDown(this.shootKey)
    ) {
      return;
    }

    const runShootFrame = this.getRunShootFrameIndex(this.runFireTextureKey);
    this.setFlipX(this.moveDirection < 0);
    this.stop();
    this.setTexture(this.runFireTextureKey, runShootFrame);
    this.setOrigin(0.5, 1);
    this.runShootFrontFrameUntilMs = this.scene.time.now + RUN_SHOOT_FRAME_DURATION_MS;
  }

  private updateRunAnimation(): void {
    if (this.isJumping) {
      return;
    }

    if (this.isShooting) {
      return;
    }

    if (this.isRunShootFrameActive() && this.moveDirection !== 0) {
      return;
    }

    if (this.isCrouching) {
      this.stop();
      this.setTexture(this.crouchTextureKey, this.crouchFrame);
      this.setOrigin(0.5, 1);
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

  private isRunShootFrameActive(): boolean {
    const now = this.scene.time.now;
    return now < this.runShootFrontFrameUntilMs || now < this.runShootUpFrameUntilMs;
  }

  private getRunShootFrameIndex(textureKey: string): number {
    const frameIndex = this.getCurrentFrameIndex();
    const runFireTexture = this.scene.textures.get(textureKey);
    if (runFireTexture.has(frameIndex)) {
      return frameIndex;
    }

    return 0;
  }

  private getCurrentFrameIndex(): number {
    const currentFrameName = this.frame.name;
    if (typeof currentFrameName === "number") {
      return currentFrameName;
    }

    const parsedFrameIndex = Number(currentFrameName);
    return Number.isInteger(parsedFrameIndex) ? parsedFrameIndex : 0;
  }
}
