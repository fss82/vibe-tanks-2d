export class UIManager {
  private victoryModal: HTMLDivElement | null = null;
  private restartButton: HTMLButtonElement | null = null;
  private controlsDiv: HTMLDivElement | null = null;

  constructor() {
    this.createUI();
  }

  private createUI(): void {
    // Create victory modal
    this.victoryModal = document.createElement("div");
    this.victoryModal.id = "victoryModal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const title = document.createElement("h2");
    title.id = "victoryTitle";
    title.textContent = "Victory!";

    this.restartButton = document.createElement("button");
    this.restartButton.textContent = "Restart Game";
    this.restartButton.style.marginTop = "20px";

    modalContent.appendChild(title);
    modalContent.appendChild(this.restartButton);
    this.victoryModal.appendChild(modalContent);
    document.body.appendChild(this.victoryModal);

    // Create controls info
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.id = "controls";
    this.controlsDiv.innerHTML = `
      <p><strong>Controls:</strong></p>
      <p>Arrow Keys/WASD: Move | Q/E: Rotate | Space/Enter: Shoot | Shift: End Turn | R: Restart</p>
    `;
    document.body.appendChild(this.controlsDiv);
  }

  showVictoryModal(winner: "player" | "ai"): void {
    if (!this.victoryModal || !this.victoryModal.querySelector("h2")) return;

    const titleEl = this.victoryModal.querySelector("h2") as HTMLHeadingElement;
    titleEl.textContent = winner === "player" ? "You Win!" : "AI Wins!";
    this.victoryModal.classList.add("active");
  }

  hideVictoryModal(): void {
    if (this.victoryModal) {
      this.victoryModal.classList.remove("active");
    }
  }

  onRestartClick(callback: () => void): void {
    if (this.restartButton) {
      this.restartButton.onclick = callback;
    }
  }

  updateUI(_gameState: any): void {
    // UI updates handled by renderer for now
    // Can extend this for additional UI elements
  }
}
