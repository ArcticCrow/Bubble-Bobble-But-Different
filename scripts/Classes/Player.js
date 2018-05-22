let Player = new Phaser.Class( {
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Player(scene, config) {
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "characters",
            config.spriteKey + "/walk0");
        this.setPosition(config.start.x, config.start.y);
        Object.keys(config.mapping).forEach(function(key) {
            this[key] = this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes[config.mapping[key]]
            );
        }, this);
        console.log("Player", config.spriteKey + ":", this);
    },

    setup: function() {
        this.body.isCircle = true;
        this.setScale(1);
    },

    moveSpeed: 200,
    minJumpPower: 200,
    maxJumpPower: 550,
    maxJumpTime: 10,
    fireRate: 1,

    update: function(time, delta) {

    }


});
