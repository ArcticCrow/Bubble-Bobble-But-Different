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
        this.speed = 0.5;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
    },

    fire: function(shooter, ttl) {
        this.setPosition(shooter.x, shooter.y);
        this.body.setVelocity(0);

        if (shooter.flipX === true) {
            this.xSpeed = -this.speed;
        } else {
            this.xSpeed = this.speed;
        }
        this.body.velocityY = -1; //this.speed * Math.cos(this.direction);

        this.rotation = shooter.rotation;
        this.ttl = ttl;
    },

    update: function(time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.ttl -= delta;
        if (this.ttl <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }


});