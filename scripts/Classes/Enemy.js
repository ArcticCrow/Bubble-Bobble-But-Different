let Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Enemy(scene, config) {
        Phaser.GameObjects.Sprite.call(this, scene, config.x, config.y, config.type, 1);
        this.config = config;
        this.name = config.type;
        this.type = config.name;

        if (this.scene.anims.get(this.name + "walk") === undefined) {
            //console.log("Creating enemy animation for", config.name + "walk");
            this.scene.anims.create({
                key: this.name + "walk",
                frames: this.scene.anims.generateFrameNames(this.name, {start:2, end:4})
                    .concat({key:this.name, frame: "3"}),
                frameRate: myGame.frameRate,
                repeat: -1
            }, this);
        }
        if (this.scene.anims.get(this.name + "idle") === undefined) {
            this.scene.anims.create({
                key: this.name + "idle",
                frames: [{key: this.name, frame: 1}, {key: this.name, frame: 3}, {key: this.name, frame: 1}],
                frameRate: myGame.frameRate/2,
                repeat: -1,
                repeatDelay:2000
            });
        }
        if (this.scene.anims.get(this.name + "death") === undefined) {
            //console.log("Creating enemy animation for", config.name + "death");
            this.scene.anims.create({
                key: this.name + "death",
                frames: [{key: this.name, frame: 0}],
                frameRate: myGame.frameRate
            });
        }
    },

    setup: function() {
        this.setScale(1.8);

        this.targets = this.scene.players.children.entries;
        this.playerCollision = this.scene.physics.add.overlap(this.targets, this, function(player , enemy){
            if (this.trappedTime <= 0) {
                player.takeDamage();
            } else {
                if (enemy.body.touching.up) {
                    player.body.velocity.y = -player.minJumpPower;
                    this.takeDamage(player);
                }
            }
        }, null, this);

        switch (this.type) {
            case "patrol":
                this.value = 100;

                this.body.setVelocity(this.speed);
                this.body.setBounce(1, 0);
                this.move = function(time, delta) {
                    this.anims.play(this.name + "walk", true);
                    if (this.body.velocity.x > 0) {
                        this.flipX = false;
                    }
                    else if (this.body.velocity.x < 0) {
                        this.flipX = true;
                    }
                };
                break;

            case "jumper":
                this.value = 200;

                this.cooldown = Phaser.Math.Between(2000, 4000);
                this.body.setBounce(1);
                this.move = function(time, delta) {
                    if (this.body.onFloor() && this.cooldown <= 0) {
                        let dir = Phaser.Math.Between(0, 1);
                        this.flipX = !dir;
                        dir = (dir === 0)? -1 : 1;
                        this.body.setVelocity(this.speed * dir, -this.jumpPower);
                        this.cooldown = Phaser.Math.Between(1000, 2500);
                        this.anims.play(this.name + "walk", true);
                    } else if (this.body.onFloor()) {
                        this.body.setVelocity(0);
                        this.anims.play(this.name + "idle", true);
                    }
                    this.cooldown -= delta;
                };
                break;

            case "chaser":
                this.value = 300;

                this.body.allowGravity = false;

                this.move = function(time, delta) {
                    if (this.targets.length <= 0) {
                        this.body.setVelocity(0);
                        this.anims.play(this.name + "idle", true);
                        return;
                    }
                    let closestDistance = undefined;
                    for (let i in this.targets) {
                        let target = this.targets[i];
                        let xDist = this.x - target.x;
                        let yDist = this.y - target.y;
                        // noinspection JSSuspiciousNameCombination
                        let absDist = Math.abs(xDist) + Math.abs(yDist);
                        if (closestDistance === undefined || closestDistance > absDist) {

                            this.anims.play(this.name+"walk", true);

                            closestDistance = absDist;

                            // make enemy face and chase player
                            this.currentTarget = target;
                            this.flipX = xDist > 0;
                        }
                    }

                    let velocity = new Phaser.Math.Vector2(this.currentTarget.x - this.x,
                        this.currentTarget.y - this.y).normalize().scale(this.speed);
                    this.body.setVelocity(velocity.x, velocity.y);
                };
                break;
        }
    },

    trap: function(bullet, trapTime) {

        this.trapBullet = bullet;
        this.trapBullet.body.enable = false;
        this.trapBullet.body.moves = false;
        this.trapBullet.ttl = trapTime * 1000;
        this.trapBullet.setPosition(this.body.position.x + this.body.width/2, this.body.position.y + this.body.height/2);
        this.trapBullet.setScale(1.7);

        this.trappedTime = trapTime * 1000;
        this.body.moves = false;
    },

    takeDamage: function(player) {
        this.health--;
        if (this.health <= 0) {

            player.addScore(this.value);

            new Pickup(this.scene, this.body.center);

            this.destroy();
            if (this.trapBullet !== undefined) {
                this.trapBullet.destroy();
            }
        }
    },

    value: 0,
    speed: 150,
    jumpPower: 300,
    trappedTime: 0,
    health: 1,

    update: function(time, delta) {
        if (this.trappedTime > 0) {
            // float upwards
            this.anims.play(this.name + "idle", true);

        }
        else if (this.move !== undefined) {
            this.body.moves = true;
            this.move(time, delta);
        }
        this.trappedTime -= delta;
    }


});