export interface Projectile {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  direction: number; // 0-3 (Up, Right, Down, Left)
  progress: number; // 0 to 1
  speed: number; // pixels per ms
}

export class ProjectileManager {
  private projectiles: Projectile[] = [];

  addProjectile(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    direction: number,
    speed: number = 0.5
  ): void {
    this.projectiles.push({
      startX,
      startY,
      endX,
      endY,
      direction,
      progress: 0,
      speed,
    });
  }

  update(deltaTime: number): Projectile[] {
    const completed: Projectile[] = [];

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      // Update progress based on distance and speed
      const distance = Math.sqrt(
        Math.pow(projectile.endX - projectile.startX, 2) +
        Math.pow(projectile.endY - projectile.startY, 2)
      );

      // Slower speed: 0.2 cells per millisecond = 8 pixels per millisecond at 40px/cell
      const cellsPerMs = 0.2;
      projectile.progress += (cellsPerMs * deltaTime) / distance;

      if (projectile.progress >= 1) {
        projectile.progress = 1;
        completed.push(projectile);
        this.projectiles.splice(i, 1);
      }
    }

    return completed;
  }

  getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  clear(): void {
    this.projectiles = [];
  }
}
