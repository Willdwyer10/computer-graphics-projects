// manages a set of fireflies
let FireflyManager = class FireflyManager {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.fireflies = [];
    }

    // add a new firefly
    addFirefly() {
        // Create new firefly with lifetime between 4 and 10 time units
        let firefly = new Firefly(this.canvas, this.context, Math.random() * 6 + 4);
        this.fireflies.push(firefly);
    }

    // update the inner times of each firefly being managed
    updateFireflies(dt) {
        this.fireflies = this.fireflies.filter(firefly => {
            firefly.updateTime(dt);
            return firefly.shouldRender();
        });
    }

    // draw all fireflies
    drawFireflies() {
        this.fireflies.forEach(firefly => firefly.drawFirefly());
    }

    // draw the trails of the fireflies
    drawTrails(trailLength) {
        this.fireflies.forEach(firefly => firefly.drawTrail(trailLength));
    }
}