import { GameObjects, Input, Math as PhaserMath, Scene } from "phaser";

export interface DeckardConfig {
  textureKey: string;
  x: number;
  y: number;
  moveSpeed: number;
  horizontalPadding: number;
}

export class Deckard extends GameObjects.Image {
  private readonly cursors: Input.Keyboard.CursorKeys;
  private readonly moveSpeed: number;
  private readonly horizontalPadding: number;
  private moveDirection = 0;

  constructor(scene: Scene, config: DeckardConfig) {
    super(scene, config.x, config.y, config.textureKey);

    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is unavailable for Deckard.");
    }

    this.cursors = keyboard.createCursorKeys();
    this.moveSpeed = config.moveSpeed;
    this.horizontalPadding = config.horizontalPadding;

    scene.add.existing(this);

    this.setOrigin(0.5, 1);
  }

  updateMovement(
    deltaSeconds: number,
    viewportWidth: number,
    minCenterX?: number,
  ) {
    this.moveDirection = 0;

    if (this.cursors.left.isDown) {
      this.moveDirection = -1;
    } else if (this.cursors.right.isDown) {
      this.moveDirection = 1;
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
  }

  getMoveDirection() {
    return this.moveDirection;
  }
}
