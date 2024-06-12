class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    preload() {
        //load background image
        this.load.image("GO_bg", "./assets/game_over_sprite.png");
    }

    create() {
        //display background image
        this.backgroundImage = this.add.tileSprite(0, 0, 1290, 650, "GO_bg").setOrigin(0, 0);

        //create play scene transition
        this.transitionToPlay = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }

    update() {
        //transition to play scene
        if (this.transitionToPlay.isDown)
        {
            this.scene.start("PlayScene");
        }
    }
}