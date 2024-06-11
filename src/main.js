var config = 
{
    type: Phaser.AUTO,
    width: 1290,
    height: 1050,
    backgroundColor: '#b0e0e6',
    physics: {
        default: 'matter',
        arcade: {
            debug: true
        }
    },

    scene: [MenuScene, PlayScene, GameOverScene]
};



const game = new Phaser.Game(config);


