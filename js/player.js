class Player {
    constructor(name, color, index) {
        this.name = name;
        this.color = color;
        this.position = 0;
        this.index = index;
        this.hasRolled = false;
    }

    move(steps) {
        this.position += steps;
        if (this.position > 100) {
            this.position = 100;
        }
    }

    reset() {
        this.position = 0;
        this.hasRolled = false;
    }

    getStatus() {
        return {
            name: this.name,
            position: this.position,
            color: this.color,
            progress: (this.position / 100) * 100
        };
    }
}