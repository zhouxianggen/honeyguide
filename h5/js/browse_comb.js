    	
(function() {
    var root = this;

	var ViewBrowseComb = function(options) {
		this.view = document.getElementById('view_browse_comb');
		this.handlers = {
			'display': this.display.bind(this)
		};
		this.setEventListeners();
	};

    ViewBrowseComb.prototype = {
    	setEventListeners: function() {
    		this.view.addEventListener('active', function(e) {
    			var handler = this.handlers && this.handlers[e.detail.handler] || this.display.bind(this);
    			handler(e);
    		}.bind(this));
    		
    		this.view.addEventListener('click', function(e) {
    			//e.preventDefault();
    			if (this.eGallery.className == 'blur') {
    				e.stopPropagation();
	    			$(this.eLinkers).fadeOut('fast');
	    			$(this.eAddWaggle).fadeIn('fast');
	    			$(this.eOpenLinkers).fadeIn('fast');
	    			this.eGallery.className = 'active';
    			}
            }.bind(this), false);
            
    		this.eOpenLinkers.addEventListener('click', function(e) {
    			e.preventDefault();
    			e.stopPropagation();
    			$(this.eOpenLinkers).fadeOut('fast');
    			$(this.eAddWaggle).fadeOut('fast');
    			$(this.eLinkers).fadeIn('fast');
    			this.eGallery.className = 'blur';
            }.bind(this), true);
            
            this.eOpenLinkers.addEventListener('touchstart', function(e) {
            	if (e.touches.length == 1 && this.openLinkersTouchId == null) {
            		this.openLinkersTouchId = e.touches[0].identifier;
            		this.eOpenLinkers.className = 'pressed';
            		var rec1 = this.view.getBoundingClientRect();
            		var rec2 = this.eOpenLinkers.getBoundingClientRect();
            		this.openLinkersPosition.x = rec2.left - rec1.left;
            		this.openLinkersPosition.y = rec2.top - rec1.top;
            		requestAnimationFrame(this.animate.bind(this));
            	}
            }.bind(this), true);
            
            this.eOpenLinkers.addEventListener('touchend', function(e) {
				for (var i = 0; i < e.changedTouches.length; i++) {
					if (e.changedTouches[i].identifier == this.openLinkersTouchId) {
						this.openLinkersTouchId = null;
						this.eOpenLinkers.className = 'normal';
					}
				}
            }.bind(this), true);
            
            this.eWaggleList.addEventListener('touchstart', function(e) {
            	if (e.touches.length == 1 && this.waggleListTouchId == null) {
            		this.waggleListTouchId = e.touches[0].identifier;
            		var rec1 = this.view.getBoundingClientRect();
            		var rec2 = this.eWaggleList.getBoundingClientRect();
            		this.pageListPosition.x = rec2.left - rec1.left;
            		this.pageListPosition.y = rec2.top - rec1.top;
            		requestAnimationFrame(this.animate.bind(this));
            	}
            }.bind(this), true);
            
            this.eWaggleList.addEventListener('touchend', function(e) {
				for (var i = 0; i < e.changedTouches.length; i++) {
					if (e.changedTouches[i].identifier == this.waggleListTouchId) {
						var sp = this.touchStarts[this.waggleListTouchId];
    					var mp = this.touchMoves[this.waggleListTouchId];
    					var deltaX = (mp && sp)? mp.x - sp.x : 0;
						var absX = Math.abs(deltaX);
						var endTime = new Date().getTime();
						var speed = absX / (endTime - this.touchTimes[this.waggleListTouchId]);
						if (absX*3 > this.waggleWidth || speed > 0.2) {
							var duration = (this.waggleWidth - absX)/this.waggleWidth * 0.002;
							this.waggleIndex += (deltaX < 0)? 1 : -1;
							if (this.waggleIndex < 0) {
								this.waggleIndex = 0;
							}
							if (this.waggleIndex >= this.waggleCount) {
								this.waggleIndex = this.waggleCount - 1;
							}
						} else {
							var duration = (absX)/this.waggleWidth * 0.002;
						}
						this.eWaggleList.style.WebkitTransition = 'left ' + duration + 's easy-out';
						this.pageListPosition.x = -(this.waggleIndex * this.waggleWidth);
	                    this.eWaggleList.style.left = this.pageListPosition.x + 'px';
	                    this.eWaggleList.style.WebkitTransition = 'ease-out';
						this.waggleListTouchId = null;
					}
				}
            }.bind(this), true);
            
    		this.eAddWaggle.addEventListener('click', function(e) {
    			this.eAddWaggle.className = 'pressed';
    			this.eInputFiles.click();
    			e.preventDefault();
    			e.stopPropagation();
            }.bind(this), false);
            
            this.eInputFiles.addEventListener('change', function(e) {
            	for (var i = 0, f; f = this.eInputFiles.files[i]; i++) {
            		var reader = new FileReader();
            		reader.onload = (function(obj) {
            			return function(e) {
            				obj.selectedImages.push(e.target.result);
            				if (obj.selectedImages.length == obj.eInputFiles.files.length) {
            					viewGroup.activeView(document.getElementById("view_add_waggle"), 
            						{'handler': 'display', 'images': obj.selectedImages});
            				}
            			};
            		})(this);
            		reader.readAsDataURL(f);
            	}
            	e.stopPropagation();
            	e.preventDefault();
            }.bind(this));
            
            this.view.addEventListener('touchstart', function(e) {
            	//e.preventDefault();
            	for (var i = 0, t; t = e.touches[i]; i++) {
            		this.touchStarts[t.identifier] = {x: t.pageX, y: t.pageY};
            		this.touchTimes[t.identifier] = new Date().getTime();
            	}
            }.bind(this), false);

            this.view.addEventListener('touchmove', function(e) {
            	e.preventDefault();
                for (var i = 0, t; t = e.touches[i]; i++) {
                	this.touchMoves[t.identifier] = {x: t.pageX, y: t.pageY};
                }
            }.bind(this), false);
            
            this.view.addEventListener('touchend', function(e) {
            	//e.preventDefault();
            	for (var i = 0, t; t = e.changedTouches[i]; i++) {
            		//this.touchMoves[t.identifier] = {x: t.pageX, y: t.pageY};
            		delete this.touchStarts[t.identifier];
            		delete this.touchMoves[t.identifier];
            		delete this.touchTimes[t.identifier];
				}
            }.bind(this), false);
    	},
        
    	display: function(e) {
    		this.reset();
    		var waggles = $(this.eWaggleList).find('.div_waggle');
			this.waggleCount = waggles.length;
    		for (var i = 0, e; e = waggles[i]; i++) {
    			var divCanvas = $(e).find('.canvas_waggle')[0];
    			divCanvas.width = e.clientWidth;
				divCanvas.height = e.clientHeight;
				this.waggleWidth = e.clientWidth;
				this.addNoteCanvas(e);
    		}
    		this.eWaggleList.style.left = -(this.waggleIndex * this.waggleWidth) + 'px';
    	},
    	
    	addNoteCanvas: function(root) {
    		var canvas = $(root).find('.canvas_waggle')[0];
    		var noteCanvas = new NoteCanvas({
				root:root, canvas:canvas, path:canvas.dataset.img});
			var divNotes = $(root).find('.div_note');
			for (var j = 0, n; n = divNotes[j]; j++) {
				if (n.dataset.type == 'text') {
					var position = {x: n.dataset.x, y: n.dataset.y};
					noteCanvas.addTextNote(position, n.dataset.data);
				}
			}
			this.noteCanvasList.push(noteCanvas);
    	},
    	
    	addShare: function(e) {
    	},
    	
    	animate: function() {
    		if (this.waggleListTouchId != null) {
    			var sp = this.touchStarts[this.waggleListTouchId];
    			var mp = this.touchMoves[this.waggleListTouchId];
    			if (sp && mp) {
    				var deltaX = mp.x - sp.x;
    				this.eWaggleList.style.left = (this.pageListPosition.x + deltaX) + 'px';
    			}
    			requestAnimationFrame(this.animate.bind(this));
    		}
    		
    		if (this.openLinkersTouchId != null) {
    			var sp = this.touchStarts[this.openLinkersTouchId];
    			var mp = this.touchMoves[this.openLinkersTouchId];
    			if (sp && mp) {
	    			var deltaX = mp.x - sp.x;
	    			var deltaY = mp.y - sp.y;
    				this.eOpenLinkers.style.left = (this.openLinkersPosition.x + deltaX) + 'px';
    				this.eOpenLinkers.style.top = (this.openLinkersPosition.y + deltaY) + 'px';
    				//this.debug(deltaX+','+deltaY+','+this.eOpenLinkers.style.left+','+this.eOpenLinkers.style.top);
    			}
    			requestAnimationFrame(this.animate.bind(this));
    		}
		}
    };

    root.ViewBrowseComb = ViewBrowseComb;
}).call(this);

function init() {
	checkRequestAnimationFrame();
	viewGroup = new ViewGroup();
	viewBrowseComb = new ViewBrowseComb();
	viewGroup.activeView(document.getElementById("view_browse_comb"));
}
