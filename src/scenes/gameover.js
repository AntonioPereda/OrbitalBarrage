class gameover extends Phaser.Scene {
    constructor(){
        super("gameover");
        this.goGlobals = {
            blinkerCD: 50
        }
    }

    preload(){
       this.load.setPath("./assets/sounds");
       this.load.audio("endGame", "spaceEngineLow_001.ogg");
    }

    init(data){
        this.finalScore = Math.round(data.score);
    }

    create(){
        //logo = this.image(300,300)
        this.gameOver = this.add.bitmapText(200, 150, 'game_font', "GAME OVER", 120);
        this.showScore = this.add.bitmapText(360, 350, 'game_font', "SCORE " + this.finalScore, 70);


        this.endAudio = this.sound.add("endGame");
        this.endAudio.play({volume: 0.035, loop: true})

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);   
        
        this.restartGame = this.add.bitmapText(110, 600, 'game_font', "PRESS ENTER TO PLAY AGAIN", 60);

    }

    update(){
        let my = this.my;
        this.goGlobals.blinkerCD--;
        if (this.goGlobals.blinkerCD == 0) {
            this.startBinding.visible = false;
        }
        if (this.goGlobals.blinkerCD == -50) {
            this.startBinding.visible = true;
            this.goGlobals.blinkerCD = 50;
        }
        if(this.enterKey.isDown){
            this.sound.play("start_game", {volume: 0.04});
            this.endAudio.stop();
            this.scene.stop("gameover");
            this.scene.start("maingame", {
                projQue: [],

                enemyQue: [],
                activeEnemies: 2,
                totalActive: 0,
                totalEnemies: 6,
                enemyCD: 20,
                storeSpawnCD: 55,
                enemyTypeRate: 5,
                totalDestroyed: 0,

                playerHealth: 100,
                pproj_CD: 0,
                rotateLocation: 0,

                level: 1,
                score: 0,
                scoreMult: 0.25
            });
            //console.log("switched");
        }
    }

}