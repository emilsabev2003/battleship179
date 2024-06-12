class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    //save data from play scene
    init(data) {
        this.winner = data.winner;
    }

    preload() {
        //load background image
        this.load.image("GO_bg", "./assets/game_over_sprite.png");
    }

    create() {
        //display background image
        this.backgroundImage = this.add.image(0, -50, "GO_bg").setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        //display winner
        this.add.text(600, 450, `Player ${this.winner} Wins!`, { font: '48px Arial', fill: '#000000' }).setOrigin(0.5, 0.5);
    }

    update() {

    }
}