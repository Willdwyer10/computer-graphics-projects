import { Hold } from "./hold.js";

export class Sloper extends Hold {
    constructor(context, x, y, angle, color) {
        super(context, x, y, angle, color);
    }

    draw() {
        // TODO: make sure this is drawn centered about this.x and this.y
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);

        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.moveTo(0, 0);
        this.context.lineTo(10, 10);
        this.context.lineTo(10, 0);
        this.context.closePath();
        this.context.fill();

        this.context.restore();
    }
}