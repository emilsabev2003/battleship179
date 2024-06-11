class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    preload() {
        this.load.image("board", "./assets/battleship_board.png");
    }

    create() {
        this.backgroundImage = this.add.tileSprite(0, 0, 700, 700, "board").setOrigin(0, 0);
    }

    update() {
        
    }
}
