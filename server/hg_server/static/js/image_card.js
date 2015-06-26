
(function() {
    var root = this;
    
	var ImageCard = function(options) {
		this.view = options.view;
		this.view.innerHTML = document.getElementById('image_card_template').innerHTML;
		this.eDate = $(this.view).find('.date')[0];
        this.eDate.innerHTML = this.view.dataset.date;
		this.eRewards = $(this.view).find('.rewards')[0];
		if (this.view.dataset.rewards) {
			$(this.eRewards).fadeIn('slow');
		}
		this.eLikesCount = $(this.view).find('#count')[0];
		this.eLikesCount.innerHTML = this.view.dataset.likes;
		this.canvas = $(this.view).find('canvas')[0];
        this.context = this.canvas.getContext('2d');
        this.width = 0;

		this.status = 0;
		this.position = {x: 0, y: 0};
        this.scale = 1.0;
        this.scaleCenter = {x: 0, y: 0};
        this.scaleRange = {min: 0, max: 0};
        
		this.imgTexture = new Image();
        this.imgTexture.src = this.view.dataset.url;
        this.imgTexture.onload = function() {
        	var rec = this.view.getBoundingClientRect();
        	this.width = rec.right - rec.left;
			this.canvas.width = rec.right - rec.left;
			this.canvas.height = rec.bottom - rec.top;
			var cw = this.canvas.clientWidth, ch = this.canvas.clientHeight;
        	var iw = this.imgTexture.width, ih = this.imgTexture.height;
            this.scale = Math.min(cw/iw, ch/ih);
            this.scaleRange = {min: this.scale, max: 4};
			this.position.x= (cw - this.scale * iw) / 2;
			this.position.y = (ch - this.scale * ih) / 2;
			this.init = true;
			requestAnimationFrame(this.animate.bind(this));
		}.bind(this);

        this.lastZoomScale = null;
        this.lastX = null;
        this.lastY = null;
        this.setEventListeners();
    };

    ImageCard.prototype = {
        animate: function() {
        	if (this.init) {
	            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
	            this.context.drawImage(
	                this.imgTexture, 
	                this.position.x, this.position.y, 
	                this.scale * this.imgTexture.width, 
	                this.scale * this.imgTexture.height);
	            requestAnimationFrame(this.animate.bind(this));
							this.init = false;
        	}
        },
		
        gesturePinchZoom: function(event) {
            var zoom = false;

            if( event.targetTouches.length >= 2 ) {
                var p1 = event.targetTouches[0];
                var p2 = event.targetTouches[1];
                var zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)); //euclidian distance

                if( this.lastZoomScale ) {
                    zoom = (zoomScale - this.lastZoomScale) / 100;
                } else {
                	this.scaleCenter = {x: (p1.pageX + p2.pageX)/2, y: (p1.pageY + p2.pageY)/2}
                }

                this.lastZoomScale = zoomScale;
            }    

            return zoom;
        },

        doZoom: function(zoom) {
            if(!zoom) return;
            
            var currentScale = this.scale;
            var newScale = this.scale + zoom;
            if (newScale < this.scaleRange.min) {
            	newScale = this.scaleRange.min;
            }
            if (newScale > this.scaleRange.max) {
            	newScale = this.scaleRange.max;
            }
            var deltaScale = newScale - currentScale;
            var currentWidth    = (this.imgTexture.width * this.scale);
            var currentHeight   = (this.imgTexture.height * this.scale);
            var deltaWidth  = this.imgTexture.width*deltaScale;
            var deltaHeight = this.imgTexture.height*deltaScale;
            var deltaX = (deltaHeight * (this.scaleCenter.x - this.position.x)) / currentHeight;
            var deltaY = (deltaWidth * (this.scaleCenter.y - this.position.y)) / currentWidth;
            this.scale = newScale;
            this.position.x -= deltaX;
            this.position.y -= deltaY;
            this.alignEdge();
        },

        doMove: function(relativeX, relativeY) {
            if(this.lastX && this.lastY) {
            	var deltaX = relativeX - this.lastX;
				var deltaY = relativeY - this.lastY;
				this.position.x += deltaX;
				this.position.y += deltaY;
            	this.alignEdge();
            }
            this.lastX = relativeX;
            this.lastY = relativeY;
        },
        
        alignEdge: function() {
        	var cw = this.canvas.clientWidth, ch = this.canvas.clientHeight;
        	var iw = this.imgTexture.width * this.scale, ih = this.imgTexture.height * this.scale;
            if (iw < cw) {
            	this.position.x= (cw - iw) / 2;
            } else {
            	if (this.position.x > 0) {
            		this.position.x = 0;
            	}
            	if (this.position.x + iw < cw) {
            		this.position.x = cw - iw;
            	}
            }
            if (ih < ch) {
				this.position.y = (ch - ih) / 2;
            } else {
            	if (this.position.y > 0) {
            		this.position.y = 0;
            	}
            	if (this.position.y + ih < ch) {
            		this.position.y = ch - ih;
            	}
            }
        },

        setEventListeners: function() {
            this.canvas.addEventListener('touchstart', function(e) {
                this.lastX          = null;
                this.lastY          = null;
                this.lastZoomScale  = null;
                this.scaleCenter    = null;
            }.bind(this), false);

            this.canvas.addEventListener('touchmove', function(e) {
            	if (e.targetTouches.length == 1) {
            		if(this.scale > this.scaleRange.min) {
						e.preventDefault();
            			e.stopPropagation();
            			var relativeX = e.targetTouches[0].pageX - this.canvas.getBoundingClientRect().left;
                    	var relativeY = e.targetTouches[0].pageY - this.canvas.getBoundingClientRect().top;                
                    	this.doMove(relativeX, relativeY);
            		}
            	} else if (e.targetTouches.length == 2) {
					e.preventDefault();
            		e.stopPropagation();
            		this.doZoom(this.gesturePinchZoom(e));
            	}
            }.bind(this), false);
        }
    };

    root.ImageCard = ImageCard;
}).call(this);
