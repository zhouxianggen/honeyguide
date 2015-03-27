
var GallaryEventHandler = {
	slipTouchId: undefined,
	slipTouchX: undefined,
	slipTouchTime: undefined,
	slipElementLeft: undefined,
	divPageList: undefined,
	pageCount: undefined,
	pageWidth: undefined,
	
	onTouchStart: function(e) {
		if (e.touches.length == 1) {
			if (galleryEventHandler.slipTouchId == undefined) {
				var ul = document.getElementById("ul_page_list");
				galleryEventHandler.pageCount = ul.getElementsByTagName("li").length;
				galleryEventHandler.slipTouchId = e.touches[0].identifier;
				galleryEventHandler.slipTouchX = e.touches[0].pageX;
				galleryEventHandler.slipTouchTime = new Date().getTime();
				var rec = galleryEventHandler.divPageList.getBoundingClientRect();
				galleryEventHandler.slipElementLeft = rec.left;
				var gallery = document.getElementById("div_gallary");
				rec = gallery.getBoundingClientRect();
				galleryEventHandler.pageWidth = rec.right - rec.left;
			}
		}
	},
	
	onTouchMove: function(e) {
		e.preventDefault();
		if (galleryEventHandler.slipTouchId != undefined) {
			for (var i = 0; i < e.touches.length; i++) {
				if (e.touches[i].identifier == galleryEventHandler.slipTouchId) {
					var deltaX = e.touches[i].pageX - galleryEventHandler.slipTouchX;
					var newLeft = galleryEventHandler.slipElementLeft + deltaX;
					//galleryEventHandler.divPageList.style.webkitTransform = 'translate3d(' + deltaX + 'px, 0px, 0px)';
					galleryEventHandler.divPageList.style.left = newLeft + 'px';
				}
	        }
		}
	},
	
	onTouchEnd: function(e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].identifier == galleryEventHandler.slipTouchId) {
				var width = galleryEventHandler.pageWidth;
				var deltaX = e.changedTouches[i].pageX - galleryEventHandler.slipTouchX;
				var absX = Math.abs(deltaX);
				var endTime = new Date().getTime();
				var speed = absX / (endTime - galleryEventHandler.slipTouchTime);
				if (absX*3 >= width || speed >= 0.2) {
					var duration = (width - absX) * 200;
					var left = galleryEventHandler.slipElementLeft;
					var newLeft = (deltaX > 0)? (left + width) : (left - width);
				} else {
					var duration = (absX) * 200;
					var newLeft = galleryEventHandler.slipElementLeft;
				}
				galleryEventHandler.divPageList.style.WebkitTransition = 'width ' + duration + 'ms ease-out';
				galleryEventHandler.divPageList.style.left = newLeft + 'px';
				if (newLeft == width) {
					newLeft = -((galleryEventHandler.pageCount-1) * width);
				}
				if (newLeft == -(galleryEventHandler.pageCount * width)) {
					newLeft = 0;
				}
				galleryEventHandler.divPageList.style.WebkitTransition = 'ease-out';
				galleryEventHandler.divPageList.style.left = newLeft + 'px';
				galleryEventHandler.slipTouchId = undefined;
				galleryEventHandler.setIndicator();
			}
		}
	},
	
	setIndicator: function() {
		var left = galleryEventHandler.divPageList.getBoundingClientRect().left;
		var index = Math.abs(left) / galleryEventHandler.pageWidth;
		var div_page_indicator = document.getElementById("div_page_indicator");
		var indicators = div_page_indicator.getElementsByTagName("a");
		for (var i = 0; i < indicators.length; i++) {
			if (i == index) {
				indicators[i].setAttribute("class", "selected_indicator");
			} else {
				indicators[i].setAttribute("class", "");
			}
		}
	},
	
	setImagePosition: function() {
		var images = document.getElementsByClassName("page_image");
		var cWidth = window.innerWidth;
		var cHeight = window.innerHeight;
		for (var i = 1; i < images.length; i++) {
			var iWidth = images[i].width;
			var iHeight = images[i].height;
			var scaleRatio = Math.min(cWidth/iWidth, cHeight/iHeight);
			//scaleRatio = Math.min(1.0, scaleRatio);
			var newWidth = iWidth * scaleRatio;
			var newHeight = iHeight * scaleRatio;
			var newLeft = (cWidth - newWidth) / 2;
			var newTop = (cHeight - newHeight) / 2;
			images[i].style.left = newLeft + 'px';
			images[i].style.top = newTop + 'px';
			images[i].style.width = newWidth + 'px';
			images[i].style.height = newHeight + 'px';
			images[i].style.visibility = 'visible';
		}
	}
}

var LinkerMenuEventHandler = {
	touchId: undefined,
	aMenu: undefined,
	
	onTouchStart: function(e) {
		if (linkerMenuEventHandler.touchId == undefined) {
			linkerMenuEventHandler.touchId = e.touches[0].identifier;
			linkerMenuEventHandler.aMenu.setAttribute("class", "pressed_menu");
		}
	},
	
	onTouchEnd: function(e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].identifier == linkerMenuEventHandler.touchId) {
				linkerMenuEventHandler.aMenu.setAttribute("class", "");
				linkerMenuEventHandler.touchId = undefined;
				break;
			}
		}
	}
}

var galleryEventHandler;
var linkerMenuEventHandler;

function init() {
	galleryEventHandler = Object.create(GallaryEventHandler);
	galleryEventHandler.divPageList = document.getElementById("div_page_list");
	var gallery = document.getElementById("div_gallary");
	gallery.style.width = window.innerWidth + 'px';
	gallery.style.height = window.innerHeight + 'px';
	galleryEventHandler.setImagePosition();
	gallery.addEventListener("touchstart", galleryEventHandler.onTouchStart, false);
	gallery.addEventListener("touchmove", galleryEventHandler.onTouchMove, false);
	gallery.addEventListener("touchend", galleryEventHandler.onTouchEnd, false);

	linkerMenuEventHandler = Object.create(LinkerMenuEventHandler); 
	var linkerMenu = document.getElementById("div_linker_menu");
	linkerMenuEventHandler.aMenu = document.getElementById("a_linker_menu");
	linkerMenu.addEventListener("touchstart", linkerMenuEventHandler.onTouchStart, false);
	linkerMenu.addEventListener("touchend", linkerMenuEventHandler.onTouchEnd, false);
}
