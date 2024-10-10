import { Util} from "./util.js";

export class BackgroundManager {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.util = new Util(this.canvas, this.context);
    }

    drawBackground() {
        this.util.setOriginLowerLeft();
        this.context.fillStyle = "lightblue";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}