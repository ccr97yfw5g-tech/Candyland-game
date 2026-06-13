// Updated Player class with enhanced features
class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.position = 0;
        this.candyCount = 0;
        this.startPosition = 0;
        this.hasSpecialAbility = false;
        this.hasShield = false;
        this.moveMultiplier = 1;
        this.candyMultiplier = 1;
        this.activePowerUpTimer = 0;
        this.stats = {
            tilesTraversed: 0,
            powerUpsCollected: 0,
            trapsFaced: 0
        };
    }

    move(spaces) {
        this.position += spaces;
        this.stats.tilesTraversed += spaces;
        this.collectCandy();
    }

    collectCandy() {
        // Random candy collection on movement
        if (Math.random() > 0.7) {
            const candyAmount = Math.floor(Math.random() * 5) + 1;
            this.candyCount += candyAmount * this.candyMultiplier;
        }
    }

    reset() {
        this.position = this.startPosition;
        this.candyCount = 0;
        this.hasSpecialAbility = false;
        this.hasShield = false;
        this.moveMultiplier = 1;
        this.candyMultiplier = 1;
        this.activePowerUpTimer = 0;
        this.stats = {
            tilesTraversed: 0,
            powerUpsCollected: 0,
            trapsFaced: 0
        };
    }

    getProgress() {
        return this.position;
    }

    getName() {
        return this.name;
    }

    getStats() {
        return {
            name: this.name,
            position: this.position,
            candyCount: this.candyCount,
            color: this.color,
            stats: this.stats
        };
    }

    activatePowerUp(powerUp) {
        this.stats.powerUpsCollected++;
        powerUp.activate(this);
    }
}