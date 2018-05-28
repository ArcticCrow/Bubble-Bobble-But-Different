let Player = new Phaser.Class( {
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Player(scene, name, config) {
        Phaser.GameObjects.Sprite.call(this, scene, config.start.x, config.start.y, config.spriteKey, 1);
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
            frames: this.scene.anims.generateFrameNames(config.spriteKey, {start:1, end:4}),
            frameRate: myGame.frameRate,
            repeat: -1
        }, this);
        this.scene.anims.create({
            key: this.name + "idle",
            frames: [{key: config.spriteKey, frame: 1}, {key: config.spriteKey, frame: 3}, {key: config.spriteKey, frame: 1}],
            frameRate: myGame.frameRate/2,
            repeat: -1,
            repeatDelay:2000
        });
        this.scene.anims.create({
            key: this.name + "death",
            frames: [{key: config.spriteKey, frame: 0}],
            frameRate: myGame.frameRate
        });
    },

    setup: function() {
        this.setScale(1.5);
        this.enemies = this.scene.enemies.children.entries;
        this.scene.physics.add.overlap(this.enemies, this.weapon, function(enemy, bullet) {
            //console.log(this.name + " hit and enemy!", enemy, bullet);
            if (enemy.trappedTime <= 0) {
                enemy.trap(bullet, this.trapTime);
                console.log(1);
            }
        }, null, this);
    },

    takeDamage: function() {
        if (this.invincibleTime < 0) {
            console.log(this.name + " took takeDamage!");
            this.invincibleTime = 1000 * this.invincibility;
            this.health --;
        }

        if (this.health <= 0) {
            console.log(this.name + " is dead");
            this.active = false;
            this.destroy();
            console.log(this);
        }
    },

    name: "noname",
    moveSpeed: 200,
    minJumpPower: 200,
    maxJumpPower: 450,
    maxJumpTime: 10,

    health: 3,
    invincibility: 2.5,
    invincibleTime: 0,

    weapon: undefined,
    fireRate: 2,
    cooldown: 0,
    trapTime: 4,


    update: function(time, delta) {
        this.invincibleTime -= delta;
    }


});
