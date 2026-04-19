import { Scene } from "phaser";
import { FONT_PRELOAD_ORDER, SCENE_KEYS } from "../config/app-config";

export class Boot extends Scene {
  constructor() {
    super(SCENE_KEYS.boot);
  }

  create() {
    const startPreloader = () => this.scene.start(SCENE_KEYS.preloader);

    if ("fonts" in document) {
      Promise.all(
        FONT_PRELOAD_ORDER.map((fontFamily) =>
          document.fonts.load(`1em "${fontFamily}"`),
        ),
      )
        .then(startPreloader)
        .catch(startPreloader);

      return;
    }

    startPreloader();
  }
}
