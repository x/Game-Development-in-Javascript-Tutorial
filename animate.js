var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(200, 0, 0)";

var xLocation = 0;
setInterval(function(){
	ctx.clearRect(0, 0, 240, 160);
	xLocation++;
	ctx.fillRect(xLocation, 20, 50, 50);
}, 100);
