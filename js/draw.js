var canvas = document.getElementById("sig-canvas");
fitToContainer(canvas);
var mult = 0.004;
var scale = $("#scale");
var oldX = 0
var oldY = 0;
var gcodeArr = new Array(); 
gcodeArr.push([0, 1.5]);


scale.on("input", function (event) {
    mult = scale.val()
})

scale.on("change", function (event) {
    mult = scale.val();
})

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function grid() {
    ctx.strokeStyle = "#CC00CC";
    ctx.lineWidth = 0.4;
    ctx.setLineDash([15, 13]);
    ctx.font = "13px Arial";
    ctx.beginPath();
    for (var i = 4; i >= 1; i--) {
      ctx.fillText(i * 50 + "", 0, i * 125);
      ctx.fillText(i * 50 + "", 125 * i - 20, 15);
      ctx.moveTo(0, 125 * i);
      ctx.lineTo(500, 125 * i);
      ctx.moveTo(125 * i, 0);
      ctx.lineTo(125 * i, 500);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.setLineDash([0, 0]);
}

function fitToContainer(canvas) {
    console.log(screen.width);
    if (screen.width > 500) {
        canvas.style.width = '500px';
        canvas.style.height = '500px';

    } else {
        canvas.style.width = (screen.width - 30) + 'px';
        canvas.style.height = (screen.width - 30) + 'px';
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

}

var ctx = canvas.getContext("2d");


function clearCanvas() {
    ctx.closePath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid();
    ctx.beginPath();
}

grid();


var drawing = false;
var mousePos = {
    x: 0,
    y: 0
};
var lastPos = mousePos;
canvas.addEventListener("mousedown", function(e) {
    drawing = true;
    lastPos = getMousePos(canvas, e);
    let x = round((lastPos.x - 250) * mult, 2);
    let y = round((canvas.width - lastPos.y) * mult, 2);

    //gcodeArr.push([x, y]);
    
    document.getElementById("code").value +=  "G01 F300.0 " + "X" + x + " Y" + y + "\n";
    document.getElementById("code").value +=  "G00 F300.0 Z0.000" + "\n";
    gcodeArr.push([x, y, "down"]);
    
}, false);
canvas.addEventListener("mouseup", function(e) {
    let x = round((lastPos.x - 250) * mult, 2);
    let y = round((canvas.width - lastPos.y) * mult, 2);
    drawing = false;
    document.getElementById("code").value +=  "G00 F300.0 Z90.000" + "\n";
    gcodeArr.push([x, y, "up"]);
}, false);
canvas.addEventListener("mousemove", function(e) {
    mousePos = getMousePos(canvas, e);
}, false);

function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
    };
}
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function renderCanvas() {
    if (drawing) {
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        let x = round((mousePos.x - 250) * mult, 2);
        let y = round((canvas.width - mousePos.y)* mult, 2);
        if (oldX != x   || oldY != y) {
            gcodeArr.push([x, y]);

            document.getElementById("code").value +=  "G01 F300.0 " + "X" + x + " Y" + y + "\n";
            
        }
        oldX = x;
        oldY = y;

        lastPos = mousePos;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.stroke();
    }
}

(function drawLoop() {
    requestAnimFrame(drawLoop);
    renderCanvas();
})();
canvas.addEventListener("touchstart", function(e) {

    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY

    });
    
    
    canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function(e) {
    console.log("TOUCHEND");
    
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function(e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}
document.body.addEventListener("touchstart", function(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);
document.body.addEventListener("touchend", function(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);
document.body.addEventListener("touchmove", function(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);
