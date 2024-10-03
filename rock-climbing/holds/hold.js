export class Hold {
    constructor(context, x, y, angle, color) {
        if (this.constructor === Hold) {
            throw new Error("Abstract class cannot be instantiated.");
        }
        this.context = context;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.color = color;
    }

    draw() {
        throw new Error("Method 'draw(x, y)' should be implemented in derived types.");
    }
}