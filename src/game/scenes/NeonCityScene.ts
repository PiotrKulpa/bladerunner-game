import { GameObjects, Scene } from "phaser";
import { Deckard } from "../characters/Deckard";
import { ASSETS, DECKARD_JUMP, DECKARD_RUN, SCENE_KEYS } from "../config/app-config";
import { AnchoredAnimatedSprite } from "../scene-objects/AnchoredAnimatedSprite";
import { ParallaxLoopLayer } from "../scene-objects/ParallaxLoopLayer";

const NEON_CITY_LAYOUT = {
  deckardOffsetFromSidewalkTop: 0,
  deckardScale: 1,
  leftStartBuildingX: 0,
  automatTrashX: 180,
  greenNeonBuildingX: 700,
  groundCentralBuildingGapX: 0,
  flatPinkGapFromGroundCentralX: 650,
  flatPink2GapFromFlatPinkX: 0,
  pipesStep: 1280,
  smokeLiftY: 120,
} as const;

const NEON_CITY_SPEED = {
  movementBoost: 210,
} as const;

const NEON_CITY_ANIMATION_KEYS = {
  smokeLoop: "smoke-loop-sprite",
} as const;

export class NeonCityScene extends Scene {
  private backgroundLayer?: ParallaxLoopLayer;
  private sidewalkLayer?: ParallaxLoopLayer;
  private pipes: GameObjects.Image[] = [];
  private smokeSprites: AnchoredAnimatedSprite[] = [];
  private pipeStep = 0;
  private leftStartBuilding?: GameObjects.Image;
  private automatTrash?: GameObjects.Image;
  private greenNeonBuilding?: GameObjects.Image;
  private groundCentralBuilding?: GameObjects.Image;
  private flatPinkBuilding?: GameObjects.Image;
  private flatPink2Building?: GameObjects.Image;
  private deckard?: Deckard;

  constructor() {
    super(SCENE_KEYS.neonCity);
  }

