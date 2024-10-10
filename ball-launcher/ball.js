// Holds information about a ball and draws this singular ball
import { Trajectory } from "./trajectory.js";
import { Util } from "./util.js";

export class Ball {
    constructor(canvas, context, speed, angle) {
        this.canvas = canvas;
        this.context = context;
        this.util = new Util(this.canvas, this.context);
        this.trajectory = new Trajectory(40, 40, speed, angle);

        this.radius = 15; // Arbitrary ball radius, could become a parameter in future
        this.time = 0; // Time since launch
    }

    // Updates the time which is used to determine the location on the trajectory
    updateTime(dt) {
        this.time += dt;
    }

    // Draws the orange circle representing the ball
    drawCircle() {
        this.context.beginPath();
        this.context.arc(0, 0, this.radius, 0, 2*Math.PI);
        this.context.fillStyle = "orange";
        this.context.fill();
        this.context.strokeStyle = "black";
        this.context.stroke();
    }

    // Draws the lines on the ball
    drawLines() {
        // Draw the vertical line
        this.context.beginPath();
        this.context.moveTo(0, this.radius);
        this.context.lineTo(0, -this.radius);
        
        // Draw the horizontal line
        this.context.moveTo(this.radius, 0);
        this.context.lineTo(-this.radius, 0);


        // Set the stroke style and stroke the lines and arcs
        this.context.strokeStyle = "black";
        this.context.stroke();
    }

    draw() {
        // Translate origin to lower left corner, facing upward
        let Torigin_to_lower_left = this.util.lowerLeftOrigin();
    
        // Translate to the location of the ball
        let Tlower_left_to_ball_pos = mat3.create();
        mat3.fromTranslation(Tlower_left_to_ball_pos, this.trajectory.getLocation(this.time));

        // // Rotate the ball so it faces along the trajectory
        let [xvector, yvector] = this.trajectory.getTangent(this.time);
        let angle = Math.atan2(yvector, xvector);
        mat3.rotate(Tlower_left_to_ball_pos, Tlower_left_to_ball_pos, angle);

        // Combine the matrices so the ball is located on the trajectory at the correct angle
        let Torigin_to_ball_pos = mat3.create();
        mat3.multiply(Torigin_to_ball_pos, Torigin_to_lower_left, Tlower_left_to_ball_pos);

        // Apply the transformations
        this.util.setCanvasTransform(Torigin_to_ball_pos);

        // Finally, draw the ball itself (consisting of lines and )
        this.drawCircle();
        this.drawLines();
    }

    // Whether this ball has potential to fall back onto the screen or not
    couldBeSeen() {
        let [xpos, ypos] = this.trajectory.getLocation(this.time);
        return xpos - this.radius < this.canvas.width && ypos + this.radius > 0;
    }
}