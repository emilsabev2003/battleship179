class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
        this.ships = [5, 4, 3, 3, 2];
        this.currentShip = 0;
        this.currentPlayer = 1;
        this.shipPlacements = {1: [], 2: []};
        this.shipSprites = {1: [], 2: []};
        this.shipOrientation = 'horizontal';
        this.tempShip = null;
        this.gameStarted = false;
        this.useTorpedo = false;
        this.useVerticalTorpedo = false;
        this.useMegaTorpedo = false;
        this.useTorpedoX = false;
        this.hits = {1: 0, 2: 0};
        this.player1Ships = [];
        this.player2Ships = [];
        this.shipPlacementMask = null; // Added variable for ship placement mask
    }
    
    preload() {
        // Preload ship images
        this.load.image("ship1", "./assets/5x1_ship.png");
        this.load.image("ship2", "./assets/4x1_ship.png");
        this.load.image("ship3", "./assets/3x1_ship.png");
        this.load.image("ship4", "./assets/3x1_ship.png");
        this.load.image("ship5", "./assets/2x1_ship.png");
        this.load.image("ship1rotated", "./assets/5x1_ship_rotated.png");
        this.load.image("ship2rotated", "./assets/4x1_ship_rotated.png");
        this.load.image("ship3rotated", "./assets/3x1_ship_rotated.png");
        this.load.image("ship4rotated", "./assets/3x1_ship_rotated.png");
        this.load.image("ship5rotated", "./assets/2x1_ship_rotated.png");

        this.load.audio("hit_sound", "./assets/hit.mp3");
        this.load.audio("miss_sound", "./assets/miss.mp3");
    }

    create() {
        // Draw grids for both players
        this.grid1 = this.drawGrid(50, 50, "Player 1");
        this.grid2 = this.drawGrid(700, 50, "Player 2");

        // Add torpedo buttons for both players
        this.addTorpedoButton(50, 700, 1);
        this.addVerticalTorpedoButton(50, 730, 1);
        this.addMegaTorpedoButton(50, 760, 1);
        this.addTorpedoXButton(50, 790, 1);
        this.addTorpedoButton(700, 700, 2);
        this.addVerticalTorpedoButton(700, 730, 2);
        this.addMegaTorpedoButton(700, 760, 2);
        this.addTorpedoXButton(700, 790, 2);

        // Register keyboard events
        this.input.keyboard.on('keydown-R', this.toggleOrientation, this);
        this.input.keyboard.on('keydown-ENTER', this.confirmShipPlacement, this);

        // Create empty grid overlays
        this.player1GridOverlay = this.createEmptyGrid(50, 50).setVisible(false); // Initially hidden
        this.player2GridOverlay = this.createEmptyGrid(700, 50).setVisible(true); // Initially visible

        // Hide Player 2's ships at the start of the game
        this.hideShips(2);

        // Create a black mask for ship placement phase
        this.shipPlacementMask = this.add.rectangle(50, 50, 600, 600, 0x000000, 0.7).setOrigin(0);
        this.shipPlacementMask.setVisible(false);

        // Set gameStarted flag to false initially
        this.gameStarted = false;

        this.hitSound = this.sound.add('hit_sound');
        this.missSound = this.sound.add('miss_sound');


    }
    

    

    update() {
        
    }

    drawGrid(offsetX, offsetY, playerLabel) {
        const gridSize = 10;
        const cellSize = 60;
        const gridContainer = this.add.container(offsetX, offsetY);
        this.add.text(0, -60, playerLabel, { font: '24px Arial', fill: '#000000' }, gridContainer);

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let cell = this.add.rectangle(
                    i * cellSize,
                    j * cellSize,
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
                gridContainer.add(cell);
            }
        }
        return gridContainer;
    }

    createEmptyGrid(offsetX, offsetY) {
        const gridSize = 10;
        const cellSize = 60;
        const gridContainer = this.add.container(offsetX, offsetY);

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                let cell = this.add.rectangle(
                    i * cellSize,
                    j * cellSize,
                    cellSize,
                    cellSize,
                    0xFFFFFF
                ).setStrokeStyle(2, 0x0000ff, 1);
                gridContainer.add(cell);
            }
        }
        return gridContainer;
    }

    addTorpedoButton(offsetX, offsetY, player) {
        let button = this.add.text(offsetX, offsetY + 120, 'Use Horizontal Torpedo', { font: '20px Arial', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                if (this.currentPlayer === player && !this.useTorpedo) { // Check if torpedo is not already used
                    this.useTorpedo = true;
                    alert(`Player ${player} will use a torpedo on their next attack.`);
                    button.disableInteractive(); // Disable the button after use
                }
            });
    }
    
    addVerticalTorpedoButton(offsetX, offsetY, player) {
        let button = this.add.text(offsetX, offsetY, 'Use Vertical Torpedo', { font: '20px Arial', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                if (this.currentPlayer === player && !this.useVerticalTorpedo) { // Check if vertical torpedo is not already used
                    this.useVerticalTorpedo = true;
                    alert(`Player ${player} will use a vertical torpedo on their next attack.`);
                    button.disableInteractive(); // Disable the button after use
                }
            });
    }
    
    addMegaTorpedoButton(offsetX, offsetY, player) {
        let button = this.add.text(offsetX, offsetY, 'Use Mega Torpedo', { font: '20px Arial', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                if (this.currentPlayer === player && !this.useMegaTorpedo) { // Check if mega torpedo is not already used
                    this.useMegaTorpedo = true;
                    alert(`Player ${player} will use a mega torpedo on their next attack.`);
                    button.disableInteractive(); // Disable the button after use
                }
            });
    }
    
    addTorpedoXButton(offsetX, offsetY, player) {
        let button = this.add.text(offsetX, offsetY, 'Use Torpedo X', { font: '20px Arial', fill: '#ff0000' })
            .setInteractive()
            .on('pointerdown', () => {
                if (this.currentPlayer === player && !this.useTorpedoX) { // Check if torpedo X is not already used
                    this.useTorpedoX = true;
                    alert(`Player ${player} will use a torpedo X on their next attack.`);
                    button.disableInteractive(); // Disable the button after use
                }
            });
    }
    
    

    toggleOrientation() {
        if (this.tempShip) {
            this.shipOrientation = this.shipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
            this.drawTemporaryShip(this.tempShip.gridX, this.tempShip.gridY);
        }
    }

    placeTemporaryShip(offsetX, offsetY, gridX, gridY, cellSize) {
        if (this.tempShip && this.tempShip.rect) {
            this.tempShip.rect.destroy();
        }
        this.tempShip = { offsetX, offsetY, gridX, gridY, cellSize };
        this.drawTemporaryShip(gridX, gridY);
    }

    drawTemporaryShip(gridX, gridY) {
        if (this.tempShip.rect) {
            this.tempShip.rect.destroy();
        }
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

            this.tempShip = null;
            this.currentShip++;
            if (this.currentShip >= this.ships.length) {
                this.currentShip = 0;
                if (this.currentPlayer === 1) {
                    alert("Player 1 has placed all ships. Player 2's turn to place ships.");
                    this.currentPlayer = 2;
                    // Show ship placement mask over Player 1's grid
                    this.shipPlacementMask.setVisible(true);
                    // Hide Player 1's ships during Player 2's turn
                    this.hideShips(1);
                } else {
                    alert("Player 2 has placed all ships. Start the game.");
                    this.shipPlacementMask.setVisible(false);
                    this.startGame();
                }
            }
        }
    }

    drawPermanentShip() {
        // Draw the confirmed ship permanently on the grid using the latest data
        let length = this.ships[this.currentShip];
        let x = this.tempShip.offsetX + this.tempShip.gridX * this.tempShip.cellSize - 30;
        let y = this.tempShip.offsetY + this.tempShip.gridY * this.tempShip.cellSize - 30;
        let spriteKey = `ship${this.currentShip + 1}`;
    
        // Select the correct sprite key based on the ship orientation
        if (this.shipOrientation === 'vertical') {
            spriteKey += 'rotated';
        }
    
        let sprite = this.add.sprite(x, y, spriteKey).setOrigin(0, 0);
    
        if (this.shipOrientation === 'horizontal') {
            sprite.setDisplaySize(length * this.tempShip.cellSize, this.tempShip.cellSize);
        } else {
            sprite.setDisplaySize(this.tempShip.cellSize, length * this.tempShip.cellSize);
        }
    
        // Store the sprite in the corresponding player's array
        if (this.currentPlayer === 1) {
            this.player1Ships.push(sprite);
        } else {
            this.player2Ships.push(sprite);
        }
    }

    hideShips(player) {
        let ships = player === 1 ? this.player1Ships : this.player2Ships;
        ships.forEach(ship => ship.setVisible(false));
    }
    
    showShips(player) {
        let ships = player === 1 ? this.player1Ships : this.player2Ships;
        ships.forEach(ship => ship.setVisible(true));
    }
    
    startGame() {
        this.gameStarted = true;
        this.currentPlayer = 1; // Player 1 starts the game
        alert("Player 1 starts the game. Drop a bomb on Player 2's grid.");
    
        // Update masks and visibility of ships based on the current player
        this.updateTurn();
    }

    updateGridVisibility() {
        if (this.currentPlayer === 1) {
            this.player1GridOverlay.setVisible(false);
            this.player2GridOverlay.setVisible(true);
        } else {
            this.player1GridOverlay.setVisible(true);
            this.player2GridOverlay.setVisible(false);
        }
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
                this.hitSound.play();
                this.add.rectangle(bombX, bombY, cellSize, cellSize, 0xff0000).setStrokeStyle(2, 0x000000, 1);
                this.hits[this.currentPlayer]++;
            } else {
                this.missSound.play();
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
        } else if (this.useMegaTorpedo) {
            for (let i = 0; i < 10; i++) {
                dropBombOnCell(i, gridY);
            }
            for (let j = 0; j < 10; j++) {
                dropBombOnCell(gridX, j);
            }
            this.useMegaTorpedo = false;
        } else if (this.useTorpedoX) {
            for (let i = 0; i < 10; i++) {
                if (gridX + i < 10 && gridY + i < 10) {
                    dropBombOnCell(gridX + i, gridY + i);
                }
                if (gridX - i >= 0 && gridY - i >= 0) {
                    dropBombOnCell(gridX - i, gridY - i);
                }
                if (gridX + i < 10 && gridY - i >= 0) {
                    dropBombOnCell(gridX + i, gridY - i);
                }
                if (gridX - i >= 0 && gridY + i < 10) {
                    dropBombOnCell(gridX - i, gridY + i);
                }
            }
            this.useTorpedoX = false;
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
    
        // Check if game is over
        if (this.hits[this.currentPlayer] >= 17) {
            this.scene.start('GameOverScene', { winner: this.currentPlayer });
        } else {
            this.updateTurn();
        }
    }

    updateTurn() {
        if (this.currentPlayer === 1) {
            this.player1GridOverlay.setVisible(false);
            this.player2GridOverlay.setVisible(true);
            this.hideShips(2); // Hide Player 2's ships
            this.showShips(1); // Show Player 1's ships
        } else {
            this.player1GridOverlay.setVisible(true);
            this.player2GridOverlay.setVisible(false);
            this.hideShips(1); // Hide Player 1's ships
            this.showShips(2); // Show Player 2's ships
        }
    }
    
    
}
