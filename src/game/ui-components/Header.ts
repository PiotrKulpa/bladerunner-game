import { GameObjects, Scene } from "phaser";

type HeaderAlign = "left" | "center" | "right";
type TextureFrame = string | number;

export interface UIHeaderConfig {
  title: string;
  subtitle?: string;
  width?: number;
  minHeight?: number;
  paddingX?: number;
  paddingY?: number;
  gap?: number;
  align?: HeaderAlign;
  backgroundColor?: number;
  backgroundAlpha?: number;
  backgroundTextureKey?: string;
  backgroundTextureFrame?: TextureFrame;
  titleStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  subtitleStyle?: Phaser.Types.GameObjects.Text.TextStyle;
}

export class UIHeader extends GameObjects.Container {
  private readonly backgroundRect: GameObjects.Rectangle;
  private backgroundImage?: GameObjects.Image;
  private readonly titleText: GameObjects.Text;
  private readonly subtitleText: GameObjects.Text;

  private layoutWidth: number;
  private minHeight: number;
  private paddingX: number;
  private paddingY: number;
  private gap: number;
  private align: HeaderAlign;
  private backgroundColor: number;
  private backgroundAlpha: number;

  constructor(scene: Scene, x: number, y: number, config: UIHeaderConfig) {
    super(scene, x, y);

    scene.add.existing(this);

    this.layoutWidth = config.width ?? 900;
    this.minHeight = config.minHeight ?? 0;
    this.paddingX = config.paddingX ?? 28;
    this.paddingY = config.paddingY ?? 20;
    this.gap = config.gap ?? 10;
    this.align = config.align ?? "center";
    this.backgroundColor = config.backgroundColor ?? 0x000000;
    this.backgroundAlpha = config.backgroundAlpha ?? 0;

    this.backgroundRect = scene.add
      .rectangle(0, 0, this.layoutWidth, 1, this.backgroundColor, this.backgroundAlpha)
      .setOrigin(0.5);
    this.add(this.backgroundRect);

    if (config.backgroundTextureKey) {
      this.backgroundImage = scene.add
        .image(0, 0, config.backgroundTextureKey, config.backgroundTextureFrame)
        .setOrigin(0.5);
      this.add(this.backgroundImage);
    }

    this.titleText = scene.add.text(0, 0, config.title, {
      fontFamily: "BladeRunner",
      fontSize: "120px",
      color: "#fda93a",
      align: this.align,
      ...config.titleStyle,
    });
    this.add(this.titleText);

    this.subtitleText = scene.add.text(0, 0, config.subtitle ?? "", {
      fontFamily: "VT323",
      fontSize: "40px",
      color: "#fda93a",
      align: this.align,
      ...config.subtitleStyle,
    });
    this.subtitleText.setVisible(Boolean(config.subtitle));
    this.add(this.subtitleText);

    this.layout();
  }

  private getOriginX() {
    if (this.align === "left") {
      return 0;
    }

    if (this.align === "right") {
      return 1;
    }

    return 0.5;
  }

  private getTextX() {
    if (this.align === "left") {
      return -this.layoutWidth * 0.5 + this.paddingX;
    }

    if (this.align === "right") {
      return this.layoutWidth * 0.5 - this.paddingX;
    }

    return 0;
  }

  private layout() {
    const innerWidth = Math.max(1, this.layoutWidth - this.paddingX * 2);
    const originX = this.getOriginX();
    const textX = this.getTextX();

    this.titleText.setStyle({
      align: this.align,
      wordWrap: { width: innerWidth, useAdvancedWrap: true },
    });
    this.subtitleText.setStyle({
      align: this.align,
      wordWrap: { width: innerWidth, useAdvancedWrap: true },
    });

    this.titleText.setOrigin(originX, 0);
    this.subtitleText.setOrigin(originX, 0);
    this.titleText.setX(textX);
    this.subtitleText.setX(textX);

    const subtitleVisible = this.subtitleText.visible && this.subtitleText.text.length > 0;
    const titleHeight = this.titleText.height;
    const subtitleHeight = subtitleVisible ? this.subtitleText.height : 0;
    const stackHeight = titleHeight + (subtitleVisible ? this.gap + subtitleHeight : 0);
    const totalHeight = Math.max(this.minHeight, stackHeight + this.paddingY * 2);
    const titleY = -totalHeight * 0.5 + this.paddingY;

    this.titleText.setY(titleY);
    this.subtitleText.setY(titleY + titleHeight + this.gap);

    this.backgroundRect.setSize(this.layoutWidth, totalHeight);
    this.backgroundRect.setFillStyle(this.backgroundColor, this.backgroundAlpha);

    if (this.backgroundImage) {
      this.backgroundImage.setPosition(0, 0);
      this.backgroundImage.setDisplaySize(this.layoutWidth, totalHeight);
    }

    this.setSize(this.layoutWidth, totalHeight);
  }

  setTitle(title: string) {
    this.titleText.setText(title);
    this.layout();

    return this;
  }

  setSubtitle(subtitle?: string) {
    const subtitleText = subtitle ?? "";
    this.subtitleText.setText(subtitleText);
    this.subtitleText.setVisible(Boolean(subtitleText));
    this.layout();

    return this;
  }

  setAlign(align: HeaderAlign) {
    this.align = align;
    this.layout();

    return this;
  }

  setWidth(width: number) {
    this.layoutWidth = Math.max(1, width);
    this.layout();

    return this;
  }

  setMinHeight(minHeight: number) {
    this.minHeight = Math.max(0, minHeight);
    this.layout();

    return this;
  }

  setPadding(paddingX: number, paddingY = paddingX) {
    this.paddingX = Math.max(0, paddingX);
    this.paddingY = Math.max(0, paddingY);
    this.layout();

    return this;
  }

  setGap(gap: number) {
    this.gap = Math.max(0, gap);
    this.layout();

    return this;
  }

  setTitleStyle(style: Phaser.Types.GameObjects.Text.TextStyle) {
    this.titleText.setStyle(style);
    this.layout();

    return this;
  }

  setSubtitleStyle(style: Phaser.Types.GameObjects.Text.TextStyle) {
    this.subtitleText.setStyle(style);
    this.layout();

    return this;
  }

  setBackground(color: number, alpha = 1) {
    this.backgroundColor = color;
    this.backgroundAlpha = alpha;
    this.layout();

    return this;
  }

  clearBackground() {
    this.backgroundAlpha = 0;
    this.layout();

    return this;
  }

  setBackgroundTexture(textureKey?: string, frame?: TextureFrame) {
    if (!textureKey) {
      this.backgroundImage?.destroy();
      this.backgroundImage = undefined;
      this.layout();

      return this;
    }

    if (this.backgroundImage) {
      this.backgroundImage.setTexture(textureKey, frame);
    } else {
      this.backgroundImage = this.scene.add.image(0, 0, textureKey, frame).setOrigin(0.5);
      this.addAt(this.backgroundImage, 1);
    }

    this.layout();

    return this;
  }

  getTitleText() {
    return this.titleText;
  }

  getSubtitleText() {
    return this.subtitleText;
  }

  getBackgroundRect() {
    return this.backgroundRect;
  }
}
