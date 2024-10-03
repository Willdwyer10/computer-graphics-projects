export class Person {
    // static LEFT_ARM = 1;
    // static RIGHT_ARM = 2;
    // static LEFT_LEG = 3;
    // static RIGHT_LEG = 4;

    constructor(context, leftHolds, rightHolds) {
        this.context = context;
        this.leftHolds = leftHolds;
        this.rightHolds = rightHolds;

        this.currentHoldIndex = this.leftHolds.length - 2; // the currentHoldIndex

        // Draw example stick figure
        this.bodyParts = {
            leftArm: { x: 20, y: 20 },
            rightArm: { x: 40, y: 20 },
            leftLeg: { x: 0, y: 0 },
            rightLeg: { x: 0, y: 0 },
            pelvis: { x: 0, y: 0 },
            neck: { x: 0, y: 0}
        };

        // this.bodyParts = {
        //     leftArm: { x: 0, y: 0 },
        //     rightArm: { x: 0, y: 0 },
        //     leftLeg: { x: 0, y: 0 },
        //     rightLeg: { x: 0, y: 0 },
        //     pelvis: { x: 0, y: 0 },
        //     neck: { x: 0, y: 0}
        // };
    }

    draw() {
        this.context.beginPath();

        this.context.moveTo(this.bodyParts.leftLeg.x, this.bodyParts.leftLeg.y); // Start at left leg
        this.context.moveTo(this.bodyParts.pelvis.x, this.bodyParts.pelvis.y); // Move to pelvis
        this.context.moveTo(this.bodyParts.rightLeg.x, this.bodyParts.rightLeg.y); // Then down to right leg
        this.context.moveTo(this.bodyParts.pelvis.x, this.bodyParts.pelvis.y); // Back to the pelvis
        this.context.moveTo(this.bodyParts.neck.x, this.bodyParts.neck.y); // Up to the neck
        this.context.moveTo(this.bodyParts.leftArm.x, this.bodyParts.leftArm.y); // Out to the left arm
        this.context.moveTo(this.bodyParts.neck.x, this.bodyParts.neck.y); // Back to the neck
        this.context.moveTo(this.bodyParts.rightArm.x, this.bodyParts.rightArm.y); // Out to the right arm

        this.context.stroke();




    }

}
