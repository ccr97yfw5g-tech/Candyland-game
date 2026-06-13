class Board {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tiles = [];
        this.squareSize = canvas.width / 10;
        this.initializeTiles();
    }

    initializeTiles() {
        this.tiles = [];
        const colors = ['#FFE5B4', '#FFD7A8', '#FFC99C', '#FFBB90', '#FFAD84', 
                        '#FF9F78', '#FF916C', '#FF8360', '#FF7554', '#FF6748'];
        
        for (let i = 0; i < 100; i++) {
            const row = Math.floor(i / 10);
            const col = i % 10;
            this.tiles.push({
                number: i + 1,
                x: col * this.squareSize,
                y: row * this.squareSize,
                color: colors[i % colors.length],
                trap: Math.random() < 0.1,
                bonus: Math.random() < 0.1
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board background
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw tiles
        this.tiles.forEach(tile => {
            this.ctx.fillStyle = tile.color;
            this.ctx.fillRect(tile.x, tile.y, this.squareSize, this.squareSize);
            
            // Draw border
            this.ctx.strokeStyle = '#ddd';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(tile.x, tile.y, this.squareSize, this.squareSize);
            
            // Draw trap
            if (tile.trap) {
                this.ctx.fillStyle = '#FF0000';
                this.ctx.beginPath();
                this.ctx.arc(tile.x + this.squareSize / 2, tile.y + this.squareSize / 2, 5, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Draw bonus
            if (tile.bonus) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.arc(tile.x + this.squareSize / 2, tile.y + this.squareSize / 2, 5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Draw finish line
        this.ctx.fillStyle = '#00AA00';
        this.ctx.fillRect(this.tiles[99].x, this.tiles[99].y, this.squareSize, this.squareSize);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('WIN!', this.tiles[99].x + this.squareSize / 2, this.tiles[99].y + this.squareSize / 2);
    }

    drawPlayers(players) {
        players.forEach((player, index) => {
            if (player.position >= 0 && player.position < this.tiles.length) {
                const tile = this.tiles[player.position];
                const offsetX = (index % 2) * (this.squareSize / 3) + 5;
                const offsetY = Math.floor(index / 2) * (this.squareSize / 3) + 5;
                
                this.ctx.fillStyle = player.color;
                this.ctx.beginPath();
                this.ctx.arc(tile.x + offsetX + 10, tile.y + offsetY + 10, 8, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
    }

    getTile(position) {
        return this.tiles[Math.floor(position)];
    }
}