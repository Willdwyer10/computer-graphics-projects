import { BackgroundManager } from "./background-manager.js";
import { BallManager } from "./ball-manager.js";
import { Launcher } from "./launcher.js";

class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.backgroundManager = new BackgroundManager(this.canvas, this.context);
        this.ballManager = new BallManager(this.canvas, this.context);
        this.launcher = new Launcher(this.canvas, this.context, document.getElementById('slider_angle'), document.getElementById('slider_speed'));
        this.launchButton = document.getElementById('button_launch');
    }

    setup() {
        // Whenever the launch button is pressed, add a new ball which will immediately begin rendering!
        this.launchButton.addEventListener('click', () => {
            const angle = document.getElementById('slider_angle').value / 1000;
            const speed = document.getElementById('slider_speed').value / 10;
            this.ballManager.addBall(speed, angle); // Launch new ball
        });
    }

    draw() {
        this.canvas.width = this.canvas.width; // de facto method to clear canvas
        
        this.backgroundManager.drawBackground();
        
        this.ballManager.updateBalls(0.15);
        this.ballManager.drawBalls();

        this.launcher.updateValues();
        this.launcher.draw();

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