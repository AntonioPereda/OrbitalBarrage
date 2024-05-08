// Antonio Pereda
// Created: 4/24/2024
// V-5.6.24
// Phaser: 3.70.0
//
//
// TESTING OF A 1D MOVEMENT SYSTEM
// CREATED PROJECT FROM SCRATCH

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 800,
    scene: [mainmenu,maingame,gameover],
    fps: { forceSetTimeOut: true, target: 30 }
}

// Global variable to hold sprites
var my = {sprite: {}};

const game = new Phaser.Game(config);
