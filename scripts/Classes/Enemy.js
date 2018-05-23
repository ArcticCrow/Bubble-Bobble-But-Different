let Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Enemy(scene, config) {
        Phaser.GameObjects.Sprite.call(this, scene, config.x, config.y, "characters", config.name + "/walk0");
        this.config = config;
        this.name = config.name;

        if (this.scene.anims.get(this.name + "walk") === undefined) {
            //console.log("Creating enemy animation for", config.name + "walk");
            this.scene.anims.create({
                key: this.name + "walk",
                frames: this.scene.anims.generateFrameNames('characters', {prefix: config.name + "/walk",
                    start:0, end:3}),
                frameRate: myGame.frameRate,
                repeat: -1
            }, this);
        }
        if (this.scene.anims.get(this.name + "idle") === undefined) {
            //console.log("Creating enemy animation for", config.name + "idle");
            this.scene.anims.create({
                key: this.name + "idle",
                frames: [{key: "characters", frame: config.name + "/walk0"}],
                frameRate: myGame.frameRate
            });
        }
        if (this.scene.anims.get(config.name + "death") === undefined) {
            //console.log("Creating enemy animation for", config.name + "death");
            this.scene.anims.create({
                key: this.name + "death",
                frames: [{key: "characters", frame: config.name + "/death"}],
                frameRate: myGame.frameRate
            });
        }
    },

    setup: function() {
        this.body.isCircle = true;
        this.setScale(1);
        this.body.setCollideWorldBounds(true);

        this.targets = this.scene.players.children.entries;
        this.playerCollision = this.scene.physics.add.collider(this.targets, this, function(){
            console.log("player was hit!");
        });

        switch (this.name) {
            case "slime":
                this.cooldown = Phaser.Math.Between(2000, 4000);
                this.body.setBounce(1);
                this.move = function(time, delta) {
                    if (this.body.onFloor() && this.cooldown <= 0) {
                        let dir = Phaser.Math.Between(0, 1);
                        dir = (dir === 0)? -1 : 1;
                        //console.log(dir);
                        this.body.setVelocity(this.speed * dir, -this.jumpPower);
                        this.cooldown = Phaser.Math.Between(2000, 4000);
                    } else if (this.body.onFloor()) {
                        this.body.setVelocity(0);
                    }
                    this.cooldown -= delta;
                };
                break;

            case "ghost":
                this.body.setGravityY(-500);

                console.log(this.targets);
                this.move = function(time, delta) {
                    let closestDistance = undefined;
                    for (let i in this.targets) {
                        let target = this.targets[i];
                        let xDist = this.x - target.x;
                        let yDist = this.y - target.y;
                        // noinspection JSSuspiciousNameCombination
                        let absDist = Math.abs(xDist) + Math.abs(yDist);
                        if (closestDistance === undefined || closestDistance > absDist) {
                            closestDistance = absDist;
                            this.currentTarget = target;
                        }
                    }

                    let velocity = new Phaser.Math.Vector2(this.currentTarget.x - this.x,
                        this.currentTarget.y - this.y).normalize().scale(this.speed);
                    this.body.setVelocity(velocity.x, velocity.y);
                };
                console.log(this.scene);
                break;

            case "invert-alien":
                this.body.setBounce(1, 0);
                this.body.setVelocity(this.speed);
                this.move = function(time, delta) {

                };
                break;
        }
    },

    speed: 150,
    jumpPower: 300,

    update: function(time, delta) {
        if (this.move !== undefined) this.move(time, delta);
    }


});