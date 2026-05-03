import { GameObjects, Scene } from "phaser";
import { Deckard } from "../characters/Deckard";
import { ASSETS, SCENE_KEYS } from "../config/app-config";
import { ParallaxLoopLayer } from "../scene-objects/ParallaxLoopLayer";

const NEON_CITY_LAYOUT = {
  deckardOffsetFromSidewalkTop: 0,
  leftStartBuildingX: 0,
  automatTrashX: 180,
} as const;

const NEON_CITY_SPEED = {
  movementBoost: 210,
} as const;

export class NeonCityScene extends Scene {
  private backgroundLayer?: ParallaxLoopLayer;
  private sidewalkLayer?: ParallaxLoopLayer;
  private leftStartBuilding?: GameObjects.Image;
  private automatTrash?: GameObjects.Image;
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

    this.deckard = new Deckard(this, {
      textureKey: ASSETS.images.deckard.key,
      x: centerX,
      y: sidewalkY + NEON_CITY_LAYOUT.deckardOffsetFromSidewalkTop,
      moveSpeed: 270,
      horizontalPadding: 20,
    });
    this.deckard.setDepth(3);
  }

  update(_: number, delta: number) {
    if (
      !this.backgroundLayer ||
      !this.sidewalkLayer ||
      !this.leftStartBuilding ||
      !this.automatTrash ||
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
    this.leftStartBuilding.x = nextBuildingX;
    this.automatTrash.x -= effectiveWorldSpeed * deltaSeconds;
  }
}
