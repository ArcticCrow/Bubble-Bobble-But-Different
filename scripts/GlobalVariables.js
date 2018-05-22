// Declare myGame, the object that contains our game's states
let myGame = {
    //Define our game states
    scenes: [],

    // Define common framerate to be referenced in animations
    frameRate: 10,
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
let playerCount = 2;
let p = [{}, {}];
let pConfig = [
    {
        spriteKey: "alien",
        controls: "keyboard",
        mapping: {
            up: "W",
            down: "S",
            left: "A",
            right: "D",
            jump: "W",
            shoot: "SPACE",
            pause: "ESC",
        },
        start: {
            x: 100,
            y: 847
        },
    },
    {
        spriteKey: "bug",
        moveSpeed: 100,
        maxJumpPower: 200,
        maxJumpTime: 10,
        controls: "keyboard",
        mapping: {
            up: "UP",
            down: "DOWN",
            left: "LEFT",
            right: "RIGHT",
            jump: "UP",
            shoot: "INSERT",
            //pause: "ESC",
        },
        /*controls: "gamepad",
        mapping: {
            up: 0,      // h-axis
            down: 0,    // h-axis
            left: 1,    // v-axis
            right: 1,   // v-axis
            jump: "B0", // a-button
            shoot: "B7", // rt
            pause: "B9", // start
        },*/
        start: {
            x: 120,
            y: 847
        }
    }
];
let map;