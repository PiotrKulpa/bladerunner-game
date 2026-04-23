import { Scene } from "phaser";
import type { AnchoredAnimatedSprite } from "./AnchoredAnimatedSprite";

export interface BurstStepConfig {
  actor: AnchoredAnimatedSprite;
  delayMs: number;
  timeScale: number;
}

export class LoopedBurstAnimation {
  private readonly sortedSteps: BurstStepConfig[];

  constructor(
    private readonly scene: Scene,
    private readonly animationKey: string,
    private readonly loopDelayMs: number,
    steps: BurstStepConfig[],
  ) {
    this.sortedSteps = [...steps].sort((a, b) => a.delayMs - b.delayMs);
  }

  start() {
    this.scene.time.addEvent({
      delay: this.loopDelayMs,
      loop: true,
      callback: () => {
        for (const step of this.sortedSteps) {
          if (step.delayMs === 0) {
            step.actor.play(this.animationKey, true, step.timeScale);
            continue;
          }

          this.scene.time.delayedCall(step.delayMs, () => {
            step.actor.play(this.animationKey, true, step.timeScale);
          });
        }
      },
    });
  }
}
