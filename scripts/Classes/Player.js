let Player = new Phaser.Class( {
    Extends: Phaser.GameObjects.Sprite,

    initialize: function Player(scene) {
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, playerSpriteKey);
    },

    controls: null,
    moveSpeed: null,
    jumpPower: null,
    maxJumpTime: null,
    fireRate: null,


});
