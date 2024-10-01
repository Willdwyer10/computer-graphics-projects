/**
 * Handles the setup and animation loop
 */

let canvas, context; // Environmental variables

function setup() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    initPacman();
}

/**
 * Set things up and starts the animation loop
 */
function onLoad() {
    setup();

    function draw() {
        // De facto method for clearing the canvas
        canvas.width = canvas.width

        drawBackground();
        drawPacMan();

        animatePacMan();

        window.requestAnimationFrame(draw);
    }

    draw(); // Call the draw function once, then it will get called in an animation loop
}

window.onload = onLoad;