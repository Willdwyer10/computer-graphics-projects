/**
 * Contains functions related to drawing and moving Pac-Man
 */

var canvas, context; // Environmental variables

var slider_size, slider_speed_x, slider_speed_y; // Slider objects

var pacManPadding, minX, minY, maxX, maxY, currX, currY, isMovingRight, isMovingDown, xChangeRate, yChangeRate; // Variables for Pacman translational movements

var mouthAngleMax, mouthAngleMin, mouthAngle, mouthAngleIncreasing, mouthAngleChangeRate; // Variables for Pacman mouth

/**
 * Initialize the environemental variables and all of the variables enabling translational, rotational, and mouth movements
 */
function initPacman(canvasIn, contextIn) {
    canvas = canvasIn;
    context = contextIn;

    slider_size = document.getElementById('slider_size')
    slider_size.value = (Number(slider_size.max) + Number(slider_size.min)) / 2; // Set the slider to its halfway point

    slider_speed_x = document.getElementById('slider_speed_x')
    slider_speed_x.value = (Number(slider_speed_x.max) + Number(slider_speed_x.min)) / 2; // Set the slider to its halfway point

    slider_speed_y = document.getElementById('slider_speed_y')
    slider_speed_y.value = (Number(slider_speed_y.max) + Number(slider_speed_y.min)) / 2; // Set the slider to its halfway point

    // Define the limits and rates for Pac-Man moving around
    pacManPadding = 28 + ((slider_size.value - 500) / (1000-500))*(53-28);
    minX = pacManPadding; // The min x value
    minY = pacManPadding; // The min y value
    maxX = canvas.width - pacManPadding; // The max x value
    maxY = canvas.height - pacManPadding; // The max y value
    currX = 55; // The current x position
    currY = 55; // The currnet y position
    isMovingRight = true; // A flag whether Pac-Man is moving right
    isMovingDown = true; // A flag whether Pac-Man is moving down
    xChangeRate = slider_speed_y.value / 1000; // The speed in x direction
    yChangeRate = slider_speed_x.value / 1000; // The speed in the y direction

    // Define angle variables for Pac-Man mouth
    mouthAngleMax = 1/4; // The max angle (fraction of pi)
    mouthAngleMin = 0.01; // The min angle (fraction of pi)
    mouthAngle = 1/4; // The current angle of the mouth (fraction of pi)
    mouthAngleIncreasing = false; // A flag whether the mouth is getting bigger or smaller
    mouthAngleChangeRate =  (xChangeRate + yChangeRate) / 100; // The rate the mouth opens and closes at
}

/**
 * Draw Pac-Man's eye
 */
function drawPacManEye() {
    // Set up parameters for the eye's location
    const centerX = 0; // X-coordinate of the center of the eye
    const centerY = -20; // Y-coordinate of the center of the eye
    const radius = 5; // Radius of the eye

    // Set up the styling
    context.fillStyle = "black"; // Fill it with black

    // Draw the pie shape
    context.beginPath(); // Make sure we isolate this path
    context.moveTo(centerX, centerY);  // Start at the center
    context.arc(centerX, centerY, radius, 0, Math.PI*2);  // Create the full circle
    context.closePath();  // Draw a line back to the center
    context.fill();  // Fill the pie shape
    context.stroke();  // Add an outline
}

/**
 * Draw Pacman after adjusting the context to correct translation, rotation, and scale
 */
function drawPacMan() {
    // Find the angle Pac-Man should be rotated to
    var rotation_angle = Math.atan(Number(yChangeRate)/Number(xChangeRate)); // Angle of right triangle with base xChangeRate, height yChangeRate
    if(isMovingDown ^ isMovingRight) rotation_angle *= -1; // Correct the sign when moving up-right or down-left
    
    // Move Pac-Man around by changing the context
    context.save(); // Save the context before moving

    context.translate(currX, currY); // Move the axes to a appropriate location
    context.rotate(rotation_angle); // Rotate Pacman to chomp in direction of movement
    context.scale((isMovingRight ? 1 : -1) * slider_size.value/1000, slider_size.value/1000); // Scale the canvas, flip horizontally when moving left

    drawPacManInternal(); // Draw the Pac-Man at the continuously-changing mouth angle and potentially changing size 

    context.restore(); // Restore the context 
}

/**
 * Draw Pac-Man at the current context (translation, rotation, and scaling) with the mouth at designated angle
 */
function drawPacManInternal() {

    // Set up parameters for the pie shape
    const centerX = 0;  // X-coordinate of the center of the pie
    const centerY = 0;  // Y-coordinate of the center of the pie
    const radius = 50;   // Radius of the pie
    const startAngle = Math.PI*mouthAngle;  // Starting angle (in radians)
    const endAngle = Math.PI*(2-mouthAngle);  // Ending angle (also in radians)

    // Set up the styling
    context.fillStyle = 'yellow';  // A yellow Pac-Man!

    // Draw the pie shape
    context.beginPath(); // Make sure we isolate this path
    context.moveTo(centerX, centerY);  // Start at the center
    context.arc(centerX, centerY, radius, startAngle, endAngle);  // Create the arc
    context.closePath();  // Draw a line back to the center
    context.fill();  // Fill the pie shape
    context.stroke();  // Add an outline

    // Draw the eye on top of it
    drawPacManEye();
}

/**
 * Handles translational movements, including bouncing off the walls
 */
function movePacMan() {
    // Set the rates of translational movement based on the slider value
    xChangeRate = slider_speed_x.value / 1000;
    yChangeRate = slider_speed_y.value / 1000;

    
    // Update the bounds of the allowable area so Pac-Man always reaches the edges
    pacManPadding = 25 + ((slider_size.value - 500) / (1000 - 500))*(50-25); // Scale from the range of the slider to the range of padding needed
    minX = pacManPadding; // The min x value
    minY = pacManPadding; // The min y value
    maxX = canvas.width - pacManPadding; // The max x value
    maxY = canvas.height - pacManPadding; // The max y value

    if (isMovingRight) {
        currX += xChangeRate;
    } else {
        currX -= xChangeRate;
    }

    if (isMovingDown) {
        currY += yChangeRate;
    } else {
        currY -= yChangeRate;
    }

    if (currX >= maxX) {
        isMovingRight = false;
    } else if (currX <= minX) {
        isMovingRight = true;
    }

    if (currY >= maxY) {
        isMovingDown = false;
    } else if (currY <= minY) {
        isMovingDown = true;
    }
}

/**
 * Handles mouth movement, opening and closing repeatedly
 */
function updateMouth() {
    mouthAngleChangeRate = (xChangeRate + yChangeRate) / 1000; // Change the mouth movement speed proportional to translational speed
    
    if (mouthAngleIncreasing) {
        mouthAngle += mouthAngleChangeRate;
    } else {
        mouthAngle -= mouthAngleChangeRate;
    }

    if (mouthAngle <= mouthAngleMin || mouthAngle >= mouthAngleMax) {
        mouthAngleIncreasing = ~mouthAngleIncreasing;
    }
}

/**
 * Calls other functions internally 
 */
function animatePacMan() {
    movePacMan(); // Move Pac-Man around, bouncing off walls and such
    updateMouth(); // Move Pac-Man's mouth open and close
}