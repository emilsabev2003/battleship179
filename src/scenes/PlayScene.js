class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
        this.ships = [5, 4, 3, 3, 2]; // Sizes of ships
        this.currentShip = 0; // Index of the current ship to place
        this.currentPlayer = 1; // Current player placing ships
        this.shipPlacements = {1: [], 2: []}; // Track ship placements for both players
        this.shipOrientation = 'horizontal'; // Default orientation
        this.tempShip = null; // Temporary ship for placement
        this.gridSize = 10; // Assuming a 10x10 grid
        this.cellSize = 60;
    }

    preload() {
        // Load any assets here if necessary
    }

    create() {
        this.drawGrid(50, 50, "Player 1");
        this.drawGrid(700, 50, "Player 2");
        this.input.keyboard.on('keydown-R', this.toggleOrientation, this);
        this.input.keyboard.on('keydown-ENTER', this.confirmShipPlacement, this);
    }

    update() {
        // Game logic updates go here
    }

    drawGrid(offsetX, offsetY, playerLabel) {
        this.add.text(offsetX, offsetY - 60, playerLabel, { font: '24px Arial', fill: '#000000' });

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                let cell = this.add.rectangle(
                    offsetX + i * this.cellSize,
                    offsetY + j * this.cellSize,
                    this.cellSize,
                    this.cellSize,
                    0xFFFFFF
                ).setStrokeStyle(2, 0x0000ff, 1);
                cell.setInteractive();
                cell.on('pointerdown', () => {
                    this.placeTemporaryShip(offsetX, offsetY, i+1.5, j-.5);
                });
            }
        }
    }

    toggleOrientation() {
        if (this.tempShip) {
            this.shipOrientation = this.shipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
            if (this.tempShip.rect) {
                this.tempShip.rect.destroy(); // Destroy existing rectangle before redrawing
            }
            this.drawTemporaryShip(this.tempShip.gridX, this.tempShip.gridY);
        }
    }

    placeTemporaryShip(offsetX, offsetY, gridX, gridY) {
        // Check if the ship can be placed within bounds
        let length = this.ships[this.currentShip];
        if ((this.shipOrientation === 'horizontal' && (gridX + length > this.gridSize)) ||
            (this.shipOrientation === 'vertical' && (gridY + length > this.gridSize))) {
            alert("The boat would be out of the grid. Try again.");
            return; // Prevent placing the ship if out of bounds
        }

        if (this.tempShip && this.tempShip.rect) {
            this.tempShip.rect.destroy(); // Ensure to clear previous temporary ship visualization
        }
        this.tempShip = { offsetX, offsetY, gridX, gridY };
        this.drawTemporaryShip(gridX, gridY);
    }

    drawTemporaryShip(gridX, gridY) {
        let length = this.ships[this.currentShip];
        let width = this.shipOrientation === 'horizontal' ? length : 1;
        let height = this.shipOrientation === 'vertical' ? length : 1;
        let x = this.tempShip.offsetX + gridX * this.cellSize + (this.cellSize / 2);
        let y = this.tempShip.offsetY + gridY * this.cellSize + (this.cellSize / 2);

        this.tempShip.rect = this.add.rectangle(
            x, y, this.cellSize * width, this.cellSize * height, 0xaaaaaa
        ).setStrokeStyle(2, 0x000000, 1).setOrigin(0.5);
    }

    confirmShipPlacement() {
        if (this.tempShip) {
            this.shipPlacements[this.currentPlayer].push({
                x: this.tempShip.gridX,
                y: this.tempShip.gridY,
                length: this.ships[this.currentShip],
                orientation: this.shipOrientation
            });

            this.drawPermanentShip();

            this.currentShip++;
            if (this.currentShip >= this.ships.length) {
                this.tempShip = null;
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
        let length = this.ships[this.currentShip];
        let width = this.shipOrientation === 'horizontal' ? length : 1;
        let height = this.shipOrientation === 'vertical' ? length : 1;
        let x = this.tempShip.offsetX + this.tempShip.gridX * this.cellSize + (this.cellSize / 2);
        let y = this.tempShip.offsetY + this.tempShip.gridY * this.cellSize + (this.cellSize / 2);

        this.add.rectangle(
            x, y, this.cellSize * width, this.cellSize * height, 0xaaaaaa
        ).setStrokeStyle(2, 0x000000, 1).setOrigin(0.5);
    }

    startGame() {
        // Initialize game logic here
    }
}
