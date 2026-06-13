class Board {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tiles = [];
        this.squareSize = 0;
        this.initializeTiles();
        this.resizeCanvas();
    }

    resizeCanvas() {
        // Make canvas responsive
        const containerWidth = this.canvas.parentElement.offsetWidth;
        const maxWidth = Math.min(containerWidth - 30, 800);
        
        this.canvas.width = maxWidth;
        this.canvas.height = Math.round((maxWidth / 800) * 600);
        this.squareSize = this.canvas.width / 10;
        this.updateTilePositions();
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

    updateTilePositions() {
        // Update tile positions after resize
        for (let i = 0; i < this.tiles.length; i++) {
            const row = Math.floor(i / 10);
            const col = i % 10;
            this.tiles[i].x = col * this.squareSize;
            this.tiles[i].y = row * this.squareSize;
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
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(tile.x, tile.y, this.squareSize, this.squareSize);
            
            // Draw trap
            if (tile.trap) {
                this.ctx.fillStyle = '#FF0000';
                this.ctx.beginPath();
                this.ctx.arc(tile.x + this.squareSize / 2, tile.y + this.squareSize / 2, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Draw bonus
            if (tile.bonus) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.arc(tile.x + this.squareSize / 2, tile.y + this.squareSize / 2, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Draw finish line
        this.ctx.fillStyle = '#00AA00';
        this.ctx.fillRect(this.tiles[99].x, this.tiles[99].y, this.squareSize, this.squareSize);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('WIN!', this.tiles[99].x + this.squareSize / 2, this.tiles[99].y + this.squareSize / 2);
    }

    drawPlayers(players) {
        players.forEach((player, index) => {
            if (player.position >= 0 && player.position < this.tiles.length) {
                const tile = this.tiles[player.position];
                const offsetX = (index % 2) * (this.squareSize / 3) + 2;
                const offsetY = Math.floor(index / 2) * (this.squareSize / 3) + 2;
                
                this.ctx.fillStyle = player.color;
                this.ctx.beginPath();
                this.ctx.arc(tile.x + offsetX + 5, tile.y + offsetY + 5, 5, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
    }

    getTile(position) {
        return this.tiles[Math.floor(position)];
    }
}