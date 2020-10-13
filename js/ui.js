function clearAll() {
	 document.getElementById("code").value = `CONFIG T22.5 B-22.5 L-22.0 R22.0 I-1 J1
D01 L1.0 R1.0
TELEPORT X0 Y0 Z0
G21 G90 G64 G40
T0 M6
M3 S1000
M05 S0

G00 F300.0 Z100.000
G1 F3000
G1 X0 Y0`;

	 clearCanvas();

}


function copyText(){
    document.getElementById("code").select();
    document.execCommand("copy");
    $('#copy-btn').text("copied")
}

window.onload = function(){
  var imageSelect = document.getElementById("img-select"),
      imageInput = document.getElementById("imageInput"); 

  imageSelect.addEventListener("click", function (e) {
    imageInput.click();
    e.preventDefault();
  }, false);
  
  imageInput.addEventListener("change", function (e) {
    var file  = this.files[0];
    var img = new Image();
    img.onload = function() {
    		handleFiles(file, this.width, this.height);
        }
        img.src = URL.createObjectURL(file);
  }, false);
  
  /*
  document.getElementById("save").addEventListener("click", function (e) {
	 e.target.download = "potrace" + (new Date()).toLocaleTimeString() + ".svg";
	 e.target.href = "data:image/svg+xml;," + Potrace.getSVG(1);
  }, false);  

  
  var drop = document.getElementById('drop');
  drop.addEventListener("dragenter", function (e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.classList.add('hovering');
    return false;
  }, false);
  
  drop.addEventListener("dragleave", function (e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.classList.remove('hovering');
    return false;
  }, false);
  
  drop.addEventListener("dragover", function (e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.classList.add('hovering');
    return false;
  }, false);
  
  drop.addEventListener("drop", function (e) {
    if (e.preventDefault) e.preventDefault();
    this.classList.remove('hovering');
    handleFiles(e.dataTransfer.files);
    return false;
  }, false);
  */
};


function handleFiles(file, width, height) {
	Potrace.setParameter({"turnpolicy": "white", "alphamax": 2, "opttolerance": 0.4});
	Potrace.loadImageFromFile(file);
	Potrace.process(function(){
  		let x = 500 / Math.max(width, height);
    	displaySVG(x);
  });
}

function displaySVG(size, type){
  var canvas = document.getElementById("sig-canvas");
  var ctx = canvas.getContext("2d");
  var path = new Path2D(Potrace.getSVG(size, type));
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.stroke(path);

}

