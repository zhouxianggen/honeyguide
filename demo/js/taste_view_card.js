
function create(htmlStr) {
	var frag = document.createDocumentFragment();
	var temp = document.createElement('div');
	temp.innerHTML = htmlStr;
	while (temp.firstChild) {
		frag.appendChild(temp.firstChild);
	}
	return frag;
}

function set_comb_info()
{
	var comb_info = document.getElementById("comb_info");
	comb_info.innerHTML = this.comb["title"];
}

function set_linker_info()
{
	var linker_info = document.getElementById("linker_info");
	var length = Math.min(this.linkers.length, linker_info.childNodes.length);
	var linkers = linker_info.getElementsByClassName("linker");
	var linker_canvas = linker_info.getElementsByClassName("linker_canvas");

	for (var i = 0; i < length; i++) {
		var linker = linkers[i];
		var canvas = linker_canvas[i];
		linker.style.display = "flex";
		linker.setAttribute("onclick", "window.location='" + this.linkers[i]["url"] + "'");
		var ctx = canvas.getContext("2d");
		var img = new Image();
		img.src = this.linkers[i]["icon"];
		
		img.onload = function() {
			var iWidth = img.width;
			var iHeight = img.height;
			var cWidth = linker.clientWidth;
			var cHeight = linker.clientHeight;
			var scaleRatio = Math.min(cWidth/iWidth, cHeight/iHeight);
			canvas.width = iWidth;
			canvas.height = iHeight;
			scaleRatio = Math.min(1.0, scaleRatio);
			canvas.style.width = (iWidth * scaleRatio).toString() + "px";
			canvas.style.height = (iHeight * scaleRatio).toString() + "px";
			ctx.drawImage(img, 0, 0);
		}
	}
}

//function on_thumbnail_share_list_load()
//{
//	var thumbnail_share_list = document.getElementById("thumbnail_share_list");
//	var shares = document.getElementsByClassName("thumbnail_share");
//	var length = shares.length;
//	
//	for (var i = 0; i < length; i++) {
//		var div = shares[i];
//		var canvas = div.getElementsByClassName("thumbnail_share_canvas")[0];
//		var ctx = canvas.getContext("2d");
//		var img = new Image();
//		img.src = canvas.getAttribute("data-img-src");
//		img.onload = function() {
//			var iWidth = img.width;
//			var iHeight = img.height;
//			var cWidth = div.clientWidth;
//			var cHeight = div.clientHeight;
//			var scaleRatio = Math.min(cWidth/iWidth, cHeight/iHeight);
//			canvas.width = iWidth;
//			canvas.height = iHeight;
//			scaleRatio = Math.min(1.0, scaleRatio);
//			canvas.style.width = (iWidth * scaleRatio).toString() + "px";
//			canvas.style.height = (iHeight * scaleRatio).toString() + "px";
//			ctx.drawImage(img, 0, 0);
//		}
//	}
//}

function set_share_info()
{
	var div = document.getElementById("selected_share");
	var canvas = document.getElementById("selected_share_canvas");
	var ctx = canvas.getContext("2d");
	var img = new Image();
	shares = this.shares;
	img.src = shares[this.selected_share]["img"];
	
	img.onload = function() {
		var iWidth = img.width;
		var iHeight = img.height;
		var cWidth = div.clientWidth;
		var cHeight = div.clientHeight;
		var scaleRatio = Math.min(cWidth/iWidth, cHeight/iHeight);
		canvas.width = iWidth;
		canvas.height = iHeight;
		scaleRatio = Math.min(1.0, scaleRatio);
		canvas.style.width = (iWidth * scaleRatio).toString() + "px";
		canvas.style.height = (iHeight * scaleRatio).toString() + "px";
		ctx.drawImage(img, 0, 0);
	}
}
