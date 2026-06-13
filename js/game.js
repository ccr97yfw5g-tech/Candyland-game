// Updated Game class with enhanced features
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.board = new Board();
        this.soundManager = new SoundManager();
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        this.winner = null;
        this.diceResult = 0;
        this.canRoll = true;
        this.difficulty = DifficultyLevels.MEDIUM;
        this.frozenPlayers = {};
        this.activePowerUps = {};
        this.gameStarted = false;
        this.turnCount = 0;

        this.setupDifficultySelect();
        this.setupEventListeners();
        this.draw();
    }

    setupDifficultySelect() {
        const difficultySelect = document.getElementById('difficultySelect');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                const level = e.target.value;
                if (level === 'easy') this.difficulty = DifficultyLevels.EASY;
                else if (level === 'medium') this.difficulty = DifficultyLevels.MEDIUM;
                else if (level === 'hard') this.difficulty = DifficultyLevels.HARD;
                this.updateDifficultyDisplay();
            });
        }
    }

    initPlayers() {
        const playerColors = ['#667eea', '#f5576c', '#00f2fe', '#fee140'];
        const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
        
        this.players = [];
        for (let i = 0; i < 4; i++) {
            this.players.push(new Player(i + 1, playerNames[i], playerColors[i]));
            this.activePowerUps[i] = [];
            this.frozenPlayers[i] = false;
        }
        this.updatePlayersList();
    }

    setupEventListeners() {
        const rollBtn = document.getElementById('rollDiceBtn');
        const resetBtn = document.getElementById('resetBtn');
        const startBtn = document.getElementById('startBtn');
        const muteBtn = document.getElementById('muteBtn');

        rollBtn.addEventListener('click', () => this.rollDice());
        resetBtn.addEventListener('click', () => this.resetGame());
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
        
        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }
    }

    startGame() {
        this.gameStarted = true;
        this.turnCount = 0;
        this.initPlayers();
        this.updateGameStatus();
        this.updateDifficultyDisplay();
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('gameControls').style.display = 'flex';
        document.getElementById('difficultySelect').disabled = true;
        this.soundManager.play('moveSuccess');
        this.draw();
    }

    rollDice() {
        if (!this.canRoll || this.gameOver || !this.gameStarted) return;

        // Check if current player is frozen
        if (this.frozenPlayers[this.currentPlayerIndex]) {
            this.frozenPlayers[this.currentPlayerIndex] = false;
            document.getElementById('game-message').textContent = 
                `${this.players[this.currentPlayerIndex].name} was frozen! Skipped turn.`;
            this.soundManager.play('trapHit');
            this.nextTurn();
            return;
        }

        this.canRoll = false;
        this.diceResult = Math.floor(Math.random() * 6) + 1;
        this.soundManager.play('diceRoll');

        // Animate dice rolling
        this.animateDiceRoll(() => {
            const currentPlayer = this.players[this.currentPlayerIndex];
            
            // Apply move multiplier from power-ups
            let moveDistance = this.diceResult;
            if (currentPlayer.moveMultiplier && currentPlayer.moveMultiplier > 1) {
                moveDistance *= currentPlayer.moveMultiplier;
                currentPlayer.moveMultiplier = 1;
            }

            currentPlayer.move(moveDistance);
            this.soundManager.play('moveSuccess');

            // Check for power-ups on tile
            this.checkForPowerUps(currentPlayer);

            // Check for traps
            this.checkForTraps(currentPlayer);

            // Decrement power-up timers
            this.updatePowerUpTimers();

            // Check for win condition
            if (currentPlayer.position >= this.board.tiles.length - 1) {
                this.endGame(currentPlayer);
            } else {
                this.nextTurn();
            }
        });
    }

    checkForPowerUps(player) {
        const random = Math.random();
        
        if (random < this.difficulty.powerUpFrequency) {
            const powerUpTypes = Object.values(PowerUps);
            const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            
            this.activePowerUps[player.id - 1].push(randomPowerUp);
            document.getElementById('game-message').textContent = 
                `${player.name} found a power-up: ${randomPowerUp.name}!`;
            this.soundManager.play('powerUpCollect');
        }
    }

    checkForTraps(player) {
        const random = Math.random();
        
        if (random < this.difficulty.trapFrequency) {
            if (player.hasShield) {
                document.getElementById('game-message').textContent = 
                    `${player.name}'s shield protected them from a trap!`;
                player.hasShield = false;
            } else {
                // Random trap effect
                const trapChance = Math.random();
                if (trapChance < 0.5) {
                    player.position = Math.max(0, player.position - 3);
                    document.getElementById('game-message').textContent = 
                        `${player.name} hit a trap! Moved back 3 spaces.`;
                } else {
                    this.frozenPlayers[player.id - 1] = true;
                    document.getElementById('game-message').textContent = 
                        `${player.name} is frozen! Will skip next turn.`;
                }
                this.soundManager.play('trapHit');
            }
        }
    }

    updatePowerUpTimers() {
        this.players.forEach((player, index) => {
            if (player.activePowerUpTimer && player.activePowerUpTimer > 0) {
                player.activePowerUpTimer--;
                if (player.activePowerUpTimer === 0) {
                    player.moveMultiplier = 1;
                    player.candyMultiplier = 1;
                }
            }
        });
    }

    animateDiceRoll(callback) {
        const diceBtn = document.getElementById('rollDiceBtn');
        const rolls = 15;
        let rollCount = 0;

        const rollInterval = setInterval(() => {
            rollCount++;
            const dice = Math.floor(Math.random() * 6) + 1;
            diceBtn.textContent = `🎲 Rolling... ${dice}`;

            if (rollCount >= rolls) {
                clearInterval(rollInterval);
                diceBtn.textContent = `🎲 Rolled: ${this.diceResult}`;
                setTimeout(() => {
                    callback();
                    this.canRoll = true;
                    diceBtn.textContent = '🎲 Roll Dice';
                }, 1000);
            }
        }, 50);
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
        this.turnCount++;
        this.updateGameStatus();
        this.updatePlayersList();
        document.getElementById('turnDisplay').textContent = this.turnCount;
        this.draw();
    }

    endGame(winner) {
        this.gameOver = true;
        this.winner = winner;
        this.updateGameStatus();
        document.getElementById('rollDiceBtn').disabled = true;
        this.soundManager.play('gameWin');
    }

    updateGameStatus() {
        if (!this.gameStarted) {
            document.getElementById('game-message').textContent = 
                'Select difficulty and click Start Game!';
            document.getElementById('statusDisplay').textContent = 'Waiting to start';
            return;
        }

        const currentPlayer = this.players[this.currentPlayerIndex];
        document.querySelector('#current-player span').textContent = currentPlayer.name;

        if (this.gameOver) {
            document.getElementById('game-message').textContent = 
                `🎉 ${this.winner.name} wins! Reached the Candy Castle! 🏰`;
            document.getElementById('game-message').style.color = '#f5576c';
            document.getElementById('statusDisplay').textContent = 'Game Over - Winner!';
        } else {
            document.getElementById('game-message').textContent = 
                `${currentPlayer.name}'s turn. Roll the dice!`;
            document.getElementById('game-message').style.color = '#333';
            document.getElementById('statusDisplay').textContent = 'In Progress';
        }
    }

    updateDifficultyDisplay() {
        document.getElementById('difficultyDisplay').textContent = this.difficulty.name;
    }

    updatePlayersList() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';

        this.players.forEach((player, index) => {
            const card = document.createElement('div');
            card.className = `player-card player-${index + 1}`;
            if (index === this.currentPlayerIndex && this.gameStarted) {
                card.classList.add('active');
            }

            const positionPercent = this.gameStarted ? 
                (player.position / (this.board.tiles.length - 1) * 100).toFixed(0) : 0;
            
            let powerUpDisplay = '';
            if (this.activePowerUps[index] && this.activePowerUps[index].length > 0) {
                powerUpDisplay = `<div class="powerup-badge">${this.activePowerUps[index][0].name}</div>`;
            }

            card.innerHTML = `
                <span>${player.name}</span>
                <span class="player-position">${positionPercent}% - 🍭 ${player.candyCount}</span>
                ${powerUpDisplay}
            `;
            playersList.appendChild(card);
        });
    }

    resetGame() {
        this.gameStarted = false;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        this.winner = null;
        this.diceResult = 0;
        this.canRoll = true;
        this.turnCount = 0;
        this.frozenPlayers = {};
        this.activePowerUps = {};
        
        document.getElementById('rollDiceBtn').disabled = false;
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('gameControls').style.display = 'none';
        document.getElementById('difficultySelect').disabled = false;
        
        this.updateGameStatus();
        this.updatePlayersList();
        this.draw();
    }

    toggleMute() {
        const isMuted = this.soundManager.toggleMute();
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            muteBtn.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
        }
    }

    draw() {
        this.ctx.fillStyle = '#e0f6ff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameStarted) {
            this.board.draw(this.ctx);
            this.drawPlayers();
        } else {
            this.drawStartScreen();
        }
    }

    drawStartScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🍭 Candyland Game 🍬', this.canvas.width / 2, this.canvas.height / 2 - 80);

        this.ctx.font = '24px Arial';
        this.ctx.fillText('Select difficulty and click Start Game', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }

    drawPlayers() {
        this.players.forEach(player => {
            const tile = this.board.tiles[player.position];
            const x = tile.x + tile.width / 2;
            const y = tile.y + tile.height / 2;

            // Draw player circle
            this.ctx.fillStyle = player.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 12, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw player number
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(player.id, x, y);
        });
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    window.game = new Game();
});