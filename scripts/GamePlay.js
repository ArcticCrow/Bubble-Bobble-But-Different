let gamePlayState = new Phaser.Class({
    // Define scene
    Extends: Phaser.Scene,
    initialize:
    function GamePlay(){
        Phaser.Scene.call(this, {key: 'GamePlay'});
    },

    create: function() {
        this.sys.install('AnimatedTiles');

        // Add music
        this.setupMusic();

        this.createMap();
        this.createPlayers();
        this.createAnimations();
        this.createControls();
        this.createPhysics();

        // Move foreground elements in front of the player
        this.children.bringToTop(this.foregroundLayer);
        this.children.bringToTop(this.waterLayer);
    },

    setupMusic: function() {
        audioManager.bgm = this.sound.add("bgm1");
        audioManager.bgm.play({
            //config music
        });
    },

    createMap: function() {
        // Create world terrain
        map = this.make.tilemap({key: "map"});

        // Add tile sets
        this.backgroundTiles = map.addTilesetImage("bg");
        this.groundTiles = map.addTilesetImage("tiles");

        // Create background tiles
        this.backgroundLayer = map.createDynamicLayer("Background", this.backgroundTiles, 0, 0);

        // Create background water tiles
        this.backWaterLayer = map.createDynamicLayer("BackgroundWater", this.backgroundTiles, 0, 0);

        // Create ground tiles
        this.groundLayer = map.createDynamicLayer("Ground", this.groundTiles, 0, 0);
        this.groundLayer.setCollisionByExclusion([-1]);

        // Create platform tiles
        this.platformLayer = map.createDynamicLayer("Platforms", this.groundTiles, 0, 0);

        // Create foreground elements
        this.foregroundLayer = map.createDynamicLayer("Foreground", this.groundTiles, 0, 0);

        // Create water tiles
        this.waterLayer = map.createDynamicLayer("Water", this.groundTiles, 0, 0);

        // Init tile animation with plugin for map
        this.sys.animatedTiles.init(map);
    },

    createPlayers: function() {
        p["1"].spriteKey = pConfig["1"].spriteKey;

        // Create p1

        p["1"].sprite = this.physics.add.sprite(pConfig["1"].start.x, pConfig["1"].start.y, "characters",
            p["1"].spriteKey + "/walk0");
        p["1"].sprite.setScale(1);
        let bubble = this.physics.add.sprite(pConfig["1"].start.x, pConfig["1"].start.y, "bullet");

        p["1"]["bullets"] = this.physics.add.group({classType: Bullet, runChildUpdate: true});
    },

    createAnimations: function() {

        // Player animation
        this.anims.create({
            key: "p1_walk",
            frames: this.anims.generateFrameNames('characters', {prefix: p["1"].spriteKey + "/walk", start: 0, end: 3}),
            frameRate: myGame.frameRate,
            repeat: -1
        });
        this.anims.create({
            key: "p1_idle",
            frames: [{key: "characters", frame: p["1"].spriteKey + "/walk0"}],
            frameRate: myGame.frameRate
        });
        this.anims.create({
            key: "p1_death",
            frames: [{key: "characters", frame: p["1"].spriteKey + "/death"}],
            frameRate: myGame.frameRate
        });
    },

    createControls: function() {

        // Reset p["1"].controls to avoid conflicts
        p["1"].controls = {};
        let keys = pConfig["1"].keys;

        // Setup p["1"].controls
        p["1"].controls.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys.up]);
        p["1"].controls.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys.down]);
        p["1"].controls.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys.left]);
        p["1"].controls.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys.right]);
        p["1"].controls.jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys.jump]);
        p["1"].controls.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys.shoot]);



        this.input.keyboard.once('keydown_ESC', function (event) {
            p["1"].sprite.destroy();
            this.anims.remove("p1_walk");
            this.anims.remove("p1_idle");
            this.anims.remove("p1_death");
            p = {1:{}, 2:{}};
            this.scene.start("MainMenu");
        },this);
    },

    createPhysics: function() {
        //p["1"].sprite.setCollideWorldBounds(true);
        this.physics.add.collider(this.groundLayer, p["1"].sprite);
        this.physics.add.collider(this.platformLayer, p["1"].sprite);
        this.physics.add.collider(p["1"].bullets, this.groundLayer, Bullet.pop);

        // Set world boundaries
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;
    },

    update: function(time, delta) {
        // Update objects & variables
        this.checkInput();
        this.physics.world.wrap(p["1"].sprite);
        this.physics.world.wrap(p["1"].bullets);

    },

    checkInput: function() {
        // Player 1 p["1"].controls
        // Handle left and right movement of character
        // TODO sounds
        if (p["1"].controls.left.isDown)
        {
            p["1"].sprite.body.setVelocityX(-pConfig["1"].moveSpeed); // move left
            p["1"].sprite.anims.play("p1_walk", true);
            p["1"].sprite.flipX = true;
        }
        else if (p["1"].controls.right.isDown)
        {
            p["1"].sprite.body.setVelocityX(pConfig["1"].moveSpeed); // move right
            p["1"].sprite.anims.play("p1_walk", true);
            p["1"].sprite.flipX = false;
        }
        else
        {
            p["1"].sprite.body.setVelocityX(0); // stop moving
            p["1"].sprite.anims.play("p1_idle", true);
        }

        this.jump();
        this.shoot();
    },

    shoot: function() {
        if (p["1"].controls.shoot.isDown) {
            if (p["1"].active === false) return;

            let bullet = p["1"].bullets.get().setActive(true).setVisible(true);
            this.children.bringToTop(p["1"].bullets);

            if(bullet) {
                bullet.fire(p["1"].sprite, 1000);
            }
        }
    },

    jump: function() {
        if ((p["1"].controls.jump.isDown || p["1"].controls.up.isDown) && p["1"].sprite.body.onFloor())
        {
            p["1"].sprite.body.setVelocityY(-pConfig["1"].minJumpPower); // jump up
            p["1"].jumpTime = pConfig["1"].maxJumpTime;
        }
        else if ((p["1"].controls.jump.isDown || p["1"].controls.up.isDown) && p["1"].jumpTime > 0) {
            p["1"].sprite.body.setVelocityY((p["1"].sprite.body.velocity.y
                - (((pConfig["1"].maxJumpPower - pConfig["1"].minJumpPower) / pConfig["1"].maxJumpTime)
                * p["1"].jumpTime / pConfig["1"].maxJumpTime)));
            p["1"].jumpTime --;
        }
        else {
            p["1"].jumpTime = 0;
        }

    }
});

// Add scene to list of scenes
myGame.scenes.push(gamePlayState);