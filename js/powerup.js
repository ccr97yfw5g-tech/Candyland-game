// PowerUp class - Special abilities and bonuses
class PowerUp {
    constructor(type, name, description, effect) {
        this.type = type;
        this.name = name;
        this.description = description;
        this.effect = effect;
        this.isActive = false;
        this.duration = 0;
    }

    activate(player) {
        this.isActive = true;
        this.effect(player);
    }

    deactivate(player) {
        this.isActive = false;
    }
}

// PowerUp types
const PowerUps = {
    SPEED_BOOST: new PowerUp(
        'speed_boost',
        '⚡ Speed Boost',
        'Roll again!',
        (player) => {
            // Player gets to roll again - handled in game logic
        }
    ),
    DOUBLE_MOVE: new PowerUp(
        'double_move',
        '2️⃣ Double Move',
        'Move twice as far!',
        (player) => {
            player.moveMultiplier = 2;
            player.activePowerUpTimer = 5; // 5 turns
        }
    ),
    CANDY_MAGNET: new PowerUp(
        'candy_magnet',
        '🧲 Candy Magnet',
        'Collect double candy!',
        (player) => {
            player.candyMultiplier = 2;
            player.activePowerUpTimer = 3;
        }
    ),
    SHIELD: new PowerUp(
        'shield',
        '🛡️ Shield',
        'Skip one setback!',
        (player) => {
            player.hasShield = true;
        }
    ),
    TELEPORT: new PowerUp(
        'teleport',
        '🌀 Teleport',
        'Jump ahead 5 spaces!',
        (player) => {
            player.position += 5;
        }
    ),
    FREEZE_OPPONENT: new PowerUp(
        'freeze_opponent',
        '❄️ Freeze',
        'Opponent skips next turn!',
        (player) => {
            // Handled in game logic
        }
    )
};

// Difficulty levels with different effects
const DifficultyLevels = {
    EASY: {
        name: 'Easy',
        minDiceRoll: 1,
        maxDiceRoll: 6,
        powerUpFrequency: 0.4,
        trapFrequency: 0.1,
        candyFrequency: 0.5
    },
    MEDIUM: {
        name: 'Medium',
        minDiceRoll: 1,
        maxDiceRoll: 6,
        powerUpFrequency: 0.3,
        trapFrequency: 0.25,
        candyFrequency: 0.35
    },
    HARD: {
        name: 'Hard',
        minDiceRoll: 1,
        maxDiceRoll: 6,
        powerUpFrequency: 0.15,
        trapFrequency: 0.4,
        candyFrequency: 0.2
    }
};