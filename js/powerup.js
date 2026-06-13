class PowerUp {
    constructor() {
        this.types = {
            bonus: { name: 'Bonus +3', value: 3, color: '#FFD700' },
            trap: { name: 'Trap -2', value: -2, color: '#FF0000' },
            speed: { name: 'Speed Boost +5', value: 5, color: '#00FF00' }
        };
    }

    apply(player, type) {
        if (this.types[type]) {
            const effect = this.types[type];
            player.move(effect.value);
            return effect;
        }
        return null;
    }

    generateRandom() {
        const types = Object.keys(this.types);
        return types[Math.floor(Math.random() * types.length)];
    }

    checkTileEffect(tile) {
        if (tile.trap) {
            return 'trap';
        }
        if (tile.bonus) {
            return 'bonus';
        }
        return null;
    }
}