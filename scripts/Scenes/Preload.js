let preloadState = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function Preload(){
        Phaser.Scene.call(this, {
            key: 'Preload',
            pack: {
                files: [
                    {type: "image", key: "loading-bar", url: "./assets/ui/loading-bar.png"},
                    {type: "image", key: "loading-bar-progress", url: "./assets/ui/loading-bar-progress.png"},
                    {type: "spritesheet", key: "alien", url: "./assets/alien.png",
                        frameConfig: {frameWidth: 20, frameHeight:22}},
                    {type: "spritesheet", key: "button-small", url: "./assets/ui/button-small.png",
                        frameConfig: {frameWidth: 63, frameHeight: 28}}
                ]
            }
        });
    },

    setupLoadingScreen: function() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        let loadingBar = this.add.image(width/2, height/2, "loading-bar")
            .setOrigin(0.5, 0.5).setScale(3);
        let loadingBarProgress = this.add.image(width/2, height/2, "loading-bar-progress")
            .setOrigin(0.5, 0.5).setScale(0, 3);

        this.mascot = this.make.sprite({
            key: "alien",
            frame: "1",
            x: width / 2,
            y: height / 2 - 40
        }, true).setOrigin(0.5, 1).setScale(10, 10);
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNames("alien", {start:2, end:4}).concat({key: "alien", frame: "3"}),
            frameRate: myGame.frameRate,
            repeat: -1
        }, this);
        this.mascot.play("walk", true);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            loadingBarProgress.setScale(value * 3, 3);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading ' + file.type + ': ' + file.url.substring(file.url.lastIndexOf("/") + 1));
        });

        this.load.on('complete', function () {
            /*loadingBarProgress.destroy();
            loadingBar.destroy();*/
            percentText.setText("Loading complete");
            assetText.destroy();
        });
    },

    loadAssets: function() {
        this.load.setPath("assets/");

        this.load.atlas("characters", "characters.png", "characters.json");
        //this.load.spritesheet("alien", "alien.png", {frameWidth: 20, frameHeight:22});
        this.load.spritesheet("bug", "bug.png", {frameWidth: 20, frameHeight:22});
        this.load.spritesheet("computer", "computer.png", {frameWidth: 20, frameHeight:22});
        this.load.spritesheet("ghost", "ghost.png", {frameWidth: 20, frameHeight:22});
        this.load.spritesheet("nautilus", "nautilus.png", {frameWidth: 20, frameHeight:22});
        this.load.spritesheet("owl", "owl.png", {frameWidth: 20, frameHeight:22});
        this.load.spritesheet("robot", "robot.png", {frameWidth: 20, frameHeight:22});
        this.load.spritesheet("slime", "slime.png", {frameWidth: 20, frameHeight:22});

        this.load.tilemapTiledJSON("map", "map.json");
        this.load.spritesheet("tiles", "tiles.png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("bg", "tiles-bg.png", {frameWidth: 32, frameHeight: 32});
        this.load.image('bullet', 'bubble.png');
        this.load.image('indicator', 'indicator.png');

        this.load.setPath("assets/pickups/");
        this.load.spritesheet("weapons", "powerup.png", {frameWidth: 32, frameHeight: 32, startFrame:0, endFrame: 4});
        this.load.spritesheet("powers", "powerup.png", {frameWidth: 32, frameHeight: 32, startFrame:5, endFrame: 7});
        this.load.spritesheet("health", "pickups.png", {frameWidth: 32, frameHeight: 32, startFrame:0, endFrame: 3});
        this.load.spritesheet("score", "score.png", {frameWidth: 16, frameHeight: 16});
    },

    loadAudio: function() {
        this.load.setPath("assets/audio/music/");
        this.load.audio("bgm1", ["bgm1.mp3"]);
        this.load.audio("bgm2", ["bgm2.mp3"]);
        this.load.audio("bgm3", ["bgm3.mp3"]);
        this.load.audio("menu1", ["menu1.mp3"]);
        this.load.audio("menu2", ["menu2.mp3"]);
        this.load.audio("loose1", ["loose1.mp3"]);
        this.load.audio("win1", ["win1.mp3"]);

        this.load.setPath("assets/audio/sfx/");
    },

    loadPlugins: function () {
        this.load.setPath("scripts/Plugins/");
        this.load.plugin("AnimatedTiles", "AnimatedTiles.min.js");
    },

    loadClasses: function() {
        this.load.setPath("scripts/Classes/");
        this.load.script("Bullet", "Bullet.js");
        this.load.script("Enemy", "Enemy.js");
        this.load.script("Pickup", "Pickup.js");
        this.load.script("Player", "Player.js");
    },

    loadScenes: function() {
        this.load.setPath("scripts/Scenes/");
        this.load.script("MainMenu", "MainMenu.js");
        this.load.script("GamePlay", "Testing.js");

    },

    preload: function() {
        this.setupLoadingScreen();

        this.load.setBaseURL("./");

        this.loadClasses();
        this.loadScenes();
        this.loadPlugins();
        this.loadAssets();
        this.loadAudio();
    },

    registerScenes: function() {
        game.scene.add("MainMenu", mainMenuState, false);
        game.scene.add("Testing", testingState, false);
    },

    create: function() {
        console.log("Preload completed");

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        this.registerScenes();

        let playButton = this.make.sprite({
            key: "button-small",
            frame: 0,
            x: width/2,
            y: height / 2 + 100
        }).setOrigin(0.5, 0.5).setScale(3, 3);

        let playText = this.make.text({
            x: width / 2,
            y: height / 2 + 100,
            text: 'LAUNCH',
            style: {
                fontSize: '30px',
                fontFamily: myGame.primaryFont,
                fontStyle: 'bold',
                fill: '#000'
            }
        }, true).setOrigin(0.5, 0.5);
        console.log(playText);

        playButton.setInteractive();
        playButton.on('pointerover', function (event) {
            playButton.setFrame(2);
            playText.setColor("#F80");
            this.mascot.anims.stop();
            this.mascot.setFrame(1);
        }, this);
        playButton.on('pointerout', function (event) {
            playButton.setFrame(0);
            playText.setColor("#000");
            this.mascot.play("walk", true);
        }, this);
        playButton.on('pointerdown', function() {
            playButton.setFrame(1);
            game.scene.start('Testing');
            this.mascot.setFrame(0);
            playButton.destroy();
        }, this);
    }
});

// Add scene to list of scenes
myGame.scenes.push(preloadState);