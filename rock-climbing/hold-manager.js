import { Jug } from "./holds/jug.js";
import { Pinch } from "./holds/pinch.js";
import { Shelf } from "./holds/shelf.js";
import { Sloper } from "./holds/sloper.js";
import { Volume } from "./holds/volume.js";

export class HoldManager {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.leftHolds = [];
        this.rightHolds = [];
    }

    randomHoldValues(numHolds, index) {
        const holdTypes = [Jug, Pinch, Shelf, Sloper, Volume]; // Different hold classes to use
        const HoldClass = holdTypes[Math.floor(Math.random() * holdTypes.length)]; // Random hold type

        const colorChoices = ["red", "orange", "green", "blue", "purple"]; // Different colors available
        const colorChoice = colorChoices[Math.floor(Math.random() * colorChoices.length)]; // Random color

        const angle = Math.random() * Math.PI*2; // Random angle

        const horizontalPadding = 0.1; // The amount of the width that is padding on the left/right as well as in the middle
        const minX = this.canvas.width * horizontalPadding;
        const maxX = this.canvas.width * (0.5 - horizontalPadding / 2);
        const x = Math.random() * (maxX - minX) + minX; // need it between minX and maxX

        const verticalPadding = 0.05; // The amount of height that pads the bottom and top
        const minYOverall = this.canvas.height * verticalPadding; // The minimum possible y position for any hold
        const maxYOverall = this.canvas.height - minYOverall; // The maximum possible y position for any hold
        const intervalSizeY = (maxYOverall - minYOverall) / numHolds; // the size of each interval a hold could be placed into
        const intervalPadding = intervalSizeY * 0.1; // padding within each hold's box
        const minYInterval = intervalSizeY * index + minYOverall + intervalPadding; // lower range to place the hold
        const maxYInterval = intervalSizeY * (index + 1) + minYOverall - intervalPadding; // upper range to place the hold
        const y = Math.random() * (maxYInterval - minYInterval) + minYInterval;

        return [HoldClass, Math.round(x), Math.round(y), Math.round(angle), colorChoice];
    }

    createHolds(numHolds) {
        if (numHolds < 5 || numHolds > 10) {
            throw new Error("The number of holds must be between 5 and 20");
        }

        // Randomly generate the holds on the left side
        for (let i = 0; i < numHolds; i++) {
            const [HoldClass, x, y, angle, colorChoice] = this.randomHoldValues(numHolds, i);
            const hold = new HoldClass(this.context, x, y, angle, colorChoice);
            this.leftHolds.push(hold);
        }

        // Randomly generate the holds on the right side
        for (let i = 0; i < numHolds; i++) {
            const [HoldClass, x, y, angle, colorChoice] = this.randomHoldValues(numHolds, i);
            const hold = new HoldClass(this.context, x + this.canvas.width / 2, y, angle, colorChoice);
            this.rightHolds.push(hold);
        }

    }

    drawHolds() {
        // polymorphically call the draw methods of each type of hold
        this.leftHolds.forEach(hold => {
            hold.draw();
        });

        this.rightHolds.forEach(hold => {
            hold.draw();
        });
    }
}