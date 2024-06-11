var config = 
{
    type: Phaser.AUTO,
    width: 1290,
    height: 650,
    physics: {
        default: 'matter',
        arcade: {
            debug: true
        }
    },

    scene: [MenuScene, PlayScene, GameOverScene]
};



const game = new Phaser.Game(config);


