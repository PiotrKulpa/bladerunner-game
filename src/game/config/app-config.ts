export const APP_IDS = {
  gameContainer: "game-container",
} as const;

export const SCENE_KEYS = {
  boot: "Boot",
  preloader: "Preloader",
  mainMenu: "MainMenu",
  game: "Game",
  neonCity: "NeonCity",
  gameOver: "GameOver",
} as const;

export const GAME_VIEWPORT = {
  width: 1280,
  height: 720,
  backgroundColor: "#000000",
} as const;

export const FONT_FAMILIES = {
  ui: "VT323",
  header: "BladeRunner",
  fallback: "Arial Black",
} as const;

export const FONT_PRELOAD_ORDER = [
  FONT_FAMILIES.ui,
  FONT_FAMILIES.header,
] as const;

export const COLOR_PALETTE = {
  blackHex: "#000000",
  whiteHex: "#ffffff",
  uiAccentHex: "#fda93a",
  headerPrimaryHex: "#ed3d29",
  preloaderBackground: 0x000000,
  preloaderBar: 0xffffff,
  gameBackground: 0x00ff00,
  gameOverBackground: 0xff0000,
} as const;

export const CONTENT_TEXT = {
  mainMenu: {
    headerTitle: "blade runner",
    startButtonLabel: "START",
  },
  game: {
    message: "Make something fun!\nand share it with us:\nsupport@phaser.io",
  },
  gameOver: {
    headerTitle: "game over",
  },
} as const;

export const ASSETS = {
  images: {
    mainMenuBackground: {
      key: "main-menu-bg",
      path: "main-menu/main-menu-bg.png",
    },
    uiButtonBackground: {
      key: "ui-button-bg",
      path: "ui-components/button-bg.png",
    },
    flyingCar: {
      key: "flying-car",
      path: "main-menu/flying-car.png",
    },
    neonCityBackground: {
      key: "neon-city-bg",
      path: "neon-city-scene/bg.png",
    },
    neonCitySidewalk: {
      key: "neon-city-sidewalk",
      path: "neon-city-scene/main-metal-structure.png",
    },
    neonCityLeftStartBuilding: {
      key: "neon-city-left-start-building",
      path: "neon-city-scene/left-start-building.png",
    },
    neonCityAutomatTrash: {
      key: "neon-city-automat-trash",
      path: "neon-city-scene/automat&trash.png",
    },
    neonCityGreenNeonBuilding: {
      key: "neon-city-green-neon-building",
      path: "neon-city-scene/green-neon-building.png",
    },
    neonCityGroundCentralBuilding: {
      key: "neon-city-ground-central-building",
      path: "neon-city-scene/grnd-central-building.png",
    },
    neonCityFlatPink: {
      key: "neon-city-flat-pink",
      path: "neon-city-scene/flat-pink.png",
    },
    neonCityFlatPink2: {
      key: "neon-city-flat-pink-2",
      path: "neon-city-scene/flat-pink2.png",
    },
    neonCityPipes: {
      key: "neon-city-pipes",
      path: "neon-city-scene/pipes.png",
    },
    deckard: {
      key: "deckard",
      path: "characters/deckard.png",
    },
  },
  spritesheets: {
    fireAnimation: {
      key: "fire-animation",
      path: "main-menu/fire-animation.png",
      frameWidth: 256,
      frameHeight: 1024,
    },
    fireAnimationUp: {
      key: "fire-animation-up",
      path: "main-menu/fire-animation-up.png",
      frameWidth: 96,
      frameHeight: 96,
    },
    smokeAnimation: {
      key: "smoke-animation",
      path: "main-menu/smoke-animation.png",
      frameWidth: 235,
      frameHeight: 383,
    },
    deckardRun: {
      key: "deckard-run",
      path: "characters/deckard-run-sprite.png",
      frameWidth: 111,
      frameHeight: 142,
    },
    deckardRunFire: {
      key: "deckard-run-fire",
      path: "characters/deckard-run-fire-sprite.png",
      frameWidth: 150,
      frameHeight: 142,
    },
    deckardRunFireUp: {
      key: "deckard-run-fire-up",
      path: "characters/deckard-run-fire-up-sprite.png",
      frameWidth: 150,
      frameHeight: 182,
    },
    deckardJump: {
      key: "deckard-jump",
      path: "characters/deckard-jump-sprite.png",
      frameWidth: 130,
      frameHeight: 142,
    },
    deckardShootFront: {
      key: "deckard-shoot-front",
      path: "characters/deckard-shoot-front-sprite.png",
      frameWidth: 127,
      frameHeight: 142,
    },
    deckardShootUp: {
      key: "deckard-shoot-up",
      path: "characters/deckard-shoot-up-sprite.png",
      frameWidth: 81,
      frameHeight: 178,
    },
    deckardCrouchFire: {
      key: "deckard-crouch-fire",
      path: "characters/decard-crouch-shoot-sprite.png",
      frameWidth: 76,
      frameHeight: 144,
    },
    gameOverOwlAnimation: {
      key: "game-over-owl-animation",
      path: "game-over/owl-animation-sheet.png",
      frameWidth: 265,
      frameHeight: 220,
    },
  },
  audio: {
    mainMenuTheme: {
      key: "main-menu-theme",
      path: "main-menu/main-menu-music-theme.mp3",
    },
  },
} as const;

