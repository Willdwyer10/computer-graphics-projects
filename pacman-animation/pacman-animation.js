/*
function setup() {
var canvas = document.getElementById('canvas');

var slider_size = document.getElementById('slider_size')
slider_size.value = 50;
var slider_speed = document.getElementById('slider_speed')
slider_speed.value = 50;

// a thick red line
context.lineWidth = 5;
context.strokeStyle = "red";

// the actual line
context.beginPath();
context.moveTo(50,50);
context.lineTo(100,100);
context.stroke();
    /*
function draw() {
    var context = canvas.getContext('2d');

    // a thick red line
    context.lineWidth = 5;
    context.strokeStyle = "red";

    // the actual line
    context.beginPath();
    context.moveTo(slider_speed.value+50,slider_size.value+50);
    context.lineTo(slider_speed.value+100,slider_size.value+100);
    context.stroke();

}

slider_size.addEventListener('input', draw);
slider_speed.addEventListener('input', draw);*/
/*draw();

}

window.onload = setup;  
*/

function onload() {
    var canvas = document.getElementById('canvas');

    var slider_size = document.getElementById('slider_size')
    slider_size.value = 50;
    var slider_speed = document.getElementById('slider_speed')
    slider_speed.value = 50;

    function draw() {
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;

        // a thick red line
        context.lineWidth = 5;
        context.strokeStyle = "red";

        // A simple rectangle
        context.fillRect(slider_size.value, slider_size.value, slider_speed.value*2, slider_speed.value);
    }

    slider_size.addEventListener("input", draw);
    slider_speed.addEventListener("input", draw);
    draw();
}

window.onload = onload();