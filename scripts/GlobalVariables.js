// Declare myGame, the object that contains our game's states
let myGame = {
    //Define our game states
    scenes: [],

    // Define common framerate to be referenced in animations
    frameRate: 10
};

let audioManager = {
    bgm: undefined,
    marker: 0,
    sfx: {},
    volume: 0.5,
    muteSFX: false,
    muteBGM: false
};

let characters = [
    {key: "alien"},
    {key: "bug"}
];
let p = {
    1: {},
    2: {}
};
let pConfig = {
    1: {
        spriteKey: "alien",
        moveSpeed: 200,
        minJumpPower: 200,
        maxJumpPower: 550,
        maxJumpTime: 10,
        keys: {
            up: "W",
            down: "S",
            left: "A",
            right: "D",
            jump: "W",
            shoot: "SPACE"
        },
        start: {
            x: 100,
            y: 700
        },
        fireRate: 1
    },
    2: {
        spriteKey: "bug",
        moveSpeed: 100,
        maxJumpPower: 200,
        maxJumpTime: 10,
        keys: {
            up: "W",
            down: "S",
            left: "A",
            right: "D",
            jump: "W",
            shoot: "SPACE"
        },
        start: {
            x: 16,
            y: 16
        }
    }
};
let map;