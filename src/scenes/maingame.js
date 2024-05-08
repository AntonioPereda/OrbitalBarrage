class maingame extends Phaser.Scene {

    //TODO LIST:
    // SOUND 8
    // ANIMATIONS 9

    constructor(){
        super("maingame");
        this.my = {sprite: {}};
        this.globals = {
            projQue: [],

            enemyQue: [],
            activeEnemies: 2,
            totalActive: 0,
            totalEnemies: 6,
            enemyCD: 20,
            storeSpawnCD: 30,
            enemyTypeRate: 5,
            totalDestroyed: 0,

            playerHealth: 100,
            pproj_CD: 0,
            rotateLocation: 0,

            level: 1,
            score: 0,
            scoreMult: 0.25
            //IRRELVANT, WILL GET OVERWRITTEN
        };

        this.aKey = null;
        this.dKey = null;

        this.pointer = null;
    }

    preload(){
        this.load.setPath("./assets/graphics");

        this.load.image("player_ship", "player_model2.png");  
        this.load.image("enemyA", "enemyShip1.png");  
        this.load.image("enemyB", "enemyShip2.png");  
        //this.load.image("crosshair", "crosshair3.png");  
        this.load.image("player_projectile", "meteor_squareSmall.png");
        this.load.image("enemy_projectile", "enemyProj.png");
        this.load.image("exp1", "scorch_01.png");    
        this.load.image("exp2", "scorch_02.png");   
        this.load.image("exp3", "star_08.png");
        this.load.image("exp4", "star_02.png");
        this.load.image("exp5", "star_05.png");

        this.load.image("gas1", "light_02.png");
        this.load.image("gas2", "light_03.png");

        this.load.image("fire", "flame_01.png");

        this.load.bitmapFont('game_font', 'KennyFont2.png', 'KennyFont.fnt');


        this.load.setPath("./assets/sounds");
        this.load.audio("mainBG", "spaceEngine_003.ogg");
        this.load.audio("thrusters", "thrusterFire_000.ogg");
        this.load.audio("projFire", "laserSmall_000.ogg");
        this.load.audio("projExplode", "explosionCrunch_002.ogg");
        this.load.audio("enemyDefeat", "explosionCrunch_000.ogg");
        this.load.audio("playerDMG", "forceField_000.ogg");
        

        
        
    }

    init(data) {
        this.globals.projQue = data.projQue;
        this.globals.enemyQue = data.enemyQue,

        this.globals.activeEnemies = data.activeEnemies,
        this.globals.totalActive = data.totalActive,
        this.globals.totalEnemies = data.totalEnemies,
        this.globals.enemyCD = data.enemyCD
        this.globals.storeSpawnCD = data.storeSpawnCD,
        this.globals.enemyTypeRate = data.enemyTypeRate,
        this.globals.totalDestroyed = data.totalDestroyed,

        this.globals.playerHealth = data.playerHealth,
        this.globals.pproj_CD = data.pproj_CD,

        this.globals.level = data.level,
        this.globals.score = data.score,
        this.globals.scoreMult = data.scoreMult
    }

    create(){

        this.pointer = this.input.activePointer;
        let my = this.my;

        my.sprite.player = this.add.sprite(500,400,"player_ship").setScale(1.45);
        this.myScore = this.add.bitmapText(700, 650, 'game_font', "Score " + this.globals.score, 50);
        this.currentLevel = this.add.bitmapText(20, 20, 'game_font', "Level " + this.globals.level, 50);
        this.currentHealth = this.add.bitmapText(700, 700, 'game_font', "Health " + this.globals.playerHealth, 50);
        this.newLevel = this.add.bitmapText(200, 350, 'game_font', "NEW LEVEL", 120);
        this.newLevel.visible = false;
        this.myScore.tint = 0xff0000;


        this.mainBG = this.sound.add("mainBG");
        this.thrusters = this.sound.add("thrusters");

        this.mainBG.play({volume: 0.010, loop: true});

        //this.input.setDefaultCursor("url(assets/graphics/crosshair3.png), pointer");

        //sets controls
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);    
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);        

       
        //spawns player projectile and starts shooting it out
        this.input.on("pointerdown", () => {
            if (this.globals.pproj_CD == 0){
                let p_projpath = new Phaser.Curves.Spline([my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y]);
                const player_projectile = this.add.follower(p_projpath, my.sprite.player.x, my.sprite.player.y, "player_projectile");
                this.globals.projQue.push(player_projectile);
                player_projectile.startFollow({
                    duration: ((Phaser.Math.Distance.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y)) / 800) * 1500, 
                ease: 'Sine.easeOut'
            });
                //console.log(Phaser.Math.Distance.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y));
                this.globals.pproj_CD = 15;
                this.sound.play("projFire", {volume: 0.15});
            }
        })    

        this.anims.create({
            key: "player_p_exp",
            frames: [
                { key: "exp1" },
                { key: "exp2" },
                { key: "exp1" },
                { key: "exp3" },
                { key: "exp4" },
                { key: "exp5" }
            ],
            frameRate: 30, 
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "ship_explode",
            frames: [
                { key: "gas1" },
                { key: "gas2" },
                { key: "gas1" },
                { key: "gas2" },
                { key: "exp2" },
                { key: "exp5" }
            ],
            frameRate: 20, 
            repeat: 0,
            hideOnComplete: true
        });

        this.anims.create({
            key: "player_hit",
            frames: [
                { key: "fire" },
                { key: "gas1" },
                { key: "gas2" },
                { key: "gas1" },
                { key: "fire" },
                { key: "exp5" }
            ],
            frameRate: 50, 
            repeat: 0,
            hideOnComplete: true
        });
    
    }

    update(){
        let my = this.my;

        //TODO: update later so that id doesnt go off screen
        if (this.aKey.isDown) {
            this.thrusters.play({volume: 0.018, loop: true})
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)){my.sprite.player.x -= 13.5}
            
        } else if (this.dKey.isDown) {
            this.thrusters.play({volume: 0.018, loop: true})
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))){my.sprite.player.x += 13.5}
        } else {this.thrusters.stop();}
        


        this.myScore.setText("Score " + Math.round(this.globals.score));
        this.currentHealth.setText("Health " + this.globals.playerHealth, 50);

        //ship points towards where mouse is
        this.globals.rotateLocation = Phaser.Math.Angle.BetweenPoints(my.sprite.player, this.pointer);
        my.sprite.player.rotation = this.globals.rotateLocation + 1.6327325113457007; //offset

        for (let item of this.globals.projQue) {
                //Logic for player projectile
            if (item.texture.key == "player_projectile") {

                //PROJ ENEMY COLLISION
                for (let ship of this.globals.enemyQue) {
                    if (this.collides(item, ship)){
                        //console.log("bullet hit enemy");
                        this.player_p_explosion = this.add.sprite(item.x, item.y, "exp1").setScale(0.65).play("player_p_exp");
                        item.visible = false;
                        this.sound.play("projExplode", {volume: 0.04});
                        this.sound.play("enemyDefeat", {volume: 0.04});
                        this.globals.projQue = this.globals.projQue.filter((BULLET) => BULLET.visible == true); //destroys projectile if it collides early

                        if (this.collides(this.player_p_explosion, ship)){
                            //console.log("explosion hit enemy");
                            ship.visible = false;
                            this.globals.score += (5*this.globals.scoreMult);
                            //console.log(this.globals.score);
                            this.globals.totalDestroyed++;
                            this.sound.play("enemyDefeat", {volume: 0.04});
                            this.enemy_explosion = this.add.sprite(ship.x, ship.y, "gas1").setScale(0.75).play("ship_explode");

                        }
                    } 
                }

                if ((item.path.points[1].x == item.x) && (item.path.points[1].y == item.y)) {

                    this.player_p_explosion = this.add.sprite(item.x, item.y, "exp1").setScale(0.65).play("player_p_exp");
                    item.visible = false;
                    this.sound.play("projExplode", {volume: 0.04});
                    this.globals.projQue = this.globals.projQue.filter((BULLET) => BULLET.visible == true); //destroys projectile once it reaches final dst

                    for (let ship of this.globals.enemyQue) {
                        if (this.collides(this.player_p_explosion, ship)){
                            //console.log("explosion hit enemy");
                            ship.visible = false;
                            this.globals.score += (5*this.globals.scoreMult);
                            //console.log(this.globals.score);
                            this.globals.totalDestroyed++;
                            this.sound.play("enemyDefeat", {volume: 0.04});
                            this.enemy_explosion = this.add.sprite(ship.x, ship.y, "gas1").setScale(0.75).play("ship_explode");
                        }
                    }
                }

                //LOGIC FOR ENEMY PROJECTILE
            } else {
                if (!(item.x <=1080 && item.x >= -20 && item.y >=-20 && item.y <= 830)) {
                    item.visible = false;
                    this.globals.projQue = this.globals.projQue.filter((BULLET) => BULLET.visible == true); //destroys projectile once it reaches final dst
                }



                //ENEMY BULLET COLLISION
                if (this.collides(my.sprite.player, item)){
                    //console.log("enemy bullet hit");
                    this.globals.playerHealth = this.globals.playerHealth - 10;
                    item.x = -100;
                    item.y = -100;
                    item.visible = false;
                    this.globals.projQue = this.globals.projQue.filter((BULLET) => BULLET.visible == true);
                    //console.log(this.globals.playerHealth);
                    this.sound.play("playerDMG", {volume: 0.05});
                    this.player_explosion = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "fire").setScale(0.35).play("player_hit");
                }
            
            }   
        }
            
        
    






        //creating enemies
        if ((this.globals.totalDestroyed < this.globals.totalEnemies) 
        && (this.globals.enemyCD == 0) 
        && (this.globals.totalActive < this.globals.activeEnemies)) {

            //deciding spawn location and pathing for enemy
            const storeSpawnCD = this.globals.enemyCD;
            let randomPath = Math.floor(Math.random() * 3);
            let startX = Math.floor(Math.random() * 750);
            let starty = Math.floor(Math.random() * 2);
            let enemyCurve = null;


            if (starty == 0) {
                let pathing = [[170, 870, 170, -40], [170, 870, 340, -40],[170, 870, 0, -40]];
                enemyCurve = new Phaser.Curves.Spline(pathing[randomPath]);
                enemyCurve.points[0].x += startX;
                enemyCurve.points[1].x += startX;
            } else { 
                let pathing = [[170, -40, 170, 870], [170, -40, 0, 870], [170, -40, 340, 870]];
                enemyCurve = new Phaser.Curves.Spline(pathing[randomPath]);
                enemyCurve.points[0].x += startX;
                enemyCurve.points[1].x += startX;
            }

            let chance = Math.floor(Math. random() * 100) + 1;
            let enemyShip = null;
            if (chance <= this.globals.enemyTypeRate){
                enemyShip = this.add.follower(enemyCurve, enemyCurve.points[0].x, enemyCurve.points[0].y,"enemyB").setScale(1.5);
                enemyShip.startFollow({duration: 1750, rotateToPath: true, rotationOffset: 90});
            } else {
                enemyShip = this.add.follower(enemyCurve, enemyCurve.points[0].x, enemyCurve.points[0].y,"enemyA").setScale(1.5);
                enemyShip.startFollow({duration: 2050, rotateToPath: true, rotationOffset: 90});
            }
            this.globals.enemyQue.push(enemyShip);

            this.globals.totalActive = this.globals.totalActive+1;
            this.globals.enemyCD = this.globals.storeSpawnCD;
        }

        for (let ship of this.globals.enemyQue) {

            //ENEMY SHIP COLLISION
            if (this.collides(my.sprite.player, ship)){
                this.globals.playerHealth = this.globals.playerHealth - 50;
                ship.x = -100;
                ship.y = -100;
                //console.log(this.collides(my.sprite.player, ship))
                //console.log("enemy ship collision");
                ship.visible = false;
                this.globals.enemyQue = this.globals.enemyQue.filter((SHIP) => SHIP.visible == true);
                this.globals.totalActive = this.globals.totalActive-1;
                //console.log(this.globals.playerHealth);
                this.sound.play("enemyDefeat", {volume: 0.04});
                this.sound.play("playerDMG", {volume: 0.05});
                this.player_explosion = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "fire").setScale(0.35).play("player_hit");
            }

            if ((ship.path.points[1].x == ship.x) && (ship.path.points[1].y == ship.y)) {

                this.globals.totalActive = this.globals.totalActive-1;
                ship.visible = false;
                //console.log(this.globals.enemyQue);
                this.globals.enemyQue = this.globals.enemyQue.filter((SHIP) => SHIP.visible == true);
            }

            //console.log((Phaser.Math.Distance.Between(my.sprite.player.x, my.sprite.player.y, this.pointer.x, this.pointer.y)));
            if ((ship.tint == 16777215) && (ship.y <=700) && (ship.y >= 100)){
                //y = mx + b
                let y2 = my.sprite.player.y;
                let x2 = my.sprite.player.x;
                let y1 = ship.y;
                let x1 = ship.x;
                let y_direction = (y2 - y1); //change in y from ship to player
                let x_direction = (x2 - x1); //change in x from ship to player

                //if (my.sprite.player.x - ship.x >= 0) {x_direction = 1080;} else {x_direction = -30;}
                //console.log(x_direction, (m*x_direction)+ship.y);

                let e_projpath = new Phaser.Curves.Spline([ship.x, ship.y, (x2+x_direction*2), (y2+y_direction*2)]);
                const enemy_projectile = this.add.follower(e_projpath, ship.x, ship.y, "enemy_projectile").setScale(0.75);
                enemy_projectile.startFollow({
                    duration: ((Phaser.Math.Distance.Between(enemy_projectile.x, enemy_projectile.y, (x2+x_direction*2), (y2+y_direction*2))) / 800) * 2150});
                this.globals.projQue.push(enemy_projectile);
                ship.tint++;
            }
        }

        //LEVEL SYSTEM
        if (this.globals.totalDestroyed == this.globals.totalEnemies) {
            //console.log("new level!");

            for (let item of this.globals.projQue) {item.visible = false;}
            this.globals.projQue = [];

            for (let ship of this.globals.enemyQue) {ship.visible = false;}
            this.globals.enemyQue = [];


            this.globals.totalDestroyed = 0;
            this.globals.enemyCD = 155;
            this.globals.playerHealth = 100;


            if (this.globals.storeSpawnCD >=10){this.globals.storeSpawnCD -=5};
            if (this.globals.enemyTypeRate <=65){this.globals.enemyTypeRate +=2};
            if (this.globals.activeEnemies <=11){this.globals.activeEnemies +=1};
            if (this.globals.scoreMult <=2){this.globals.scoreMult +=0.1};
            this.globals.totalEnemies += 3;
            this.globals.totalActive = 0;

            this.globals.level++;
            this.currentLevel.setText("Level " + this.globals.level);
            this.newLevel.visible = true;
        }
        if (this.globals.enemyCD == 100) {this.newLevel.visible = false;}
        
        if (this.globals.pproj_CD > 0) {this.globals.pproj_CD--};
        if (this.globals.enemyCD > 0) {this.globals.enemyCD--};

   
        //console.log(this.globals.totalDestroyed);
        //console.log(this.pointer.x + "-" + this.pointer.y);

        if(this.globals.playerHealth <= 0){
            this.scene.stop("maingame");
            this.mainBG.stop();
            this.thrusters.stop();
            this.scene.start("gameover", {
                score: this.globals.score
            });
            //console.log("switched");
        } 




    }



    collides(a, b) {
        if (Math.abs((a.x - 20) - (b.x -20)) > ((a.displayWidth/2 -14) + (b.displayWidth/2)-20)) return false;
        if (Math.abs((a.y - 20) - (b.y -20)) > ((a.displayHeight/2-14)+ (b.displayHeight/2)-20)) return false;
        return true;
    }

}


//THINGS TO FIX IN FUTURE IMPLIMENTATIONS:
// 1) NOT PUTTING ALL CODE IN 1 FILE
// 2) MAKING MORE FUNCTIONS
// 3) PUT LESS BURDEN ON update()
// 4) FIX SOME RANDOM ERRORS
// 5) SPAWNING OF ENEMIES RANDOMLY SLOW DOWN?