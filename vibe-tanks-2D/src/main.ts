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
import { ProjectileManager } from "./render/projectiles";

let gameState: GameState;
let renderer: Renderer;
let canvas: HTMLCanvasElement;
let inputHandler: InputHandler;
let uiManager: UIManager;
let aiPlayer: AIPlayer;
let animationManager: AnimationManager;
let projectileManager: ProjectileManager;
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
  projectileManager = new ProjectileManager();

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
      playerShoot();
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

function playerShoot(): void {
  const result = shoot(gameState, gameState.playerTank);
  if (result.targetTank || (result.terrainX !== undefined && result.terrainY !== undefined)) {
    // Create projectile
    projectileManager.addProjectile(
      gameState.playerTank.x,
      gameState.playerTank.y,
      result.terrainX !== undefined ? result.terrainX : result.targetTank!.x,
      result.terrainY !== undefined ? result.terrainY : result.targetTank!.y,
      gameState.playerTank.direction
    );
  }
}

function aiShoot(tank: any): void {
  const result = shoot(gameState, tank);
  if (result.targetTank || (result.terrainX !== undefined && result.terrainY !== undefined)) {
    // Create projectile
    projectileManager.addProjectile(
      tank.x,
      tank.y,
      result.terrainX !== undefined ? result.terrainX : result.targetTank!.x,
      result.terrainY !== undefined ? result.terrainY : result.targetTank!.y,
      tank.direction
    );
  }
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

    if (bestMove.type === "shoot") {
      aiShoot(gameState.aiTank);
    } else {
      aiPlayer.executeMove(gameState, gameState.aiTank, bestMove);
    }

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
  projectileManager.clear();
  uiManager.hideVictoryModal();
}

function render(): void {
  renderer.render(gameState, animationManager.getAnimations(), projectileManager.getProjectiles());

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

  // Update projectiles and handle completed ones
  const completedProjectiles = projectileManager.update(deltaTime);
  for (const projectile of completedProjectiles) {
    // Apply damage for completed projectiles
    const hitTank =
      gameState.playerTank.x === projectile.endX && gameState.playerTank.y === projectile.endY
        ? gameState.playerTank
        : gameState.aiTank.x === projectile.endX && gameState.aiTank.y === projectile.endY
          ? gameState.aiTank
          : null;

    if (hitTank) {
      animationManager.addHit(hitTank.x, hitTank.y);
      const shooter = gameState.currentTurn === "ai" ? gameState.aiTank : gameState.playerTank;
      applyDamage(gameState, hitTank, shooter.getDamage());
    } else {
      // Hit terrain
      animationManager.addExplosion(projectile.endX, projectile.endY);
      const shooter = gameState.currentTurn === "ai" ? gameState.aiTank : gameState.playerTank;
      applyTerrainDamage(gameState, projectile.endX, projectile.endY, shooter.getDamage());
    }
  }

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
