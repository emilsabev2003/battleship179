class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
        this.ships = [5, 4, 3, 3, 2]; // Sizes of ships
        this.currentShip = 0; // Index of the current ship to place
        this.currentPlayer = 1; // Current player placing ships
        this.shipPlacements = {1: [], 2: []}; // Track ship placements for both players
        this.shipOrientation = 'horizontal'; // Default orientation
        this.tempShip = null; // Temporary ship for placement
        this.gameStarted = false; // Flag to indicate the game has started
        this.useTorpedo = false; // Flag to indicate torpedo use
        this.useVerticalTorpedo = false; // Flag to indicate vertical torpedo use
    }

    preload() {
        // Load any assets here if necessary
    }

    create() {
        this.drawGrid(50, 50, "Player 1");
        this.drawGrid(700, 50, "Player 2");
        this.addTorpedoButton(50, 700, 1);
        this.addVerticalTorpedoButton(50, 730, 1); // Add vertical torpedo button for Player 1
        this.addTorpedoButton(700, 700, 2);
        this.addVerticalTorpedoButton(700, 730, 2); // Add vertical torpedo button for Player 2
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
                    if (this.gameStarted) {
                        this.dropBomb(offsetX, i, j);
                    } else {
                        this.placeTemporaryShip(offsetX, offsetY, i, j, cellSize);
                    }
                });
            }
        }
    }

    addTorpedoButton(offsetX, offsetY, player) {
        let button = this.add.text(offsetX, offsetY, 'Use Torpedo', { font: '20px Arial', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                if (this.currentPlayer === player) {
                    this.useTorpedo = true;
                    alert(`Player ${player} will use a torpedo on their next attack.`);
                }
            });
    }

    addVerticalTorpedoButton(offsetX, offsetY, player) {
        let button = this.add.text(offsetX, offsetY, 'Use Vertical Torpedo', { font: '20px Arial', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                if (this.currentPlayer === player) {
                    this.useVerticalTorpedo = true;
                    alert(`Player ${player} will use a vertical torpedo on their next attack.`);
                }
            });
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
        this.gameStarted = true;
        this.currentPlayer = 1; // Player 1 starts the game
        alert("Player 1 starts the game. Drop a bomb on Player 2's grid.");
    }

    dropBomb(offsetX, gridX, gridY) {
        let playerToAttack = this.currentPlayer === 1 ? 2 : 1;
        let gridToCheck = this.shipPlacements[playerToAttack];
        let hit = false;

        const dropBombOnCell = (x, y) => {
            let hitInCurrentCell = false;
            for (let ship of gridToCheck) {
                let shipCells = [];
                if (ship.orientation === 'horizontal') {
                    for (let i = 0; i < ship.length; i++) {
                        shipCells.push({ x: ship.x + i, y: ship.y });
                    }
                } else {
                    for (let i = 0; i < ship.length; i++) {
                        shipCells.push({ x: ship.x, y: ship.y + i });
                    }
                }

                for (let cell of shipCells) {
                    if (cell.x === x && cell.y === y) {
                        hit = true;
                        hitInCurrentCell = true;
                        break;
                    }
                }

                if (hitInCurrentCell) break;
            }

            let cellSize = 60;
            let bombX = offsetX + x * cellSize;
            let bombY = 50 + y * cellSize; // Fixed offsetY for both grids

            if (hitInCurrentCell) {
                this.add.rectangle(bombX, bombY, cellSize, cellSize, 0xff0000).setStrokeStyle(2, 0x000000, 1);
            } else {
                this.add.rectangle(bombX, bombY, cellSize, cellSize, 0xffa500).setStrokeStyle(2, 0x000000, 1);
            }
        };

        if (this.useTorpedo) {
            for (let i = 0; i < 10; i++) {
                dropBombOnCell(i, gridY);
            }
            this.useTorpedo = false;
        } else if (this.useVerticalTorpedo) {
            for (let j = 0; j < 10; j++) {
                dropBombOnCell(gridX, j);
            }
            this.useVerticalTorpedo = false;
        } else {
            dropBombOnCell(gridX, gridY);
        }

        if (hit) {
            alert(`Player ${this.currentPlayer} hit a ship! They get to go again.`);
        } else {
            alert(`Player ${this.currentPlayer} missed!`);
            this.currentPlayer = playerToAttack; // Switch turns
            alert(`It's Player ${this.currentPlayer}'s turn to drop bombs.`);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scene: PlayScene,
    backgroundColor: '#b0e0e6',
};

const game = new Phaser.Game(config);
