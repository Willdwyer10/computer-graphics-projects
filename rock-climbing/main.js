import { HoldManager } from './hold-manager.js';

class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.holdManager = new HoldManager(this.canvas, this.context);
    }

    setup() {
        this.holdManager.createHolds(10);
    }

    draw() {
        this.canvas.width = this.canvas.width; // de facto method to clear canvas
        this.holdManager.drawHolds();

        window.requestAnimationFrame(() => this.draw()); // create animation loop
    }

    run() {
        this.setup();
        this.draw(); // start the animation loop
    }
}

window.onload = () => {
    const app = new App();
    app.run();
}