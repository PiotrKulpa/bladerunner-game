import { GameObjects, Scene } from "phaser";
import { UI_TOKENS } from "../config/app-config";

export interface UIButtonConfig {
  label: string;
  onClick?: () => void;
  textureKey?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
}

export class UIButton extends GameObjects.Container {
  private readonly background: GameObjects.Image;
  private readonly labelText: GameObjects.Text;
  private onClick?: () => void;
  private disabled = false;

  constructor(scene: Scene, x: number, y: number, config: UIButtonConfig) {
    super(scene, x, y);

    scene.add.existing(this);

    this.onClick = config.onClick;

    this.background = scene.add.image(
      0,
      0,
      config.textureKey ?? UI_TOKENS.button.textureKey,
    );
    this.background.setOrigin(0.5);
    this.background.setInteractive({ useHandCursor: true });

    this.labelText = scene.add.text(0, 0, config.label, {
      fontFamily: config.fontFamily ?? UI_TOKENS.button.fontFamily,
      fontSize: `${config.fontSize ?? UI_TOKENS.button.fontSize}px`,
      color: config.textColor ?? UI_TOKENS.button.textColor,
      align: "center",
    });
    this.labelText.setOrigin(0.5);

    this.add([this.background, this.labelText]);
    this.setSize(this.background.width, this.background.height);

    this.background.on("pointerdown", () => {
      if (this.disabled) {
        return;
      }

      this.onClick?.();
    });
  }

  setLabel(label: string) {
    this.labelText.setText(label);

    return this;
  }

  setOnClick(onClick?: () => void) {
    this.onClick = onClick;

    return this;
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled;
    this.background.setAlpha(disabled ? UI_TOKENS.button.disabledAlpha : 1);
    this.labelText.setAlpha(disabled ? UI_TOKENS.button.disabledAlpha : 1);

    if (disabled) {
      this.background.disableInteractive();
    } else {
      this.background.setInteractive({ useHandCursor: true });
    }

    return this;
  }
}
