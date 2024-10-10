// manages all of the balls and their launching mechanism whenever the "launch" button is pressed
import { Ball } from "./ball.js";

export class BallManager {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.balls = []
    }

    // shoots a ball by adding it to the list of balls so that it is automatically rendered with all other balls
    addBall(speed, angle) {
        let ball = new Ball(this.canvas, this.context, speed, angle);
        this.balls.push(ball);
    }

    // Updates the time stamps of all the balls then only keeps them around if they are still visible
    updateBalls(dt) {
        this.balls = this.balls.filter(ball => {
            ball.updateTime(dt);
            return ball.couldBeSeen();
        });

        // console.log(`drawing ${this.balls.length} balls`);

    }

    // Draws all of the balls still in the list
    drawBalls() {
        this.balls.forEach(ball => ball.draw());
    }

}