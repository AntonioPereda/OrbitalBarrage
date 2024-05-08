class mainmenu extends Phaser.Scene {
    constructor(){
        super("mainmenu");
        this.menuGlobals = {
            blinkerCD: 50,
        }
    }

    preload(){
        this.load.setPath("./assets/graphics");
        this.load.image("logo", "OrbitalBarrage.png");
        this.load.image("a_instruct", "instruction_A.png");
        this.load.image("d_instruct", "instruction_D.png");
        this.load.image("LC_instruct", "instruction_LC.png");
        this.load.image("startGame", "instruction_START.png");

        this.load.setPath("./assets/sounds");
        this.load.audio("main_audio", "spaceEngineSmall_000.ogg");
        this.load.audio("start_game", "impactMining_003.ogg");

    }

    create(){
        this.logo = this.add.image(500,250, "logo").setScale(5);
        this.aBinding = this.add.image(120,600, "a_instruct").setScale(2);
        this.dBinding = this.add.image(860,600, "d_instruct").setScale(2);
        this.lcBinding = this.add.image(480,600, "LC_instruct").setScale(3);
        this.startBinding = this.add.image(500,400, "startGame").setScale(6.5);
        this.maintheme = this.sound.add("main_audio");
        this.maintheme.play({volume: 0.035, loop: true});

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    }

    update(){
        let my = this.my;
        this.menuGlobals.blinkerCD--;
        if (this.menuGlobals.blinkerCD == 0) {
            this.startBinding.visible = false;
        }
        if (this.menuGlobals.blinkerCD == -50) {
            this.startBinding.visible = true;
            this.menuGlobals.blinkerCD = 50;
        }
        if(this.enterKey.isDown){
            this.maintheme.stop();
            this.sound.play("start_game", {volume: 0.04});
            this.scene.stop("mainmenu");
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