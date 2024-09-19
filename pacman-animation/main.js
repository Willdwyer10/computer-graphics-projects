/**
 * Handles the setup and animation loop
 */

var canvas, context; // Environmental variables

function setup() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    initUtils(canvas, context);
    initPacman(canvas, context);
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