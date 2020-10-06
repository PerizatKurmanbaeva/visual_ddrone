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
