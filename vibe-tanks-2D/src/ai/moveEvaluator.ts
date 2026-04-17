import type { GameState } from "../state/gameState";
import type { Tank } from "../state/tank";
import { moveInDirection } from "../logic/movement";
import { shoot, applyDamage, applyTerrainDamage } from "../logic/shooting";

export interface MoveAction {
  type: "move" | "shoot" | "endTurn";
  direction?: number;
  score: number;
}

export class MoveEvaluator {
  evaluateMove(gameState: GameState, tank: Tank, action: MoveAction): number {
    // Create a copy of the game state to simulate the action
    const simulatedState = this.simulateAction(gameState, tank, action);

    let score = 0;

    // Check for win condition
    if (simulatedState.gameOver) {
      if (simulatedState.winner === (tank.isPlayer ? "player" : "ai")) {
        return Infinity;
      } else {
        return -Infinity;
      }
    }

    // Check if tank died
    if (tank.hp <= 0) {
      return -Infinity;
    }

    // Check if can kill enemy
    const enemy = tank.isPlayer ? simulatedState.aiTank : simulatedState.playerTank;
    if (enemy.hp <= 0) {
      score += 1000;
    }

    // Check if in line of fire with enemy
    if (this.canShootEnemy(simulatedState, tank)) {
      score += 50;
    }

    // Safe attack (enemy can't shoot back)
    if (this.canShootEnemy(simulatedState, tank) && !this.canShootBack(simulatedState, enemy, tank)) {
      score += 100;
    }

    // Bonus pickup value
    for (const bonus of simulatedState.bonuses) {
      if (bonus.x === tank.x && bonus.y === tank.y) {
        score += Math.random() * 5 + 6; // 6-10
      }
    }

    // Reduce cover (destroy destructible terrain)
    if (action.type === "shoot") {
      score += 10;
    }

    return score;
  }

  private simulateAction(
    gameState: GameState,
    tank: Tank,
    action: MoveAction
  ): GameState {
    // Clone the state for simulation
    const simState = JSON.parse(JSON.stringify(gameState));
    const simTank =
      tank.isPlayer ? simState.playerTank : simState.aiTank;

    if (action.type === "move" && action.direction !== undefined) {
      moveInDirection(simState, simTank, action.direction as 0 | 1 | 2 | 3);
    } else if (action.type === "shoot") {
      const result = shoot(simState, simTank);
      if (result.targetTank) {
        const targetTank = result.targetTank.isPlayer
          ? simState.playerTank
          : simState.aiTank;
        applyDamage(simState, targetTank, simTank.getDamage());
      } else if (result.terrainX !== undefined && result.terrainY !== undefined) {
        applyTerrainDamage(
          simState,
          result.terrainX,
          result.terrainY,
          simTank.getDamage()
        );
      }
    }

    return simState;
  }

  private canShootEnemy(gameState: GameState, tank: Tank): boolean {
    const enemy = tank.isPlayer ? gameState.aiTank : gameState.playerTank;

    // Check if enemy is in line with current direction
    const [dx, dy] = this.getDirectionVector(tank.direction);
    let x = tank.x + dx;
    let y = tank.y + dy;

    while (x >= 0 && x < 9 && y >= 0 && y < 9) {
      if (x === enemy.x && y === enemy.y) {
        return true;
      }
      const terrain = gameState.getTileAt(x, y);
      if (terrain && terrain.type !== "empty") {
        break;
      }
      x += dx;
      y += dy;
    }

    return false;
  }

  private canShootBack(
    gameState: GameState,
    shooter: Tank,
    target: Tank
  ): boolean {
    // Similar to canShootEnemy but from shooter's perspective
    const [dx, dy] = this.getDirectionVector(shooter.direction);
    let x = shooter.x + dx;
    let y = shooter.y + dy;

    while (x >= 0 && x < 9 && y >= 0 && y < 9) {
      if (x === target.x && y === target.y) {
        return true;
      }
      const terrain = gameState.getTileAt(x, y);
      if (terrain && terrain.type !== "empty") {
        break;
      }
      x += dx;
      y += dy;
    }

    return false;
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
