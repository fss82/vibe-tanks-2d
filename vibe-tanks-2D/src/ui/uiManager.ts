export class UIManager {
  private victoryModal: HTMLDivElement | null = null;
  private restartButton: HTMLButtonElement | null = null;
  private controlsDiv: HTMLDivElement | null = null;
  private statsPanel: HTMLDivElement | null = null;
  private playerStatsDiv: HTMLDivElement | null = null;
  private aiStatsDiv: HTMLDivElement | null = null;

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

    // Create stats panel
    this.statsPanel = document.createElement("div");
    this.statsPanel.id = "statsPanel";

    this.playerStatsDiv = document.createElement("div");
    this.playerStatsDiv.className = "stats-section player-stats";

    const playerTitle = document.createElement("h3");
    playerTitle.textContent = "Player Tank";
    this.playerStatsDiv.appendChild(playerTitle);

    this.playerStatsDiv.innerHTML += `
      <div class="stat-item">
        <span class="stat-label">AP:</span>
        <span class="stat-value" id="playerAP">0/3</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">HP:</span>
        <span class="stat-value" id="playerHP">1</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Damage:</span>
        <span class="stat-value" id="playerDamage">1</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Armor:</span>
        <span class="stat-value" id="playerArmor">0</span>
      </div>
    `;

    this.aiStatsDiv = document.createElement("div");
    this.aiStatsDiv.className = "stats-section ai-stats";

    const aiTitle = document.createElement("h3");
    aiTitle.textContent = "AI Tank";
    this.aiStatsDiv.appendChild(aiTitle);

    this.aiStatsDiv.innerHTML += `
      <div class="stat-item">
        <span class="stat-label">AP:</span>
        <span class="stat-value" id="aiAP">0/3</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">HP:</span>
        <span class="stat-value" id="aiHP">1</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Damage:</span>
        <span class="stat-value" id="aiDamage">1</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Armor:</span>
        <span class="stat-value" id="aiArmor">0</span>
      </div>
    `;

    this.statsPanel.appendChild(this.playerStatsDiv);
    this.statsPanel.appendChild(this.aiStatsDiv);
    document.body.appendChild(this.statsPanel);

    // Create controls info
    this.controlsDiv = document.createElement("div");
    this.controlsDiv.id = "controls";
    this.controlsDiv.innerHTML = `
      <p><strong>Controls:</strong></p>
      <p>Arrow Keys: Set Direction | Space: Move | Ctrl: Shoot | Shift: End Turn | R: Restart</p>
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

  updateStats(gameState: any): void {
    // Update player stats
    const playerAPEl = document.getElementById("playerAP");
    const playerHPEl = document.getElementById("playerHP");
    const playerDamageEl = document.getElementById("playerDamage");
    const playerArmorEl = document.getElementById("playerArmor");

    if (playerAPEl)
      playerAPEl.textContent = `${gameState.playerAP}/${gameState.playerTank.getAP()}`;
    if (playerHPEl) playerHPEl.textContent = gameState.playerTank.hp.toString();
    if (playerDamageEl)
      playerDamageEl.textContent = gameState.playerTank.getDamage().toString();
    if (playerArmorEl)
      playerArmorEl.textContent = gameState.playerTank.armorCharges.toString();

    // Update AI stats
    const aiAPEl = document.getElementById("aiAP");
    const aiHPEl = document.getElementById("aiHP");
    const aiDamageEl = document.getElementById("aiDamage");
    const aiArmorEl = document.getElementById("aiArmor");

    if (aiAPEl) aiAPEl.textContent = `${gameState.aiAP}/${gameState.aiTank.getAP()}`;
    if (aiHPEl) aiHPEl.textContent = gameState.aiTank.hp.toString();
    if (aiDamageEl) aiDamageEl.textContent = gameState.aiTank.getDamage().toString();
    if (aiArmorEl) aiArmorEl.textContent = gameState.aiTank.armorCharges.toString();
  }
}
