class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        //load background image
        this.load.image("menuBG", "./assets/battleship_menu_bg.png");
    }

    create() {
        //display background image
        this.backgroundImage = this.add.tileSprite(0, 0, 700, 700, "menuBG").setOrigin(0, 0);

        //create play scene transition
        this.transitionToPlay = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }

    update()
    {
        //transition to play scene
        if (this.transitionToPlay.isDown)
        {
            this.scene.start("PlayScene");
        }
    }

}
