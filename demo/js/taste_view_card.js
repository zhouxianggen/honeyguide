
function on_focus_share_load(img_src)
{
	var canvas = document.getElementById("focus_share_canvas_1");
	var ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = img_src;
	
	img.onload = function() {
		var iWidth = img.width;
		var iHeight = img.height;
		var cWidth = canvas.clientWidth;
		var cHeight = canvas.clientHeight;
		var scaleRatio = Math.min(cWidth/iWidth, cHeight/iHeight);
		scaleRatio = Math.min(1.0, scaleRatio);
		canvas.style.width = (iWidth * scaleRatio).toString() + "px";
		canvas.style.height = (iHeight * scaleRatio).toString() + "px";
		ctx.drawImage(img, 0, 0);
	}
}