  create() {
    const camera = this.cameras.main;
    camera.setZoom(1);

    const { centerX } = camera;
    const sidewalkTextureFrame = this.textures
      .get(ASSETS.images.neonCitySidewalk.key)
      .get();
    const sidewalkY = this.scale.height - sidewalkTextureFrame.cutHeight;
    this.pipeStep = NEON_CITY_LAYOUT.pipesStep;

    this.backgroundLayer = new ParallaxLoopLayer(this, {
      textureKey: ASSETS.images.neonCityBackground.key,
      y: 0,
      depth: 0,
    });

    this.sidewalkLayer = new ParallaxLoopLayer(this, {
      textureKey: ASSETS.images.neonCitySidewalk.key,
      y: sidewalkY,
      depth: 2,
    });

    const pipesCount = Math.ceil(this.scale.width / this.pipeStep) + 3;
    for (let index = 0; index < pipesCount; index += 1) {
      const pipe = this.add
        .image(index * this.pipeStep, this.scale.height, ASSETS.images.neonCityPipes.key)
        .setOrigin(0, 1)
        .setDepth(1000);
      this.pipes.push(pipe);
    }

    this.ensureSmokeAnimation();
    this.ensureDeckardRunAnimation();
    this.ensureDeckardJumpAnimation();
    for (const pipe of this.pipes) {
      const smokeSprite = new AnchoredAnimatedSprite(this, centerX, this.scale.height / 2, {
        x: pipe.x,
        y: pipe.y - NEON_CITY_LAYOUT.smokeLiftY,
        textureKey: ASSETS.spritesheets.smokeAnimation.key,
        depth: 1001,
        scale: 0.4,
        alpha: 0.55,
        animationKey: NEON_CITY_ANIMATION_KEYS.smokeLoop,
      });
      smokeSprite.sprite.setOrigin(0, 1);
      this.smokeSprites.push(smokeSprite);
    }

    this.leftStartBuilding = this.add
      .image(
        NEON_CITY_LAYOUT.leftStartBuildingX,
        this.scale.height,
        ASSETS.images.neonCityLeftStartBuilding.key,
      )
      .setOrigin(0, 1)
      .setDepth(2.5);

    this.automatTrash = this.add
      .image(
        NEON_CITY_LAYOUT.automatTrashX,
        this.scale.height,
        ASSETS.images.neonCityAutomatTrash.key,
      )
      .setOrigin(0, 1)
      .setDepth(2.5);

    this.greenNeonBuilding = this.add
      .image(
        NEON_CITY_LAYOUT.greenNeonBuildingX,
        this.scale.height,
        ASSETS.images.neonCityGreenNeonBuilding.key,
      )
      .setOrigin(0, 1)
      .setScale(1)
      .setDepth(0.5);

    this.groundCentralBuilding = this.add
      .image(
        this.greenNeonBuilding.x +
          this.greenNeonBuilding.displayWidth +
          NEON_CITY_LAYOUT.groundCentralBuildingGapX,
        this.scale.height,
        ASSETS.images.neonCityGroundCentralBuilding.key,
      )
      .setOrigin(0, 1)
      .setScale(1)
      .setDepth(0.5);

    this.flatPinkBuilding = this.add
      .image(
        this.groundCentralBuilding.x +
          this.groundCentralBuilding.displayWidth +
          NEON_CITY_LAYOUT.flatPinkGapFromGroundCentralX,
        sidewalkY,
        ASSETS.images.neonCityFlatPink.key,
      )
      .setOrigin(0, 1)
      .setScale(1)
      .setDepth(0.5);

    this.flatPink2Building = this.add
      .image(
        this.flatPinkBuilding.x +
          this.flatPinkBuilding.displayWidth +
          NEON_CITY_LAYOUT.flatPink2GapFromFlatPinkX,
        sidewalkY,
        ASSETS.images.neonCityFlatPink2.key,
      )
      .setOrigin(0, 1)
      .setScale(1)
      .setDepth(0.5);

    this.deckard = new Deckard(this, {
      textureKey: ASSETS.images.deckard.key,
      runAnimationKey: DECKARD_RUN.animationKey,
      jumpAnimationKey: DECKARD_JUMP.animationKey,
      x: centerX,
      y: sidewalkY + NEON_CITY_LAYOUT.deckardOffsetFromSidewalkTop,
      moveSpeed: 270,
      horizontalPadding: 20,
      jumpHeight: DECKARD_JUMP.jumpHeight,
      jumpRiseDurationMs: DECKARD_JUMP.jumpRiseDurationMs,
      jumpFallDurationMs: DECKARD_JUMP.jumpFallDurationMs,
      jumpMovementStartDelayMs: DECKARD_JUMP.jumpMovementStartDelayMs,
    });
    this.deckard.setScale(NEON_CITY_LAYOUT.deckardScale);
    this.deckard.setDepth(3);
  }

  update(_: number, delta: number) {
    if (
      !this.backgroundLayer ||
      !this.sidewalkLayer ||
      this.pipes.length === 0 ||
      !this.leftStartBuilding ||
      !this.automatTrash ||
      !this.greenNeonBuilding ||
      !this.groundCentralBuilding ||
      !this.flatPinkBuilding ||
      !this.flatPink2Building ||
      !this.deckard
    ) {
      return;
    }

    const deltaSeconds = delta / 1000;

    const buildingRightEdge =
      this.leftStartBuilding.x + this.leftStartBuilding.displayWidth;
    const deckardLeftBoundary = buildingRightEdge + this.deckard.displayWidth * 0.5;

    this.deckard.updateMovement(
      deltaSeconds,
      this.scale.width,
      deckardLeftBoundary,
    );

    const direction = this.deckard.getMoveDirection();
    if (direction === 0) {
      return;
    }

    const requestedWorldSpeed = direction * NEON_CITY_SPEED.movementBoost;
    const nextBuildingX = Math.min(
      NEON_CITY_LAYOUT.leftStartBuildingX,
      this.leftStartBuilding.x - requestedWorldSpeed * deltaSeconds,
    );
    const effectiveWorldSpeed =
      (this.leftStartBuilding.x - nextBuildingX) / deltaSeconds;

    if (effectiveWorldSpeed === 0) {
      return;
    }

    this.backgroundLayer.scroll(
      deltaSeconds,
      effectiveWorldSpeed * 0.3,
    );
    this.sidewalkLayer.scroll(deltaSeconds, effectiveWorldSpeed);
    this.scrollPipes(deltaSeconds, effectiveWorldSpeed);
    this.syncSmokeToPipe();
    this.leftStartBuilding.x = nextBuildingX;
    this.automatTrash.x -= effectiveWorldSpeed * deltaSeconds;
    this.greenNeonBuilding.x -= effectiveWorldSpeed * deltaSeconds;
    this.groundCentralBuilding.x -= effectiveWorldSpeed * deltaSeconds;
    this.flatPinkBuilding.x -= effectiveWorldSpeed * deltaSeconds;
    this.flatPink2Building.x -= effectiveWorldSpeed * deltaSeconds;
  }

