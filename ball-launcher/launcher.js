// Draws the launcher at the angle and speed specified by the sliders

import { Util } from "./util.js";

export class Launcher {
    constructor(canvas, context, slider_angle, slider_speed) {
        this.canvas = canvas;
        this.context = context;
        this.util = new Util(this.canvas, this.context);
        this.slider_angle = slider_angle;
        this.slider_speed = slider_speed;
        this.angle = slider_angle.value/1000;
        this.speed = slider_speed.value/10;
    }

    drawFigure() {
        let width = 40;
        let length = this.speed;

        this.context.moveTo(-10, 0);
        this.context.arcTo(-10, width/2, 0, width/2, 20);
        this.context.lineTo(length - 10, width/2);
        this.context.lineTo(length - 10, width/2 - 10);
        this.context.lineTo(length - 14, width/2 - 10);
        this.context.lineTo(length - 14, -width/2 + 10);
        this.context.lineTo(length - 10, -width/2 + 10);
        this.context.lineTo(length - 10, -width/2);
        this.context.lineTo(0, -width/2);
        this.context.arcTo(-10, -width/2, -10, 0, 20);
        this.context.closePath();
        this.context.fillStyle = "black";
        this.context.fill();
    }

    updateValues() {
        this.angle = slider_angle.value/1000;
        this.speed = slider_speed.value/10;
    }

    draw() {
        // Translate origin to lower left corner
        let Torigin_to_lower_left = this.util.lowerLeftOrigin();

        // Translate to the lower left corner, where balls launch from
        let Tlower_left_to_launch_point = mat3.create();
        mat3.fromTranslation(Tlower_left_to_launch_point, [40, 40]); // translate the center of the back to (30, 30) (from lower left axes)

        // Tilt the launcher
        mat3.rotate(Tlower_left_to_launch_point, Tlower_left_to_launch_point, this.angle);

        // Combine the matrices into a single transform
        let Torigin_to_launch_point = mat3.create();
        mat3.multiply(Torigin_to_launch_point, Torigin_to_lower_left, Tlower_left_to_launch_point);

        // Apply the transformations
        this.util.setCanvasTransform(Torigin_to_launch_point);
        
        this.drawFigure();
    }
}