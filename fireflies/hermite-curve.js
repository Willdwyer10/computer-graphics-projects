// Holds defining information and behaviors for a hermite curve,
// including the ability to retrieve the position or tangent at a given time
let HermiteCurve = class HermiteCurve {
    // pass in [-1, -1] for startPoint and startTangent if they should be randomly generated
    constructor(canvas, context, startingPoint, startingTangent) {
        this.canvas = canvas;
        this.context = context;

        this.P = [];
        /* Create random points and random tangents */
        // 
        if (startingPoint == [-1, -1] && startingTangent == [-1, -1]) {
            // random point 1
            const randomXPos1 = Math.round(Math.random() * this.canvas.width);
            const randomYPos1 = Math.round(Math.random() * this.canvas.height);
            this.P.push([randomXPos1, randomYPos1]); // Push the first point [x, y] into the array

            // random tangent 1
            const randomXTan1 = Math.round(Math.random() * this.canvas.width/2  - this.canvas.width/4);
            const randomYTan1 = Math.round(Math.random() * this.canvas.height/2 - this.canvas.height/4);
            this.P.push([randomXTan1, randomYTan1]); // Push the first tangent [x, y] into the array
        } else {
            this.P.push(startingPoint);
            this.P.push(startingTangent);
        }

        // random point 2
        const randomXPos2 = Math.round(Math.random() * this.canvas.width);
        const randomYPos2 = Math.round(Math.random() * this.canvas.height);
        this.P.push([randomXPos2, randomYPos2]); // Push the second point [x, y] into the array

        // random tangent 2
        const randomXTan2 = Math.round(Math.random() * this.canvas.width/2  - this.canvas.width/4);
        const randomYTan2 = Math.round(Math.random() * this.canvas.height/2 - this.canvas.height/4);
        this.P.push([randomXTan2, randomYTan2]); // Push the second tangent [x, y] into the array
    }

    // gets the ending position vector
    getEndPoint() {
        return this.P[2];
    }

    // gets the ending tangent vector
    getEndTangent() {
        return this.P[3];
    }

    // Returns the basis function evaluated at t; that is, it returns a 1x4 matrix
    hermiteBasisFunction(t) {
	    return [
            2*t*t*t - 3*t*t + 1,
            t*t*t - 2*t*t + t,
            -2*t*t*t + 3*t*t,
            t*t*t - t*t
	    ];
	}

    // Returns the basis function's tangent evaluated at t; that is, it returns a 1x4 matrix
	hermiteDerivativeBasisFunction(t) {
        return [
            6*t*t - 6*t,
            3*t*t - 4*t + 1,
            -6*t*t + 6*t,
            3*t*t - 2*t
        ];
	}

    // Returns the location along this curve at time t; that is, 
    // it returns a 1x2 matrix representing [x, y] position vector
    getLocation(t) {
	    let result = vec2.create();
	    vec2.scale      (result, this.P[0], this.hermiteBasisFunction(t)[0]);
	    vec2.scaleAndAdd(result, result, this.P[1], this.hermiteBasisFunction(t)[1]);
	    vec2.scaleAndAdd(result, result, this.P[2], this.hermiteBasisFunction(t)[2]);
	    vec2.scaleAndAdd(result, result, this.P[3], this.hermiteBasisFunction(t)[3]);
	    return result;
    }

    // Returns the tangent to this curve at time t; that is, 
    // it returns a 1x2 matrix representing [x, y] tangent vector
    getTangent(t) {
	    let result = vec2.create();
	    vec2.scale      (result, this.P[0], this.hermiteDerivativeBasisFunction(t)[0]);
	    vec2.scaleAndAdd(result, result, this.P[1], this.hermiteDerivativeBasisFunction(t)[1]);
	    vec2.scaleAndAdd(result, result, this.P[2], this.hermiteDerivativeBasisFunction(t)[2]);
	    vec2.scaleAndAdd(result, result, this.P[3], this.hermiteDerivativeBasisFunction(t)[3]);
	    return result;
    }

    // draws this curve's trajectory between time t_begin and t_end
    drawTrajectory(t_begin,t_end,color) {
	    let numIntervals = 50;
        this.context.strokeStyle=color;

	    this.context.beginPath();
        this.context.moveTo(this.getLocation(t_begin)[0], this.getLocation(t_begin)[1]);

        for(var i=1;i<=numIntervals;i++){
            var t = ((numIntervals-i)/numIntervals)*t_begin + (i/numIntervals)*t_end;
            this.context.lineTo(this.getLocation(t)[0], this.getLocation(t)[1]);
        }

        this.context.stroke();
	}

    // Return a string representation of this curve
    toString() {
        return `p0:[${this.P[0][0]},${this.P[0][1]}] \td0:[${this.P[1][0]},${this.P[1][1]}] \tp1:[${this.P[2][0]},${this.P[2][1]}] \td1:[${this.P[3][0]},${this.P[3][1]}]`;
    }
}