  private scrollPipes(deltaSeconds: number, speedPxPerSecond: number) {
    const shift = speedPxPerSecond * deltaSeconds;
    if (shift === 0) {
      return;
    }

    for (const pipe of this.pipes) {
      pipe.x -= shift;
    }

    if (shift > 0) {
      for (const pipe of this.pipes) {
        if (pipe.x + pipe.displayWidth <= 0) {
          pipe.x = this.getRightmostPipeX() + this.pipeStep;
        }
      }
      return;
    }

    for (const pipe of this.pipes) {
      if (pipe.x >= this.scale.width) {
        pipe.x = this.getLeftmostPipeX() - this.pipeStep;
      }
    }
  }

  private getRightmostPipeX() {
    return this.pipes.reduce(
      (rightmostX, pipe) => Math.max(rightmostX, pipe.x),
      Number.NEGATIVE_INFINITY,
    );
  }

  private getLeftmostPipeX() {
    return this.pipes.reduce(
      (leftmostX, pipe) => Math.min(leftmostX, pipe.x),
      Number.POSITIVE_INFINITY,
    );
  }

  private syncSmokeToPipe() {
    for (let index = 0; index < this.pipes.length; index += 1) {
      const pipe = this.pipes[index];
      const smokeSprite = this.smokeSprites[index];
      if (!smokeSprite) {
        continue;
      }

      smokeSprite.sprite.x = pipe.x;
      smokeSprite.sprite.y = pipe.y - NEON_CITY_LAYOUT.smokeLiftY;
    }
  }

  private ensureSmokeAnimation() {
    if (this.anims.exists(NEON_CITY_ANIMATION_KEYS.smokeLoop)) {
      return;
    }

    this.anims.create({
      key: NEON_CITY_ANIMATION_KEYS.smokeLoop,
      frames: this.anims.generateFrameNumbers(ASSETS.spritesheets.smokeAnimation.key, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private ensureDeckardRunAnimation() {
    if (this.anims.exists(DECKARD_RUN.animationKey)) {
      return;
    }

    this.anims.create({
      key: DECKARD_RUN.animationKey,
      frames: this.anims.generateFrameNumbers(ASSETS.spritesheets.deckardRun.key, {
        start: DECKARD_RUN.frameStart,
        end: DECKARD_RUN.frameEnd,
      }),
      frameRate: DECKARD_RUN.frameRate,
      repeat: DECKARD_RUN.repeat,
    });
  }

  private ensureDeckardJumpAnimation() {
    if (this.anims.exists(DECKARD_JUMP.animationKey)) {
      return;
    }

    this.anims.create({
      key: DECKARD_JUMP.animationKey,
      frames: this.anims.generateFrameNumbers(ASSETS.spritesheets.deckardJump.key, {
        start: DECKARD_JUMP.frameStart,
        end: DECKARD_JUMP.frameEnd,
      }),
      duration: DECKARD_JUMP.animationDurationMs,
      repeat: DECKARD_JUMP.repeat,
    });
  }
}
