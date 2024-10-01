/**
 * Contains utility functions for drawing static objects
 */

/**
 * Draw a straight pipe
 */
function drawStraightPipe(x, y, length, isHorizontal) {
    // Corner radius
    let radius = 10;
    
    // Save the context state
    context.save();

    // We want to make it so the starting coordinate is the middle of the upper left side of the bar
    if (!isHorizontal) {
        context.translate(x + radius, y-radius);
        context.rotate(Math.PI / 2);
    } else {
        context.translate(x-radius, y-radius);
    }
    
    // Set styling
    context.strokeStyle = '#2E12FF';
    context.lineWidth = 4;

    context.beginPath();

    // Top line
    context.moveTo(radius, 0);
    context.lineTo(length - radius, 0);
    // Right bent corner
    context.arcTo(length, 0, length, radius, radius);
    context.arcTo(length, radius * 2, length - radius, radius * 2, radius);
    // Bottom line
    context.lineTo(radius, radius * 2);
    // Left bent corner
    context.arcTo(0, radius * 2, 0, radius, radius);
    context.arcTo(0, 0, radius, 0, radius);

    // Make a line stroke on the path we just made
    context.stroke();

    // Restore the context state
    context.restore(); 
}

/**
 * Draw a "T" shaped pipe
 */
function drawTPipe(x, y, length, fingerLength, isHorizontal, isFlipped) {
    
    let radius = 10; // Corner radius

    let fingerX = length / 2; // Where the finger sticks out from

    context.save(); // Save the context state

    // We want to make it so the starting coordinate is the middle of the upper left side of the bar
    if (!isHorizontal) {
        context.translate(x + radius, y-radius);
        context.rotate(Math.PI / 2);
    } else {
        context.translate(x-radius, y-radius);
    }

    if (isFlipped) context.scale(1, -1); // Flip it over across the "top" of the T
    
    // Set styling
    context.strokeStyle = '#2E12FF';
    context.lineWidth = 4;

    context.beginPath();

    // Top line
    context.moveTo(radius, 0);
    context.lineTo(length - radius, 0);
    // Right bent corner
    context.arcTo(length, 0, length, radius, radius);
    context.arcTo(length, radius * 2, length - radius, radius * 2, radius);
    // Line going out to finger
    context.lineTo(fingerX + radius*2, radius * 2);
    // Arc going down to finger
    context.arcTo(fingerX+radius, radius * 2, fingerX+radius, radius * 3, radius);
    // Line going down to finger
    context.lineTo(fingerX+radius, fingerLength-radius);
    // Arc on finger
    context.arcTo(fingerX+radius, fingerLength, fingerX, fingerLength, radius);
    context.arcTo(fingerX-radius, fingerLength, fingerX-radius, fingerLength-radius, radius);
    // Line coming back from finger
    context.lineTo(fingerX-radius, radius*3);
    // Arc coming back from finger
    context.arcTo(fingerX-radius, radius*2, fingerX - radius*2, radius*2, radius)
    // Bottom line
    context.lineTo(radius, radius * 2);
    // Left bent corner
    context.arcTo(0, radius * 2, 0, radius, radius);
    context.arcTo(0, 0, radius, 0, radius);

    context.stroke(); // Make a line stroke on the path we just made

    context.restore(); // Restore the context state

}

/**
 * Draws the background, including the pipes
 */
function drawBackground() {
    canvas.style.backgroundColor = "black"; // Pac-Man has a black background
   
    drawTPipe(25, 25, 150, 100, true, false); // Upper left T
    drawTPipe(30, 180, 140, 200, false, true); // Lower left T
    drawTPipe(400, 300, 175, 175, true, true); // Lower right T

    drawStraightPipe(170, 150, 250, true); // Horizontal bar in middle
    drawStraightPipe(250, 60, 325, true); // Horizontal bar near top
    drawStraightPipe(310, 215, 120, false); // Vertical bar near bottom

}