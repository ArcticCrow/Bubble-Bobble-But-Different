let Pickup = new Phaser.Class( {
    Extends: Phaser.GameObjects.Container,

    initialize: function Pickup(scene, position, type, forceDrop = false) {
        // Check if pickup should be dropped
        if (!forceDrop && Phaser.Math.Between(1, 100) > pickupChance) return;

        // If no pickup type
        if (type === undefined) {
            type = this.dropTypeChances[Phaser.Math.Between(0, this.dropTypeChances.length - 1)];
            console.log(type);
        }

        this.pickupType = type;


        let spritesheet = "";
        let frame = 0;
        let tint;

        console.log(position);
        switch (type) {
            case "wep":
                tint = 0xff0000;
                spritesheet = "weapons";
                frame = Phaser.Math.Between(0, this.weaponTypes.length - 1);
                this.weaponType = this.weaponTypes[frame];
                break;
            case "health":
                tint = 0x00ff00;
                spritesheet = "health";
                frame = Phaser.Math.Between(0, 3);
                break;
            case "score":
                tint = 0xffff00;
                spritesheet = "score";
                frame = Phaser.Math.Between(0, this.scoreValues.length - 1);
                this.score = this.scoreValues[frame];
                break;
            case "power":
                tint = 0x0000ff;
                spritesheet = "powers";
                frame = Phaser.Math.Between(0, this.powerTypes.length - 1) + 5;
                this.powerType = this.powerTypes[frame - 5];
                break;
            case "nuke":
                tint = 0x000000;
                spritesheet = "weapons";
                frame = 4;
                break;
        }

        /*let pickup = ;*/

        //if (this.type === "score") pickup.setScale(2);

        Phaser.GameObjects.Container.call(this, scene, position.x, position.y, [
            scene.make.sprite({
                key: "bullet",
            }).setTint(tint).setScale(1.5),
            scene.make.sprite({
                x: 0,
                y: 0,
                key: spritesheet,
                frame: frame
            }, false)
        ]);

        this.setPosition(position.x, position.y);

        console.log(this);
    },

    pickupType: undefined,
    dropTypeChances: [ // 6 in 25 for common, 1 in 25 for nuke
        "wep", "wep", "wep", "wep", "wep", "wep",
        "health", "health", "health", "health", "health", "health",
        "score", "score", "score", "score", "score", "score",
        "power", "power", "power", "power", "power", "power",
        "nuke"
    ],

    ttl: 5000,

    // Health pickup
    restoration: 1,

    // Score pickup
    scoreValues: [
        10,
        50,
        100,
        200,
        500,
        1000,
        2000,
        5000,
        10000,
        20000
    ],
    score: 0,

    // Bubble modifier
    weaponAmmo: 20,
    weaponType: undefined,
    weaponTypes: [ // Ordered after image position in spritesheet for easy selection
        "instant-kill",
        "pierce",
        "homing",
        "multi"
    ],

    // Power up duration
    duration: 5000,
    powerType: undefined,
    powerTypes: [ // Ordered after image position in spritesheet for easy selection
        "rapidFire",
        "speed",
        "regeneration"
    ],

    update: function(time, delta){
        this.ttl -= delta;
        if (this.ttl <= 0) {
            this.destroy();
        }
    }

});