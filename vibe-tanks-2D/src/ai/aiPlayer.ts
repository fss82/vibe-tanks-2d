import type { GameState } from "../state/gameState";
import type { Tank } from "../state/tank";
import { moveInDirection } from "../logic/movement";
import { shoot, applyDamage, applyTerrainDamage } from "../logic/shooting";
import { MoveEvaluator, type MoveAction } from "./moveEvaluator";

export class AIPlayer {
  private evaluator: MoveEvaluator;

  constructor() {
    this.evaluator = new MoveEvaluator();
  }

  decideBestMove(gameState: GameState, tank: Tank): MoveAction {
    const possibleMoves: MoveAction[] = [];

    // Generate all possible moves
    // Move in 4 directions
    for (let dir = 0; dir < 4; dir++) {
      possibleMoves.push({
        type: "move",
        direction: dir,
        score: 0,
      });
    }

    // Shoot
    possibleMoves.push({
      type: "shoot",
      score: 0,
    });

    // End turn
    possibleMoves.push({
      type: "endTurn",
      score: 0,
    });

    // Evaluate each move
    for (const move of possibleMoves) {
      move.score = this.evaluator.evaluateMove(gameState, tank, move);
    }

    // Return best move (highest score)
    let bestMove = possibleMoves[0];
    for (const move of possibleMoves) {
      if (move.score > bestMove.score) {
        bestMove = move;
      }
    }

    return bestMove;
  }

  executeMove(gameState: GameState, tank: Tank, move: MoveAction): void {
    if (move.type === "move" && move.direction !== undefined) {
      moveInDirection(gameState, tank, move.direction as 0 | 1 | 2 | 3);
    } else if (move.type === "shoot") {
      const result = shoot(gameState, tank);
      if (result.targetTank) {
        applyDamage(gameState, result.targetTank, tank.getDamage());
      } else if (result.terrainX !== undefined && result.terrainY !== undefined) {
        applyTerrainDamage(gameState, result.terrainX, result.terrainY, tank.getDamage());
      }
    }
  }
}
