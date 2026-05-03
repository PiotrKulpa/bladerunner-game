import { Boot } from "./scenes/Boot";
import { APP_IDS, GAME_VIEWPORT } from "./config/app-config";
import { GameOver } from "./scenes/GameOver";
import { NeonCityScene as MainGame } from "./scenes/NeonCityScene";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game, Scale } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: GAME_VIEWPORT.width,
  height: GAME_VIEWPORT.height,
  parent: APP_IDS.gameContainer,
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  backgroundColor: GAME_VIEWPORT.backgroundColor,
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
