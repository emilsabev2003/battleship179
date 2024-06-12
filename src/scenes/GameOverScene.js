class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

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

        //create play scene transition
        this.transitionToPlay = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.add.text(600, 450, `Player ${this.winner} Wins!`, { font: '48px Arial', fill: '#000000' }).setOrigin(0.5, 0.5);
    }

    update() {
        //transition to play scene
        if (this.transitionToPlay.isDown)
        {
            this.scene.start("PlayScene");
        }
    }
}