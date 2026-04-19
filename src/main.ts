import { APP_IDS } from "./game/config/app-config";
import StartGame from "./game/main";

document.addEventListener("DOMContentLoaded", () => {
  StartGame(APP_IDS.gameContainer);
});
