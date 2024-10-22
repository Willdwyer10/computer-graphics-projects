let BackgroundManager = class BackgroundManager {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
    }

    // simply draws the background
    drawBackground() {
        this.context.fillStyle = "#001043";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}