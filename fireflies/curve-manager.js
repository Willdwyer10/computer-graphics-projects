// creates a set of curves connected with C1 continuity
let CurveManager = class CurveManager {
    constructor(canvas, context, lifetime) {
        this.canvas = canvas;
        this.context = context;
        this.lifetime = lifetime;
        
        // An array of interconnected curves
        this.curves = [];
        // initialize with starting one...
        this.curves.push(new HermiteCurve(this.canvas, this.context, [-1,-1], [-1,-1]));

        // ... then fill up with enough to cover the entire lifetime
        for(let i = 1; i <= Math.ceil(lifetime); i++) {
            this.curves.push(new HermiteCurve(this.canvas, this.context, this.curves[i-1].getEndPoint(), this.curves[i-1].getEndTangent()))
        }
    }

    // determines the current curve index to use based on the current time
    currentCurveIndex(currentTime) {
        // the newest curve index we must use to draw the trail
        // if it would be more than the highest index, just clip to the highest index
        return Math.min(this.curves.length - 1, Math.trunc(currentTime));
    }

    // draws the trail for the number of trailLength time units back in the past
    drawTrail(currentTime, trailLength, color) {
        // the newest and oldest indices to draw
        let newestIndex = this.currentCurveIndex(currentTime) + 1; 
        let oldestIndex = Math.max(0, Math.trunc(currentTime - trailLength)) + 1; // the oldest curve index we must use to draw the trail
                                                        // if it would be less than 0, just clip to 0
        
        let endTime = currentTime - Math.trunc(currentTime); // we draw up to the decimal part of the current time on the current trail
        let startTime = currentTime-trailLength - Math.trunc(currentTime-trailLength); // we draw back as far as we need to

        if (newestIndex != oldestIndex) {
            this.curves[newestIndex].drawTrajectory(0, endTime, color);
            for (let i = oldestIndex + 1; i < newestIndex; i++) {
                this.curves[i].drawTrajectory(0, 1, color);
            }
            this.curves[oldestIndex].drawTrajectory(startTime, 1, color);
        } 
        // the case where the trail starts and stops on the same curve
        else { 
            this.curves[newestIndex].drawTrajectory(startTime, endTime, color);
        }
    }

    // Draws the entire path this firefly could follow 
    // (potentially [most likely] including some extra on the last curve segment)
    drawFullPath(color) {
        this.curves.forEach( curve => curve.drawTrajectory(0, 1, color));
    }

    // returns the position in space for the given curve at whatever the current time is
    getPosition(currentTime) {
        // all curves are defined with interval [0, 1], so we must do a change of variables to account for that
        return this.curves[this.currentCurveIndex(currentTime)+1].getLocation(currentTime - Math.trunc(currentTime));
    }

    // returns the tangent in space for the given curve at whatever the current time is
    getTangent(currentTime) {
        // all curves are defined with interval [0, 1], so we must do a change of variables to account for that
        return this.curves[this.currentCurveIndex(currentTime)+1].getTangent(currentTime - Math.trunc(currentTime));
    }

    // Return a string representation of this curve manager object
    toString() {
        return `CurveManager -- lifetime:${this.lifetime} \tnumCurves:${this.curves.length}`;
    }
}