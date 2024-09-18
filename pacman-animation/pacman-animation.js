function onLoad() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var slider_size = document.getElementById('slider_size')
    slider_size.value = (Number(slider_size.max) + Number(slider_size.min)) / 2; // Set the slider to its halfway point
    var slider_speed = document.getElementById('slider_speed')
    slider_speed.value = (Number(slider_speed.max) + Number(slider_speed.min)) / 2; // Set the slider to its halfway point

    function drawPacManEye() {
        // Set up parameters for the eye's location
        const centerX = 0;
        const centerY = -20;
        const radius = 5;

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
        context.lineWidth = 5; // We want a thick . . .
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

    // Define angle variables for Pac-Man mouth
    var mouthAngleMax = 1/4; // The max angle (fraction of pi)
    var mouthAngleMin = 0.05; // The min angle (fraction of pi)
    var mouthAngle = 1/4; // The current angle of the mouth (fraction of pi)
    var mouthAngleIncreasing = false; // A flag whether the mouth is getting bigger or smaller
    var mouthAngleChangeRate = 0.01; // The rate the mouth opens and closes at

    // Define the limits and rates for Pac-Man moving around
    var pacManPadding = 53;
    var minX = pacManPadding; // The min x value
    var minY = pacManPadding; // The min y value
    var maxX = canvas.width - pacManPadding; // The max x value
    var maxY = canvas.height - pacManPadding; // The max y value
    var currX = 55; // The current x position
    var currY = 55; // The currnet y position
    var isMovingRight = true; // A flag whether Pac-Man is moving right
    var isMovingDown = true; // A flag whether Pac-Man is moving down
    var xChangeRate = 1;
    var yChangeRate = 1;

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

    function draw() {
        // De facto method for clearing the canvas
        canvas.width = canvas.width;
        
        // Move the Pac-Man around
        context.save(); // Save the context before moving
        context.translate(currX, currY); // Move the axes to a different location
        context.scale((isMovingRight ? 1 : -1) * slider_size.value/1000, slider_size.value/1000); // Scale the canvas (and Pac-Man following)

        // Draw the Pac-Man at the continuously-changing mouth angle and potentially changing size 
        drawPacMan(mouthAngle);

        context.restore(); // Restore the context 

        moveMouth(); // Update the variables for moving the mouth

        moveTranslate(); // Update the variables for overall translational movement

        // Set the rates of translational movement based on the slider value
        xChangeRate = slider_speed.value / 1000;
        yChangeRate = slider_speed.value / 800;

        // Request that this function be called over and over again
        window.requestAnimationFrame(draw);
    }

    /*
    function draw() {
        var context = canvas.getContext('2d');
        //context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.width;
        // use the slider to get the position
        var x = slider.value;
        // this actually draws a square
        context.beginPath();
        context.rect(x,y,50,50);
        context.fill();
        y = (y + 2) % 100;
        window.requestAnimationFrame(draw);
       }
      // we don't need an event listener - we'll update all the time
      // slider.addEventListener("input",draw);
      // we don't need to draw - since requestanimationframe does that
      draw();
      */
    //slider_size.addEventListener("input", draw);
    //slider_speed.addEventListener("input", draw);
    draw();
}

window.onload = onLoad;