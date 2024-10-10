// creates transformation matrix for the ball at each point in time based on parametric equations describing ball's position

export class Trajectory {
    constructor(x, y, speed, angle) {
        this.initialPosition = { x: x, y: y };
        this.vx = speed * Math.cos(angle);
        this.vy = speed * Math.sin(angle);
        this.gravity = -9.8;
    }

    // Returns the location vector at the given time using parametric curves
    getLocation(t) {
        let xpos = this.initialPosition.x + this.vx * t;
        let ypos = this.initialPosition.y + this.vy * t + 0.5 * this.gravity * t * t;
        return [xpos, ypos];
    }

    // Returns the tangent vector at the given time using the derivative of the location curves
    getTangent(t) {
        let xvector = this.vx;
        let yvector = this.vy  + this.gravity * t;
        return [xvector, yvector];
    }
}