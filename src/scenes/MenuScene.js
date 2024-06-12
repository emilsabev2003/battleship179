class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        //load background image
        this.load.image("menuBG", "./assets/new_menu_bg.png");
    }

    create() {
        //display background image
        this.backgroundImage = this.add.image(0, -50, "menuBG").setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    
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
