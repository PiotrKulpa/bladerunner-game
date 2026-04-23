export interface SpriteAnimationConfig {
  key: string;
  textureKey: string;
  frameStart: number;
  frameEnd: number;
  frameRate: number;
  repeat: number;
  showOnStart?: boolean;
  hideOnComplete?: boolean;
}
