class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
        this.ships = [5, 4, 3, 3, 2]; // Sizes of ships
        this.currentShip = 0; // Index of the current ship to place
        this.currentPlayer = 1; // Current player placing ships
        this.shipPlacements = {1: [], 2: []}; // Track ship placements for both players
        this.shipOrientation = 'horizontal'; // Default orientation
        this.tempShip = null; // Temporary ship for placement
    }

    preload() {
        // Load any assets here if necessary
    }

    create() {
        this.drawGrid(50, 50, "Player 1");
        this.drawGrid(700, 50, "Player 2");
        this.input.keyboard.on('keydown-R', this.toggleOrientation, this); // Handle 'R' key for rotation
        this.input.keyboard.on('keydown-ENTER', this.confirmShipPlacement, this); // Handle 'ENTER' key for confirming ship placement
    }

    update() {
        // Game logic updates go here
    }

    drawGrid(offsetX, offsetY, playerLabel) {
        const gridSize = 10;
        const cellSize = 60;
        this.add.text(offsetX, offsetY - 60, playerLabel, { font: '24px Arial', fill: '#000000' });

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let cell = this.add.rectangle(
                    offsetX + i * cellSize,
                    offsetY + j * cellSize,
                    cellSize,
                    cellSize,
                    0xFFFFFF
                ).setStrokeStyle(2, 0x0000ff, 1);
                cell.setInteractive();
                cell.on('pointerdown', () => {
                    this.placeTemporaryShip(offsetX, offsetY, i, j, cellSize);
                });
            }
        }
    }

    toggleOrientation() {
        if (this.tempShip) {
            this.shipOrientation = this.shipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
            this.drawTemporaryShip(this.tempShip.gridX, this.tempShip.gridY); // Only update the temp ship's visual
        }
    }

    placeTemporaryShip(offsetX, offsetY, gridX, gridY, cellSize) {
        // Clear previous temporary ship if any
        if (this.tempShip && this.tempShip.rect) {
            this.tempShip.rect.destroy();
        }
        this.tempShip = { offsetX, offsetY, gridX, gridY, cellSize };
        this.drawTemporaryShip(gridX, gridY);
    }

    drawTemporaryShip(gridX, gridY) {
        if (this.tempShip.rect) {
            this.tempShip.rect.destroy(); // Ensure to clear previous temporary ship visualization
        }

        let length = this.ships[this.currentShip];
        let width = this.shipOrientation === 'horizontal' ? length : 1;
        let height = this.shipOrientation === 'vertical' ? length : 1;
        let x = this.tempShip.offsetX + gridX * this.tempShip.cellSize;
        let y = this.tempShip.offsetY + gridY * this.tempShip.cellSize;

        // Draw new temporary ship
        this.tempShip.rect = this.add.rectangle(
            x + (this.shipOrientation === 'horizontal' ? (this.tempShip.cellSize * (length - 1)) / 2 : 0),
            y + (this.shipOrientation === 'vertical' ? (this.tempShip.cellSize * (length - 1)) / 2 : 0),
            this.tempShip.cellSize * width,
            this.tempShip.cellSize * height,
            0xaaaaaa
        ).setStrokeStyle(2, 0x000000, 1).setOrigin(0.5);
    }

    confirmShipPlacement() {
        if (this.tempShip) {
            // Add the ship to the ship placements list and draw it permanently
            this.shipPlacements[this.currentPlayer].push({
                x: this.tempShip.gridX,
                y: this.tempShip.gridY,
                length: this.ships[this.currentShip],
                orientation: this.shipOrientation
            });

            this.drawPermanentShip();

            // Clear temporary ship and prepare for next placement or switch players
            this.tempShip = null;
            this.currentShip++;
            if (this.currentShip >= this.ships.length) {
                this.currentShip = 0;
                if (this.currentPlayer === 1) {
                    alert("Player 1 has placed all ships. Player 2's turn to place ships.");
                    this.currentPlayer = 2; // Switch to Player 2
                } else {
                    alert("Player 2 has placed all ships. Start the game.");
                    this.startGame(); // Proceed to start the game
                }
            }
        }
    }

    drawPermanentShip() {
        // Draw the confirmed ship permanently on the grid using the latest data
        let length = this.ships[this.currentShip];
        let width = this.shipOrientation === 'horizontal' ? length : 1;
        let height = this.shipOrientation === 'vertical' ? length : 1;
        let x = this.tempShip.offsetX + this.tempShip.gridX * this.tempShip.cellSize;
        let y = this.tempShip.offsetY + this.tempShip.gridY * this.tempShip.cellSize;

        this.add.rectangle(
            x + (this.shipOrientation === 'horizontal' ? (this.tempShip.cellSize * (length - 1)) / 2 : 0),
            y + (this.shipOrientation === 'vertical' ? (this.tempShip.cellSize * (length - 1)) / 2 : 0),
            this.tempShip.cellSize * width,
            this.tempShip.cellSize * height,
            0xaaaaaa
        ).setStrokeStyle(2, 0x000000, 1).setOrigin(0.5);
    }

    startGame() {
        // Initialize game logic here
    }
}
