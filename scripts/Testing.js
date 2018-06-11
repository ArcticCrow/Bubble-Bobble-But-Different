let testingState = new Phaser.Class({
    // Define scene
    Extends: Phaser.Scene,
    initialize: function Testing() {
        Phaser.Scene.call(this, {key: 'Testing'});
    },

    setupMusic: function() {
        audioManager.bgm = this.sound.add("bgm1");
        audioManager.bgm.play({
            loop: true,
            volume: .1

        });
    },

    setupScene: function() {
        // Create world terrain
        map = this.make.tilemap({key: "map"});
        this.backgroundTiles = map.addTilesetImage("bg");

        this.backgroundLayer = map.createDynamicLayer("Background", this.backgroundTiles, 0, 0);
        this.backWaterLayer = map.createDynamicLayer("BackgroundWater", this.backgroundTiles, 0, 0);

        this.groundTiles = map.addTilesetImage("tiles");
        this.groundLayer = map.createDynamicLayer("Ground", this.groundTiles, 0, 0);
        this.groundLayer.setCollisionByExclusion([-1]);
        this.platformLayer = map.createDynamicLayer("Platforms", this.groundTiles, 0, 0);
        this.platformLayer.setCollisionByExclusion([-1]);

        //this.sys.animatedTiles.init(map);

        // Create groups here for easier referencing
        this.players = this.physics.add.group({runChildUpdate: true});
        this.enemies = this.physics.add.group({runChildUpdate: true});

        // Create players
        for (let i = 0; i < playerCount; i++) {
            p[i] = new Player(this, "p" + i, pConfig[i]);
            this.players.add(p[i], true);
            p[i].setup();
            p[i]["platformCollision"] = this.physics.add.collider(p[i], this.platformLayer, null, null, this);
        }
        this.physics.add.collider(this.players, this.groundLayer, null, null, this);

        this.platformLayer.forEachTile(function(tile){
            tile.collideDown = false;
            tile.collideRight = false;
            tile.collideLeft = false;
        });

        // Create enemies
        for(let id in map.getObjectLayer("EnemySpawns").objects) {
            let enemy = new Enemy(this, map.getObjectLayer("EnemySpawns").objects[id]);
            this.enemies.add(enemy, true);
            enemy.setup();
            let col = this.physics.add.collider(enemy, [this.groundLayer, this.platformLayer]);
            if (enemy.name === "ghost") col.overlapOnly = true;
            enemy.layerCollison = col;
        }

        // Set world boundaries
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;



        this.children.bringToTop(p[1]);
        this.children.bringToTop(p[0]);
        /*let pads = this.input.gamepads.getAll();
        console.log("connected pads:",pads);*/
    },

    setupUI: function() {
        this.ui = {
            p: [{ // PLAYER 1
                hp: this.add.text(10, 950, "HP: " + p[0].health + "\nPlayer 1", {
                    fontFamily: "Arial",
                    fontSize: 26,
                    color: "#0f8",
                    align: "left"
                }).setStroke('#000', 4).setOrigin(0, 1),

                score: this.add.text(10, 10, "Score:\n000000000", {
                    fontFamily: "Arial",
                    fontSize: 26,
                    color: "#0f8",
                    align: "left"
                }).setStroke('#000', 4).setOrigin(0, 0),
                indicator: this.add.container(p[0].x, p[0].y - 30, [
                    this.make.sprite({key:"indicator"}, true)
                        .setScale(1, 1.2).setTint(0x00ff88),
                    this.make.text({
                        text: "",
                        style: {
                            fontSize: "16px",
                            fontFamily: "Arial",
                            color: "#00AA11",
                            align: "center"
                        }
                    }).setOrigin(0.5, 0.7)
                ]).setAlpha(.8)
            },
            {   // PLAYER 2
                hp: this.add.text(1270, 950, "HP: " + p[1].health + "\nPlayer 2", {
                    fontFamily: "Arial",
                    fontSize: 26,
                    color: "#f50",
                    align: "right"
                }).setStroke('#000', 4).setOrigin(1, 1),
                score: this.add.text(1270, 10, "Score:\n000000000", {
                    fontFamily: "Arial",
                    fontSize: 26,
                    color: "#f50",
                    align: "right"
                }).setStroke('#000', 4).setOrigin(1, 0),
                indicator: this.add.container(p[1].x, p[1].y - 30, [
                    this.make.sprite({key:"indicator"}, true)
                        .setScale(1, 1.2).setTint(0xff5500),
                    this.make.text({
                        text: "",
                        style: {
                            fontSize: "16px",
                            fontFamily: "Arial",
                            color: "#AA1100",
                            align: "center"
                        }
                    }).setOrigin(0.5, 0.7)
                ]).setAlpha(.8)
            }],
            game: {
                levelCounter: this.add.text(1280 / 2, 10, "Level 1", {
                    fontFamily: "Arial",
                    fontSize: 16,
                    color: "#fff",
                    align: "center"
                }).setStroke('#fff', 1).setOrigin(.5, 0),
                score: this.add.text(1280 / 2, 30, "000000000", {
                    fontFamily: "Arial",
                    fontSize: 40,
                    color: "#fff",
                    align: "center"
                }).setStroke('#000', 4).setOrigin(.5, 0)
            }
        };
    },

    create: function() {
        //this.sys.install('AnimatedTiles');

        this.setupMusic();
        this.setupScene();
        this.setupUI();
    },

    move: function(player, time, delta) {
        // Player 1 player.controls
        // Handle left and right movement of character
        // TODO sounds
        if (player.left.isDown) {
            player.body.setVelocityX(-player.moveSpeed); // move left
            player.anims.play(player.name + "walk", true);
            player.flipX = true;
        }
        else if (player.right.isDown) {
            player.body.setVelocityX(player.moveSpeed); // move right
            player.anims.play(player.name + "walk", true);
            player.flipX = false;
        }
        else {
            player.body.setVelocityX(0); // stop moving
            player.anims.play(player.name + "idle", true);
        }

        player.platformCollision.overlapOnly = player.down.isDown;
    },

    shoot: function(player, time, delta) {
        if (Phaser.Input.Keyboard.JustDown(player.shoot) && player.cooldown <= 0) {
            let bullet = player.weapon.get().setActive(true).setVisible(true);
            this.children.bringToTop(player.weapon);

            if(bullet) {
                bullet.fire(player, 3000);
                player.cooldown = 1/player.fireRate * 1000;
            }
        }
        player.cooldown -= delta;
    },

    jump: function(player, time, delta) {
        if ((player.jump.isDown || player.up.isDown) && player.body.onFloor())
        {
            player.body.setVelocityY(-player.minJumpPower); // jump up
            player.jumpTime = player.maxJumpTime;
        }
        else if ((player.jump.isDown || player.up.isDown) && player.jumpTime > 0) {
            player.body.setVelocityY((player.body.velocity.y
                - (((player.maxJumpPower - player.minJumpPower) / player.maxJumpTime)
                    * player.jumpTime / player.maxJumpTime)));
            player.jumpTime --;
        }
        else {
            player.jumpTime = 0;
        }

    },

    updateUI: function() {
        // Update player uis
        for (let i = 0; i < p.length; i++) {
            if (p[i].active) {
                this.ui.p[i].hp.setText("HP: " + p[i].health + "\nPlayer " + (i+1));
                this.ui.p[i].indicator.setPosition(p[i].x, p[i].y - 30);
                this.ui.p[i].score.setText("Score:\n"+ ("000000000" + p[i].score).substr(p[i].score.toString().length, 10));
            } else {
                this.ui.p[i].hp.setText("INSERT COIN\nPlayer " + (i+1));
                this.ui.p[i].indicator.destroy();
            }
        }

        this.ui.game.score.setText(("000000000" + totalScore).substr(totalScore.toString().length, 10));
    },

    update: function(time, delta) {
        // Run ui updates
        this.updateUI();
        this.physics.world.wrap(this.enemies);

        // No players left alive
        if (this.players.countActive(true) <= 0) {
            this.gameOver();
            return;
        }
        // Handle player input
        // TODO outsource to player class
        for (let i = 0; i < p.length; i++) {
            if (p[i].active) {
                this.move(p[i], time, delta);
                this.jump(p[i], time, delta);
                this.shoot(p[i], time, delta);
                this.physics.world.wrap(p[i]);
            }
        }
    },

    gameOver: function() {
        console.log("Both players are dead. The game is over!");
    }
});

// Add scene to list of scenes
myGame.scenes.push(testingState);