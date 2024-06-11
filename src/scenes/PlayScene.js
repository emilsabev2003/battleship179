class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    preload() {
        // Load any assets here if necessary
    }

    create() {
        // Draw the grids with different offsets
        this.drawGrid(50, 50, "Player 1");  // Grid for Player 1
        this.drawGrid(700, 50, "Player 2"); // Grid for Player 2
    }

    update() {
        // Game logic updates go here
    }

    drawGrid(offsetX, offsetY, playerLabel) {
        const gridSize = 10;
        const cellSize = 60;

        // Draw label for player
        this.add.text(offsetX, offsetY - 60, playerLabel, { font: '24px Arial', fill: '#000000' });

        // Draw grid
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                this.add.rectangle(
                    offsetX + i * cellSize,
                    offsetY + j * cellSize,
                    cellSize,
                    cellSize,
                    0xFFFFFF
                ).setStrokeStyle(2, 0x0000ff, 1);
            }
        }

        // Label columns (A-J)
        for (let i = 0; i < gridSize; i++) {
            this.add.text(offsetX + i * cellSize + 20, offsetY - 30, String.fromCharCode(65 + i), { font: '18px Arial', fill: '#000000' });
        }

        // Label rows (1-10)
        for (let j = 0; j < gridSize; j++) {
            this.add.text(offsetX - 30, offsetY + j * cellSize + 15, (j + 1).toString(), { font: '18px Arial', fill: '#000000' });
        }
    }
}
