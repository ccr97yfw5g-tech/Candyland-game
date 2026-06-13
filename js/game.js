class CandylandGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.board = new Board(this.canvas);
        this.soundManager = new SoundManager();
        this.powerUp = new PowerUp();
        
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameStarted = false;
        this.difficulty = 'medium';
        this.turn = 0;
        this.maxTurns = 200;
        
        this.initializeUI();
        this.attachEventListeners();
    }

    initializeUI() {
        this.startBtn = document.getElementById('startBtn');
        this.rollDiceBtn = document.getElementById('rollDiceBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.gameControls = document.getElementById('gameControls');
        this.currentPlayerDisplay = document.getElementById('current-player');
        this.gameMessageDisplay = document.getElementById('game-message');
        this.playersList = document.getElementById('playersList');
        this.difficultyDisplay = document.getElementById('difficultyDisplay');
        this.turnDisplay = document.getElementById('turnDisplay');
        this.statusDisplay = document.getElementById('statusDisplay');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.rollDiceBtn.addEventListener('click', () => this.rollDice());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
    }

    startGame() {
        this.difficulty = this.difficultySelect.value;
        this.gameStarted = true;
        this.turn = 0;
        this.currentPlayerIndex = 0;
        
        // Create players
        const playerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
        const playerNames = ['🟥 Red', '🟦 Blue', '🟩 Green', '🟧 Orange'];
        
        this.players = [];
        for (let i = 0; i < 4; i++) {
            this.players.push(new Player(playerNames[i], playerColors[i], i));
        }
        
        this.startBtn.style.display = 'none';
        this.gameControls.style.display = 'flex';
        this.difficultyDisplay.textContent = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        
        this.soundManager.playSound('move');
        this.updateUI();
        this.draw();
    }

    rollDice() {
        if (!this.gameStarted) return;

        const currentPlayer = this.players[this.currentPlayerIndex];
        let diceRoll = Math.floor(Math.random() * 6) + 1;

        // Apply difficulty modifier
        if (this.difficulty === 'hard') {
            diceRoll = Math.floor(Math.random() * 4) + 1; // 1-4 for hard
        } else if (this.difficulty === 'easy') {
            diceRoll = Math.floor(Math.random() * 8) + 1; // 1-8 for easy
        }

        this.soundManager.playSound('dice');
        currentPlayer.move(diceRoll);
        this.turn++;

        // Check for tile effects
        const tile = this.board.getTile(currentPlayer.position);
        if (tile) {
            const effect = this.powerUp.checkTileEffect(tile);
            if (effect === 'trap') {
                this.soundManager.playSound('trap');
                currentPlayer.move(-2);
                this.gameMessageDisplay.textContent = `⚠️ ${currentPlayer.name} hit a trap! Moved back 2 spaces.`;
            } else if (effect === 'bonus') {
                this.soundManager.playSound('bonus');
                currentPlayer.move(3);
                this.gameMessageDisplay.textContent = `⭐ ${currentPlayer.name} found a bonus! Moved forward 3 spaces.`;
            }
        }

        // Check for win condition
        if (currentPlayer.position >= 100) {
            this.soundManager.playSound('win');
            this.gameMessageDisplay.textContent = `🏆 ${currentPlayer.name} reached Candy Castle and WON! 🎉`;
            this.endGame();
            return;
        }

        // Move to next player
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.gameMessageDisplay.textContent = `🎲 Rolled ${diceRoll}! Next player's turn.`;

        // Check turn limit
        if (this.turn >= this.maxTurns) {
            this.gameMessageDisplay.textContent = '❌ Max turns reached. Game Over!';
            this.endGame();
            return;
        }

        this.updateUI();
        this.draw();
    }

    toggleMute() {
        const isMuted = this.soundManager.toggle();
        this.muteBtn.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
    }

    resetGame() {
        this.gameStarted = false;
        this.turn = 0;
        this.currentPlayerIndex = 0;
        this.players = [];
        
        this.startBtn.style.display = 'block';
        this.gameControls.style.display = 'none';
        this.gameMessageDisplay.textContent = 'Game Status: Select difficulty and click Start Game!';
        this.currentPlayerDisplay.innerHTML = 'Current Player: <span>Waiting to start...</span>';
        this.playersList.innerHTML = '';
        
        this.muteBtn.textContent = '🔊 Mute';
        this.soundManager.muted = false;
        
        this.board.initializeTiles();
        this.draw();
    }

    endGame() {
        this.gameStarted = false;
        this.rollDiceBtn.disabled = true;
    }

    updateUI() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        this.currentPlayerDisplay.innerHTML = `Current Player: <span>${currentPlayer.name}</span>`;
        this.turnDisplay.textContent = this.turn;
        this.statusDisplay.textContent = this.gameStarted ? 'In Progress' : 'Completed';

        this.playersList.innerHTML = '';
        this.players.forEach(player => {
            const status = player.getStatus();
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-item';
            playerDiv.innerHTML = `
                <span class="player-name">${status.name}</span>
                <span class="player-position">Position: ${status.position}/100</span>
            `;
            this.playersList.appendChild(playerDiv);
        });
    }

    draw() {
        this.board.draw();
        this.board.drawPlayers(this.players);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new CandylandGame();
    window.game.draw();
});
