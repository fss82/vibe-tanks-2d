export interface Animation {
  x: number;
  y: number;
  type: "explosion" | "hit" | "pickup";
  duration: number;
  elapsed: number;
  scale: number;
}

export class AnimationManager {
  private animations: Animation[] = [];

  addExplosion(x: number, y: number): void {
    this.animations.push({
      x,
      y,
      type: "explosion",
      duration: 500, // 500ms
      elapsed: 0,
      scale: 1,
    });
  }

  addHit(x: number, y: number): void {
    this.animations.push({
      x,
      y,
      type: "hit",
      duration: 200,
      elapsed: 0,
      scale: 1,
    });
  }

  addPickup(x: number, y: number): void {
    this.animations.push({
      x,
      y,
      type: "pickup",
      duration: 300,
      elapsed: 0,
      scale: 1,
    });
  }

  update(deltaTime: number): void {
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const animation = this.animations[i];
      animation.elapsed += deltaTime;

      if (animation.elapsed >= animation.duration) {
        this.animations.splice(i, 1);
      } else {
        // Update scale based on animation type
        const progress = animation.elapsed / animation.duration;

        if (animation.type === "explosion") {
          // Scale up then fade
          animation.scale = 1 + progress * 0.5;
        } else if (animation.type === "hit") {
          // Quick pulse
          animation.scale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
        } else if (animation.type === "pickup") {
          // Shrink and fade
          animation.scale = 1 - progress * 0.5;
        }
      }
    }
  }

  getAnimations(): Animation[] {
    return this.animations;
  }

  clear(): void {
    this.animations = [];
  }
}
