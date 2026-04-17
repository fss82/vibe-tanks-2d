export type KeyAction =
  | "rotateUp"
  | "rotateDown"
  | "rotateLeft"
  | "rotateRight"
  | "move"
  | "shoot"
  | "endTurn"
  | "restart";

export class InputHandler {
  private keysPressed: Set<string> = new Set();
  private callbacks: Map<KeyAction, () => void> = new Map();

  constructor() {
    this.setupKeyListeners();
  }

  private setupKeyListeners(): void {
    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      this.keysPressed.add(key);
      this.handleKeyPress(key, e);
    });

    document.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key.toLowerCase());
    });
  }

  private handleKeyPress(key: string, e: KeyboardEvent): void {
    switch (key) {
      case "arrowup":
        e.preventDefault();
        this.triggerAction("rotateUp");
        break;
      case "arrowdown":
        e.preventDefault();
        this.triggerAction("rotateDown");
        break;
      case "arrowleft":
        e.preventDefault();
        this.triggerAction("rotateLeft");
        break;
      case "arrowright":
        e.preventDefault();
        this.triggerAction("rotateRight");
        break;
      case " ":
        e.preventDefault();
        this.triggerAction("move");
        break;
      case "control":
        e.preventDefault();
        this.triggerAction("shoot");
        break;
      case "r":
        this.triggerAction("restart");
        break;
      case "shift":
        e.preventDefault();
        this.triggerAction("endTurn");
        break;
    }
  }

  on(action: KeyAction, callback: () => void): void {
    this.callbacks.set(action, callback);
  }

  off(action: KeyAction): void {
    this.callbacks.delete(action);
  }

  private triggerAction(action: KeyAction): void {
    const callback = this.callbacks.get(action);
    if (callback) {
      callback();
    }
  }

  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key.toLowerCase());
  }
}
