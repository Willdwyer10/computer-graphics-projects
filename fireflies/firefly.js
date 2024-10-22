// represents a single firefly and abstracts away details regarding
// this firefly's path and drawing details
let Firefly = class Firefly {
    constructor(canvas, context, lifetime) {
        this.canvas = canvas;
        this.context = context;
        this.lifetime = lifetime;
        this.curveManager = new CurveManager(this.canvas, this.context, this.lifetime);
        this.t = 0;
    }

    // update the timestamp of this firefly
    updateTime(dt) {
        this.t += dt;
    }

    // whether this firefly should be rendered still
    shouldRender() {
        return this.t < this.lifetime;
    }
    
    // returns the transparency value for the light part of the firefly
    // such that the rendering fades in and out and has a sort of flicker effect in the middle
    getBodyAlpha() {
        // we want it to fade in linearly for the first 1.5 time units
        if (this.t < 1.5) {
            return this.t / 1.5;
        }

        // and fade out for the last 1.5 time units
        if (this.lifetime - this.t < 1.5) {
            return (this.lifetime - this.t) / 1.5;
        }

        // and in the middle, return random values between 0.6 and 1 to give a flickering effect
        return Math.random()*0.4 + 0.6;
    }

    // returns the transparency value for the trail
    // such that the rendering fades in and out
    getTrailAlpha() {
        // we want it to fade in linearly for the first 1.5 time units
        if (this.t < 1.5) {
            return this.t / 1.5;
        }

        // and fade out for the last 1.5 time units
        if (this.lifetime - this.t < 1.5) {
            return (this.lifetime - this.t) / 1.5;
        }

        // and in the middle, make it mostly opaque
        return 1;
    }

    // draws the firefly itself
    drawFirefly() {
        /* some local variables for controlling different sizes and such on the firefly */
        let radius = 6;
        let headSize = 0.5;

        /* get the firefly into position */
        this.context.save();
        let currPosition = this.curveManager.getPosition(this.t);
        let currTangent = this.curveManager.getTangent(this.t);
        this.context.translate(currPosition[0], currPosition[1]);
        this.context.rotate(Math.atan2(currTangent[1], currTangent[0]) - Math.PI/2);

        /* now, onto drawing */
        this.context.beginPath();

        // light up part
        this.context.strokeStyle = `rgba(0, 0, 0, ${this.getTrailAlpha()})`; // black outline around light up area
        this.context.fillStyle = `rgba(187, 255, 73, ${this.getBodyAlpha()})`;
        this.context.arc(0, 0, radius, 0, Math.PI*2);
        this.context.fill();
        this.context.stroke();

        // body
        this.context.strokeStyle = `rgba(255, 255, 255, ${this.getTrailAlpha()})`;
        this.context.fillStyle = `rgba(0, 0, 0, ${this.getTrailAlpha()})`;
        this.context.beginPath();
        this.context.moveTo(radius, 0);
        this.context.arcTo(radius*headSize, radius * 3, 0, radius * 3, radius*headSize);
        this.context.arcTo(-radius*headSize, radius*3, -radius, 0, radius*headSize);
        this.context.lineTo(-radius, 0);
        this.context.arcTo(0, radius*10, radius, 0, radius);
        this.context.closePath();
        this.context.fill();
        // this.context.stroke();

        // antennas
        this.context.strokeStyle = `rgba(0, 0, 0, ${this.getTrailAlpha()})`; // black line...
        this.context.lineWidth = 3; // ...that is thick
        this.context.fillStyle = `rgba(0, 0, 0, ${0})`; // no fill
        this.context.beginPath();
        // right antenna
        this.context.moveTo(radius * headSize, radius * 3 - radius * headSize);
        this.context.arcTo(radius * headSize, radius * 3.5, radius * headSize + radius, radius*4, radius);
        // left antenna
        this.context.moveTo(-radius * headSize, radius * 3 - radius * headSize);
        this.context.arcTo(-radius * headSize, radius * 3.5, -radius * headSize - radius, radius*4, radius);
        // just make thick black lines for the antennas
        this.context.fill();
        this.context.stroke();

        // the wings
        this.context.strokeStyle = `rgba(0, 0, 0, ${1})`; // black line...
        this.context.lineWidth = 1; // ...that is thick
        this.context.fillStyle = `rgba(255, 255, 255, ${this.getTrailAlpha()})`; // fill it with mostly opaque white
        this.context.beginPath();
        // right wing
        this.context.moveTo(radius/2, radius);
        this.context.arcTo(radius*2.5, radius*0.25, radius*3, radius/2, radius);
        this.context.arcTo(radius*5, radius*1.5, radius*3, radius*2.5, radius);
        this.context.arcTo(radius*2.5, radius*2.75, radius/2, radius*2, radius);
        this.context.lineTo(radius/2, radius*2);
        this.context.moveTo(radius/2, radius*1.5);
        this.context.lineTo(radius*3.75, radius*1.5);
        this.context.closePath();
        // left wing
        this.context.moveTo(-radius/2, radius);
        this.context.arcTo(-radius*2.5, radius*0.25, -radius*3, radius/2, radius);
        this.context.arcTo(-radius*5, radius*1.5, -radius*3, radius*2.5, radius);
        this.context.arcTo(-radius*2.5, radius*2.75, -radius/2, radius*2, radius);
        this.context.lineTo(-radius/2, radius*2);
        this.context.moveTo(-radius/2, radius*1.5);
        this.context.lineTo(-radius*3.75, radius*1.5);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        this.context.restore();
    }

    // draws the trail based on the number of time units back in time passed in
    drawTrail(trailLength) {
        if (this.t < this.lifetime) {
            this.curveManager.drawTrail(this.t, trailLength, `rgba(255, 255, 255, ${this.getTrailAlpha()})`);
        }
    }
}