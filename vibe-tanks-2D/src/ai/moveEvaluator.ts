import type { GameState } from "../state/gameState";
import type { Tank } from "../state/tank";
import { shoot } from "../logic/shooting";

export interface MoveAction {
  type: "move" | "shoot" | "endTurn";
  direction?: number;
  score: number;
}

export class MoveEvaluator {
  evaluateMove(gameState: GameState, tank: Tank, action: MoveAction): number {
    let score = 0;

    if (action.type === "endTurn") {
      return 0; // Neutral score for ending turn
    }

    if (action.type === "move" && action.direction !== undefined) {
      // Moving toward center is good
      const centerX = 4;
      const centerY = 4;
      const newX = tank.x + this.getDirectionVector(action.direction)[0];
      const newY = tank.y + this.getDirectionVector(action.direction)[1];

      const oldDist = Math.abs(tank.x - centerX) + Math.abs(tank.y - centerY);
      const newDist = Math.abs(newX - centerX) + Math.abs(newY - centerY);

      if (newDist < oldDist) {
        score += 5;
      }

      // Moving away from enemy is good
      const enemy = tank.isPlayer ? gameState.aiTank : gameState.playerTank;
      const oldEnemyDist = Math.abs(tank.x - enemy.x) + Math.abs(tank.y - enemy.y);
      const newEnemyDist = Math.abs(newX - enemy.x) + Math.abs(newY - enemy.y);

      if (newEnemyDist > oldEnemyDist) {
        score += 3;
      }

      return score;
    }

    if (action.type === "shoot") {
      const result = shoot(gameState, tank);

      // Shooting enemy tank is good
      if (result.targetTank) {
        if (result.targetTank === (tank.isPlayer ? gameState.aiTank : gameState.playerTank)) {
          score += 100; // High priority to shoot enemy
          if (result.targetTank.hp <= tank.getDamage()) {
            score += 1000; // Kill shot!
          }
        }
      } else if (result.terrainX !== undefined && result.terrainY !== undefined) {
        // Destroying cover is okay
        const terrain = gameState.getTileAt(result.terrainX, result.terrainY);
        if (terrain && terrain.hp) {
          score += 10;
        }
      }

      return score;
    }

    return score;
  }

  private getDirectionVector(direction: number): [number, number] {
    const directions = [
      [0, -1], // Up
      [1, 0], // Right
      [0, 1], // Down
      [-1, 0], // Left
    ];
    return directions[direction] as [number, number];
  }
}
