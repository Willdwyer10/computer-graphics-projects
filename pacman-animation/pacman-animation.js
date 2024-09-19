function onLoad() {
    // Get some components before
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var slider_size = document.getElementById('slider_size')
    slider_size.value = (Number(slider_size.max) + Number(slider_size.min)) / 2; // Set the slider to its halfway point
    var slider_speed_x = document.getElementById('slider_speed_x')
    slider_speed_x.value = (Number(slider_speed_x.max) + Number(slider_speed_x.min)) / 2; // Set the slider to its halfway point
    var slider_speed_y = document.getElementById('slider_speed_y')
    slider_speed_y.value = (Number(slider_speed_y.max) + Number(slider_speed_y.min)) / 2; // Set the slider to its halfway point



    function drawPacManEye() {
        // Set up parameters for the eye's location
        const centerX = 0; // X-coordinate of the center of the eye
        const centerY = -20; // Y-coordinate of the center of the eye
        const radius = 5; // Radius of the eye

        // Set up the coloring
        context.lineWidth = 0; // We don't want an outline
        context.fillStyle = "black"; // Fill it with black

        // Draw the pie shape
        context.beginPath(); // Make sure we isolate this path
        context.moveTo(centerX, centerY);  // Start at the center
        context.arc(centerX, centerY, radius, 0, Math.PI*2);  // Create the full circle
        context.closePath();  // Draw a line back to the center
        context.fill();  // Fill the pie shape
        context.stroke();  // Add an outline
    }

    function drawPacMan(mouthAngle) {
        // Set up parameters for the pie shape
        const centerX = 0;  // X-coordinate of the center of the pie
        const centerY = 0;  // Y-coordinate of the center of the pie
        const radius = 50;   // Radius of the pie
        const startAngle = Math.PI*mouthAngle;  // Starting angle (in radians)
        const endAngle = Math.PI*(2-mouthAngle);  // Ending angle (also in radians)

        // Set up the coloring
        context.lineWidth = 0; // We want a thick . . .
        context.strokeStyle = "black"; // . . . black line around the outside . . .
        context.fillStyle = 'yellow';  // . . . and a yellow Pac-Man!

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

    // Define the limits and rates for Pac-Man moving around
    var pacManPadding = 28 + ((slider_size.value - 500) / (1000-500))*(53-28);
    var minX = pacManPadding; // The min x value
    var minY = pacManPadding; // The min y value
    var maxX = canvas.width - pacManPadding; // The max x value
    var maxY = canvas.height - pacManPadding; // The max y value
    var currX = 55; // The current x position
    var currY = 55; // The currnet y position
    var isMovingRight = true; // A flag whether Pac-Man is moving right
    var isMovingDown = true; // A flag whether Pac-Man is moving down
    var xChangeRate = slider_speed_y.value / 1000; // The speed in x direction
    var yChangeRate = slider_speed_x.value / 1000; // The speed in the y direction

    function moveTranslate() {
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

    // Define angle variables for Pac-Man mouth
    var mouthAngleMax = 1/4; // The max angle (fraction of pi)
    var mouthAngleMin = 0.01; // The min angle (fraction of pi)
    var mouthAngle = 1/4; // The current angle of the mouth (fraction of pi)
    var mouthAngleIncreasing = false; // A flag whether the mouth is getting bigger or smaller
    var mouthAngleChangeRate =  (xChangeRate + yChangeRate) / 100; // The rate the mouth opens and closes at
    
    function moveMouth() {
        if (mouthAngleIncreasing) {
            mouthAngle += mouthAngleChangeRate;
        } else {
            mouthAngle -= mouthAngleChangeRate;
        }

        if (mouthAngle <= mouthAngleMin) {
            mouthAngleIncreasing = true;
        } else if (mouthAngle >= mouthAngleMax) {
            mouthAngleIncreasing = false;
        }
    }

    function drawBarT(x, y, length, fingerLength, isHorizontal, isFlipped) {
        // Corner radius
        var radius = 10;

        // The middle (where the finger sticks out from)
        var fingerX = length / 2;
        
        // Save the context state
        context.save();

        // We want to make it so the starting coordinate is the middle of the upper left side of the bar
        if (!isHorizontal) {
            context.translate(x + radius, y-radius);
            context.rotate(Math.PI / 2);
        } else {
            context.translate(x-radius, y-radius);
        }

        if (isFlipped) {
            context.scale(1, -1);
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
  

        // Make a line stroke on the path we just made
        context.stroke();
    
        // Restore the context state
        context.restore(); 
    }
    
    function drawBar(x, y, length, isHorizontal) {
        // Corner radius
        var radius = 10;
        
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

    function drawBackground() {
        // De facto method for clearing the background
        canvas.width = canvas.width

        // Pac-Man has a black background
        canvas.style.backgroundColor = "black"

        // Upper left T
        drawBarT(25, 25, 150, 100, true, false);

        // Lower left T
        drawBarT(30, 180, 140, 200, false, true);

        // Lower right T
        drawBarT(400, 300, 175, 175, true, true);

        // Horizontal bar in middle
        drawBar(170, 150, 250, true);

        // Horizontal bar near top
        drawBar(250, 60, 325, true);

        // Vertical bar near bottom
        drawBar(310, 215, 120, false);

    }

    function draw() {
        // draw the background before drawing Pac-Man over it
        drawBackground();

        // Draw a simple background before drawing PacMan over it
        var rotation_angle = Math.PI/2 - Math.atan(Number(xChangeRate)/Number(yChangeRate));
        
        // The inverse tangent might return the incorrect sign in some cases,
        // so we need to flip it if it is either moving right and up or left and down
        if(isMovingDown ^ isMovingRight) {
            rotation_angle *= -1;
        }

        // Move the Pac-Man around
        context.save(); // Save the context before moving
        context.translate(currX, currY); // Move the axes to a different location
        context.rotate(rotation_angle);
        context.scale((isMovingRight ? 1 : -1) * slider_size.value/1000, slider_size.value/1000); // Scale the canvas (and draw Pac-Man on scaled canvas following)

        // Draw the Pac-Man at the continuously-changing mouth angle and potentially changing size 
        drawPacMan(mouthAngle);

        context.restore(); // Restore the context 

        moveMouth(); // Update the variables for moving the mouth

        moveTranslate(); // Update the variables for overall translational movement

        // Set the rates of translational movement based on the slider value
        xChangeRate = slider_speed_x.value / 1000;
        yChangeRate = slider_speed_y.value / 1000;

        mouthAngleChangeRate = (xChangeRate + yChangeRate) / 1000;
        
        // Update the bounds of the allowable area so Pac-Man always reaches the edges
        pacManPadding = 25 + ((slider_size.value - 500) / (1000 - 500))*(50-25); // Scale from the range of the slider to the range of padding needed
        minX = pacManPadding; // The min x value
        minY = pacManPadding; // The min y value
        maxX = canvas.width - pacManPadding; // The max x value
        maxY = canvas.height - pacManPadding; // The max y value
        

        // Request that this function be called over and over again
        window.requestAnimationFrame(draw);
    }

    draw();
}

window.onload = onLoad;