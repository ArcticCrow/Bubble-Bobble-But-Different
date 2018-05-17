var mainMenuState = new Phaser.Class({
    // Define scene
    Extends: Phaser.Scene,
    initialize:
    function MainMenu(){
        Phaser.Scene.call(this, {key: 'MainMenu'});
    },

    create: function() {
        console.log("MainMenu");

        this.cameras.main.setBackgroundColor("#000000");

        this.createCharacterSelection();
    },

    createCharacterSelection: function() {
        var stepWidth = Math.floor((1280 - 160) / characters.length);
        var scale = 2;
        var posX = (16 * scale + stepWidth)/2 + 80;
        var posY = 960/2;
        for(var i = 0; i < characters.length; i++, posX += stepWidth) {
            var key = characters[i].key;
            var char = this.add.sprite(posX, posY, "characters", key + "/walk0");
            char.setScale(scale);
            char.setInteractive();
            char.spriteKey = key;
            char.once("pointerdown", function() {
                playerSpriteKey = this.spriteKey;
                game.scene.start("GamePlay");
            });


        }

        this.input.on('gameobjectover', function (pointer, gameObject) {

            gameObject.setTint(0x7878ff);

        });

        this.input.on('gameobjectout', function (pointer, gameObject) {

            gameObject.clearTint();

        });
    },

    update: function() {
        // Update objects & variables
    }
});

// Add scene to list of scenes
myGame.scenes.push(mainMenuState);