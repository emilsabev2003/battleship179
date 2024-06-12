class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        //load background image
        this.load.image("menuBG", "./assets/new_menu_bg.png");
        this.load.audio("BGmusic", "./assets/bg_music.mp3");
    }

    create() {
        //display background image
        this.backgroundImage = this.add.image(0, -50, "menuBG").setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    
        //create play scene transition
        this.transitionToPlay = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.backgroundMusic = this.sound.add("BGmusic", {loop:true});
        this.backgroundMusic.setVolume(0.3);
    }
    

    update()
    {
        //transition to play scene
        if (this.transitionToPlay.isDown)
        {
            this.backgroundMusic.play();
            this.scene.start("PlayScene");
        }
    }

}
