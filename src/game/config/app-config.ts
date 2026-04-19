export const APP_IDS = {
  gameContainer: "game-container",
} as const;

export const SCENE_KEYS = {
  boot: "Boot",
  preloader: "Preloader",
  mainMenu: "MainMenu",
  game: "Game",
  gameOver: "GameOver",
} as const;

export const GAME_VIEWPORT = {
  width: 1280,
  height: 720,
  backgroundColor: "#028af8",
} as const;

export const FONT_FAMILIES = {
  ui: "VT323",
  header: "BladeRunner",
  fallback: "Arial Black",
} as const;

export const FONT_PRELOAD_ORDER = [FONT_FAMILIES.ui, FONT_FAMILIES.header] as const;

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
    title: "Game Over",
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
