export class Util {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
    }

    // returns the translation that gets from the lower left corner to the upper left corner
    lowerLeftOrigin() {
        // Translate origin to lower left corner, facing upward
        let Torigin_to_lower_left = mat3.create(); 
        mat3.fromTranslation(Torigin_to_lower_left, [0, this.canvas.height]); // translate to lower left
        mat3.scale(Torigin_to_lower_left, Torigin_to_lower_left, [1, -1]); // flip around
        return Torigin_to_lower_left;
    }

    // Sets the Canvas transform for further drawing based on the tranform passed in
    setCanvasTransform(Tx) {
        this.context.setTransform(Tx[0], Tx[1], Tx[3], Tx[4], Tx[6], Tx[7]);
    }

    // Sets the Canvas origin to the lower left with positive y going up and positive x going right
    setOriginLowerLeft() {
        this.setCanvasTransform(this.lowerLeftOrigin());
    }
}