let Player = new Phaser.Class( {
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Player(scene) {

    }
});

let Bullet = new Phaser.Class( {

    Extends: Phaser.GameObjects.Image,

    // Bullet Constructor
    initialize: function Bullet (scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 400;
        this.setSize(5, 5);
    },

    fire: function(shooter, ttl) {
        this.setPosition(shooter.x, shooter.y);

        if (shooter.flipX === true) {
            this.body.setVelocityX(-this.speed);
        } else {
            this.body.setVelocityX(this.speed);
        }
        console.log(this.body);
        //this.body.setVelocityY(-this.speed);
        this.ttl = ttl;
    },

    pop: function(ev) {
        console.log("pop", ev);
    },

    update: function(time, delta) {
        this.ttl -= delta;
        if (this.ttl <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});