let Bullet = new Phaser.Class( {

    Extends: Phaser.GameObjects.Sprite,

    // Bullet Constructor
    initialize: function Bullet (scene) {
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet');
        this.speed = 25;
    },

    fire: function(shooter, ttl) {
        let dir = (shooter.flipX === true) ? - 1 : 1;
        this.setPosition(shooter.x + (shooter.width/2 - 2) * dir, shooter.y);
        this.body.isCircle = true;

        this.body.allowGravity = false;
        this.body.setAccelerationY(-300);
        this.body.velocity = {x: 150 * dir, y: 10};
        this.body.maxVelocity = 200;

        this.ttl = ttl;
    },

    pop: function() {
        this.destroy();
    },

    update: function(time, delta) {
        this.ttl -= delta;
        if (this.ttl <= 0) {
            this.pop();
        }
    }
});