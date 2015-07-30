
(function() {
    var root = this;

	var Gallery = function(options) {
		this.view = options.view;
		this.list = $(this.view).find('#list')[0];
		this.timestamp = $(this.view).find('#timestamp')[0];
		this.footer = $.find('#footer_menu')[0];
		var opts = {
			  lines: 8 // The number of lines to draw
			, length: 5 // The length of each line
			, width: 2 // The line thickness
			, radius: 5 // The radius of the inner circle
			, scale: 1 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0.2 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 0.7 // Rounds per second
			, trail: 79 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '43%' // Top position relative to parent
			, left: '50%' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
		};
		this.spinner = new Spinner(opts).spin();
		this.setEventListeners();
	};

    Gallery.prototype = {
    	setEventListeners: function() {
    		this.view.addEventListener('touchstart', function(e) {
                e.preventDefault();
            	e.stopPropagation();
            	this.touchId = e.touches[0].identifier;
            	this.lastY = e.touches[0].pageY;
            	$(this.list).removeClass('floating');
            }.bind(this), false);
            
            this.view.addEventListener('touchmove', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	for (var i = 0, t; t = e.targetTouches[i]; i++) {
            		if (t.identifier == this.touchId) {
            			var deltaY = t.pageY - this.lastY;
            			this.lastY = t.pageY;
            			this.doMove(deltaY);
            		}
            	}
            }.bind(this), false);
            
            this.view.addEventListener('touchend', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	var listPos = $(this.list).position();
            	var listHeight = $(this.list).height();
    			var galleryHeight = Math.min($(this.view).height(), listHeight);
            	if (listPos.top > 0) {
            		$(this.list).addClass('floating');
            		var spinner1 = document.getElementById('spinner1');
            		if (listPos.top > $(spinner1).height()) {
            			this.doMove($(spinner1).height() - listPos.top);
            			spinner1.appendChild(this.spinner.el);
            			this.doLoadNewCards();
            		} else {
            			this.doMove(-listPos.top);
            		}
            	}
            	if (listPos.top < galleryHeight - listHeight) {
            		$(this.list).addClass('floating');
            		var spinner2 = document.getElementById('spinner2');
            		if (listPos.top + listHeight < $(spinner2).position().top) {
            			this.doMove($(spinner2).position().top - listPos.top - listHeight);
            			spinner2.appendChild(this.spinner.el);
            			this.doLoadMoreCards();
            		} else {
            			this.doMove(galleryHeight - listHeight - listPos.top);
            		}
            	}
            	this.timestamp.className = 'popout';
            }.bind(this), false);
    	},
    	
    	doLoadMoreCards: function() {
    		var more = '<li class="item">' + $.now() + '<li>';
    		//debug(more);
    		if (more) {
    			document.getElementById('spinner2').innerHTML = '';
    			$(this.list).delay(500).append(more);
    		}
    	},
    	
    	doLoadNewCards: function() {
    		var more = '<li class="item">' + $.now() + '<li>';
    		//debug(more);
    		if (more) {
    			document.getElementById('spinner1').innerHTML = '';
    			$(this.list).css({top: 0});
    			$(this.list).delay(500).prepend(more);
    			//var add = $(this.list).find('.item')[0];
    			//this.doMove(-$(add).height());
    		}
    	},
    	
    	doTimestampMove: function() {
    		var listPos = $(this.list).position();
    		var listHeight = $(this.list).height();
    		var tsHeight = $(this.timestamp).height();
    		var galleryHeight = Math.min($(this.view).height(), listHeight);
    		var coef, tsTop;
    		if (galleryHeight < listHeight) {
    			coef = (galleryHeight - tsHeight) / (listHeight - galleryHeight);
    			tsTop = -listPos.top * coef;
    		} else {
    			tsTop = listPos.top;
    		}
    		$(this.timestamp).css({top: tsTop});
    		
    		var cards = $(this.list).find('.item');
    		var pos = $(this.timestamp).position().top + $(this.timestamp).height()/2 - $(this.list).position().top;
    		for (var i = 0, c; c = cards[i]; i++) {
    			if ($(c).position().top < pos && $(c).position().top + $(c).height() > pos) {
    				this.timestamp.innerHTML = c.innerHTML;
    				break;
    			}
    		}
    		if (tsTop < 0 || tsTop > galleryHeight - tsHeight) {
    			this.timestamp.className = 'popout';
    		}
    	},
    	
    	doMove: function(deltaY) {
    		var listPos = $(this.list).position();
    		var listHeight = $(this.list).height();
    		var galleryHeight = Math.min($(this.view).height(), listHeight);
    		this.timestamp.className = 'popin';
    		if (listPos.top > 0 && deltaY > 0) {
    			deltaY = deltaY * 2 / listPos.top;
    		}
    		if (listPos.top < galleryHeight - listHeight && deltaY < 0) {
    			deltaY = deltaY * 2 / (galleryHeight - listHeight - listPos.top);
            }
    		$(this.list).css({top: listPos.top + deltaY});
    		this.doTimestampMove();
    		if (deltaY < 0 && listPos.top < 0) {
    			this.footer.className = 'footer out';
    		}
    		if (deltaY > 0 && listPos.top > galleryHeight - listHeight) {
    			this.footer.className = 'footer in';
    		}
    		
    		if (deltaY > 0) {
    			document.getElementById('spinner2').innerHTML = '';
    		}
    		if (deltaY < 0) {
    			document.getElementById('spinner1').innerHTML = '';
    		}
    	}
    };

    root.Gallery = Gallery;
}).call(this);
