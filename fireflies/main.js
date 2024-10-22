// sets things up and runs the main animation loop
class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.backgroundManager = new BackgroundManager(this.canvas, this.context);
        this.fireflyManager = new FireflyManager(this.canvas, this.context);

        this.sliderFireflyGenRate = document.getElementById('slider_firefly_gen_rate');
        this.sliderTrailLength = document.getElementById('slider_trail_length');
        this.checkboxShowTrails = document.getElementById('checkbox_show_trails');
    }

    setup() {
        // start with 5 fireflies
        for(let i = 0; i < 5; i++) {
            this.fireflyManager.addFirefly();
        }
    }

    draw() {
        // de facto method to clear canvas
        this.canvas.width = this.canvas.width;
        
        // draw the background
        this.backgroundManager.drawBackground();

        // this.testFirefly.drawFirefly();

        // update the internal timestamps of the  fireflies
        this.fireflyManager.updateFireflies(0.01);

        // draw the fireflies
        this.fireflyManager.drawFireflies();

        // draw trails if checkbox is selected
        if (this.checkboxShowTrails.checked) this.fireflyManager.drawTrails(this.sliderTrailLength.value);
        
        // add fireflies randomly, the frequency new ones are generated depends on the slider
        if (Math.random() * 100 > -1*this.sliderFireflyGenRate.value) this.fireflyManager.addFirefly();
    
        // create animation loop
        window.requestAnimationFrame(() => this.draw());
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