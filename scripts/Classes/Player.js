let Player = new Phaser.Class( {
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Player(scene, name, config) {
        Phaser.GameObjects.Sprite.call(this, scene, config.start.x, config.start.y, "characters",
            config.spriteKey + "/walk0");
        this.name = name;

        // register keys for player interaction
        Object.keys(config.mapping).forEach(function(key) {
            this[key] = this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes[config.mapping[key]]
            );
        }, this);

        // add weapon
        this.weapon = this.scene.physics.add.group({
            classType: Bullet,
            maxSize: 20,
            runChildUpdate: true
        });

        // add animations
        this.scene.anims.create({
            key: this.name + "walk",
            frames: this.scene.anims.generateFrameNames('characters', {prefix: config.spriteKey + "/walk",
            start:0, end:3}),
            frameRate: myGame.frameRate,
            repeat: -1
        }, this);
        this.scene.anims.create({
            key: this.name + "idle",
            frames: [{key: "characters", frame: config.spriteKey + "/walk0"}],
            frameRate: myGame.frameRate
        });
        this.scene.anims.create({
            key: this.name + "death",
            frames: [{key: "characters", frame: config.spriteKey + "/death"}],
            frameRate: myGame.frameRate
        });
    },

    setup: function() {
        this.body.isCircle = true;
        this.setScale(1.2);
    },
    name: "noname",
    moveSpeed: 200,
    minJumpPower: 200,
    maxJumpPower: 800,
    maxJumpTime: 10,
    fireRate: 1,
    health: 3,
    invincibility: 1,

    weapon: undefined,
    cooldown: 0,


    update: function(time, delta) {

    }


});
