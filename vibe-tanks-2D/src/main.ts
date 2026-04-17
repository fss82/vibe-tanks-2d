import "./style.css";
import { GameState } from "./state/gameState";
import { initCanvas, getCanvasContext } from "./render/canvas";
import { Renderer } from "./render/renderer";
import { InputHandler } from "./ui/inputHandler";
import { UIManager } from "./ui/uiManager";
import { moveInDirection } from "./logic/movement";
import { shoot, applyDamage, applyTerrainDamage } from "./logic/shooting";
import { Direction } from "./state/tank";
import { AIPlayer } from "./ai/aiPlayer";
import { AnimationManager } from "./render/animations";

let gameState: GameState;
let renderer: Renderer;
let canvas: HTMLCanvasElement;
let inputHandler: InputHandler;
let uiManager: UIManager;
let aiPlayer: AIPlayer;
let animationManager: AnimationManager;
let lastFrameTime = 0;

function init(): void {
  canvas = initCanvas();
  const ctx = getCanvasContext(canvas);
  renderer = new Renderer(ctx);

  gameState = new GameState();
  inputHandler = new InputHandler();
  uiManager = new UIManager();
  aiPlayer = new AIPlayer();
  animationManager = new AnimationManager();

  setupInputHandlers();
  setupUIHandlers();

  render();
}

function setupInputHandlers(): void {
  // Rotation
  inputHandler.on("rotateUp", () => {
    if (gameState.currentTurn === "player") {
      gameState.playerTank.direction = Direction.Up;
    }
  });

  inputHandler.on("rotateDown", () => {
    if (gameState.currentTurn === "player") {
      gameState.playerTank.direction = Direction.Down;
    }
  });

  inputHandler.on("rotateLeft", () => {
    if (gameState.currentTurn === "player") {
      gameState.playerTank.direction = Direction.Left;
    }
  });

  inputHandler.on("rotateRight", () => {
    if (gameState.currentTurn === "player") {
      gameState.playerTank.direction = Direction.Right;
    }
  });

  // Move in current direction
  inputHandler.on("move", () => {
    if (gameState.currentTurn === "player" && gameState.playerAP >= 1) {
      moveInDirection(gameState, gameState.playerTank, gameState.playerTank.direction);
      gameState.playerAP -= 1;
      checkTurnEnd();
    }
  });

  // Shooting
  inputHandler.on("shoot", () => {
    if (gameState.currentTurn === "player" && gameState.playerAP >= 1) {
      const result = shoot(gameState, gameState.playerTank);
      if (result.targetTank) {
        animationManager.addHit(result.targetTank.x, result.targetTank.y);
        applyDamage(gameState, result.targetTank, gameState.playerTank.getDamage());
      } else if (result.terrainX !== undefined && result.terrainY !== undefined) {
        animationManager.addExplosion(result.terrainX, result.terrainY);
        applyTerrainDamage(
          gameState,
          result.terrainX,
          result.terrainY,
          gameState.playerTank.getDamage()
        );
      }
      gameState.playerAP -= 1;
      checkTurnEnd();
    }
  });

  // End turn
  inputHandler.on("endTurn", () => {
    if (gameState.currentTurn === "player") {
      endPlayerTurn();
    }
  });

  // Restart
  inputHandler.on("restart", () => {
    restartGame();
  });
}

function setupUIHandlers(): void {
  uiManager.onRestartClick(() => {
    restartGame();
  });
}

function checkTurnEnd(): void {
  if (gameState.playerAP <= 0) {
    endPlayerTurn();
  }
}

function endPlayerTurn(): void {
  gameState.currentTurn = "ai";
  gameState.aiAP = gameState.aiTank.getAP();
  // AI turn will be handled in game loop
}

function aiTurn(): void {
  if (gameState.currentTurn !== "ai" || gameState.gameOver) {
    return;
  }

  while (gameState.aiAP > 0 && !gameState.gameOver) {
    const bestMove = aiPlayer.decideBestMove(gameState, gameState.aiTank);

    if (bestMove.type === "endTurn") {
      break;
    }

    aiPlayer.executeMove(gameState, gameState.aiTank, bestMove);
    gameState.aiAP -= 1;

    if (!gameState.gameOver && gameState.aiAP <= 0) {
      break;
    }
  }

  gameState.currentTurn = "player";
  gameState.playerAP = gameState.playerTank.getAP();
}

function restartGame(): void {
  gameState.reset();
  animationManager.clear();
  uiManager.hideVictoryModal();
}

function render(): void {
  renderer.render(gameState, animationManager.getAnimations());

  if (gameState.gameOver) {
    animationManager.addExplosion(gameState.aiTank.x, gameState.aiTank.y);
    uiManager.showVictoryModal(gameState.winner || "ai");
  }
}

function gameLoop(currentTime: number): void {
  // Calculate delta time
  const deltaTime = lastFrameTime ? currentTime - lastFrameTime : 0;
  lastFrameTime = currentTime;

  // Update animations
  animationManager.update(deltaTime);

  // AI turn
  if (gameState.currentTurn === "ai" && !gameState.gameOver) {
    aiTurn();
  }

  render();
  requestAnimationFrame(gameLoop);
}

// Initialize and start
document.addEventListener("DOMContentLoaded", () => {
  init();
  lastFrameTime = performance.now();
  requestAnimationFrame(gameLoop);
});