export const UI_TOKENS = {
  button: {
    textureKey: ASSETS.images.uiButtonBackground.key,
    fontFamily: FONT_FAMILIES.ui,
    fontSize: 64,
    textColor: COLOR_PALETTE.uiAccentHex,
    disabledAlpha: 0.65,
    defaultScale: 0.5,
  },
  header: {
    width: 900,
    minHeight: 0,
    paddingX: 28,
    paddingY: 20,
    gap: 10,
    align: "center" as const,
    backgroundColor: 0x000000,
    backgroundAlpha: 0,
    titleStyle: {
      fontFamily: FONT_FAMILIES.header,
      fontSize: "120px",
      color: COLOR_PALETTE.uiAccentHex,
      align: "center" as const,
    },
    subtitleStyle: {
      fontFamily: FONT_FAMILIES.ui,
      fontSize: "40px",
      color: COLOR_PALETTE.uiAccentHex,
      align: "center" as const,
    },
  },
} as const;

export const MAIN_MENU_LAYOUT = {
  backgroundZoomScale: 1.35,
  headerOffsetY: -50,
  headerScale: 3,
  headerWidthRatio: 0.7,
  startButtonOffsetY: 100,
} as const;

export const MAIN_MENU_TIMINGS = {
  backgroundZoomDurationMs: 45000,
  flyingCarPrimaryDurationMs: 25000,
  flyingCarExitDurationMs: 1200,
  fireBurstLoopDelayMs: 6000,
  fireBurstCloneDelayMs: 1200,
  fireBurstClone2DelayMs: 700,
  overlayFadeDurationMs: 2000,
  headerFadeDelayMs: 5000,
  headerFadeDurationMs: 1200,
  buttonFadeDelayMs: 5400,
  buttonFadeDurationMs: 800,
} as const;

export const MAIN_MENU_AUDIO = {
  themeLoop: true,
  themeVolume: 0.5,
} as const;

export const DECKARD_RUN = {
  animationKey: "deckard-run-loop",
  frameStart: 0,
  frameEnd: 7,
  frameRate: 12,
  repeat: -1,
} as const;

export const DECKARD_RUN_FIRE = {
  animationKey: "deckard-run-fire-loop",
  frameStart: 0,
  frameEnd: 7,
  frameRate: 12,
  repeat: 0,
} as const;

export const DECKARD_RUN_FIRE_UP = {
  animationKey: "deckard-run-fire-up-loop",
  frameStart: 0,
  frameEnd: 7,
  frameRate: 12,
  repeat: 0,
} as const;

export const DECKARD_JUMP = {
  animationKey: "deckard-jump-loop",
  frameStart: 0,
  frameEnd: 4,
  repeat: 0,
  jumpMovementStartDelayMs: 50,
  jumpHeight: 135,
  jumpRiseDurationMs: 250,
  jumpFallDurationMs: 250,
  get animationDurationMs() {
    return this.jumpRiseDurationMs + this.jumpFallDurationMs;
  },
} as const;

export const DECKARD_SHOOT_FRONT = {
  animationKey: "deckard-shoot-front-loop",
  frameStart: 0,
  frameEnd: 2,
  frameRate: 14,
  repeat: 0,
} as const;

export const DECKARD_SHOOT_UP = {
  animationKey: "deckard-shoot-up-loop",
  frameStart: 0,
  frameEnd: 1,
  frameRate: 14,
  repeat: 0,
} as const;

export const DECKARD_CROUCH_FIRE = {
  animationKey: "deckard-crouch-fire-loop",
  crouchFrame: 0,
  fireFrameStart: 0,
  fireFrameEnd: 1,
  frameRate: 16,
  repeat: 0,
} as const;

export const GAME_OVER_OWL = {
  animationKey: "game-over-owl-loop",
  frameStart: 0,
  frameEnd: 4,
  frameRate: 7,
  repeat: 0,
  triggerIntervalMs: 6000,
  marginLeft: 20,
  marginBottom: 12,
  scale: 1,
  depth: 4,
} as const;

export const GAME_OVER_RAIN = {
  textureKey: "game-over-rain-drop",
  dropWidth: 2,
  dropHeight: 12,
  dropColor: 0xaad4ff,
  dropAlpha: 0.85,
  yStart: -20,
  lifespanMs: 700,
  speedYMin: 700,
  speedYMax: 1100,
  speedXMin: 0,
  speedXMax: 0,
  quantity: 16,
  alphaStart: 0.65,
  alphaEnd: 0.2,
  depth: 2,
} as const;
