
(function() {
    var root = this;

	var Gallery = function(options) {
		this.view = options.view;
		this.list = $(this.view).find('#list')[0];
		this.timestamp = $(this.view).find('#timestamp')[0];
		this.setEventListeners();
	};

    Gallery.prototype = {
    	setEventListeners: function() {
    		this.view.addEventListener('touchstart', function(e) {
                e.preventDefault();
            	e.stopPropagation();
            	this.touchId = e.touches[0].identifier;
            	this.lastY = e.touches[0].pageY;
            }.bind(this), false);
            
            this.view.addEventListener('touchmove', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	for (var i = 0, t; t = e.targetTouches[i]; i++) {
            		if (t.identifier == this.touchId) {
            			var deltaY = t.pageY - this.lastY;
            			this.lastY = t.pageY;
            			this.doMove(deltaY);
            			debug(deltaY);
            		}
            	}
            }.bind(this), false);
            
            this.view.addEventListener('touchend', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            }.bind(this), false);
    	},
    	
    	doMove: function(deltaY) {
    		var listPos = $(this.list).position();
    		var listHeight = $(this.list).height();
    		var tsHeight = $(this.timestamp).height();
    		var galleryHeight = $(this.view).height();
    		var coef = (galleryHeight - tsHeight) / (listHeight - galleryHeight);
    		var tsTop = -listPos.top * coef;
    		$(this.list).css({top: listPos.top + deltaY});
    		$(this.timestamp).css({top: tsTop});
    	}
    };

    root.Gallery = Gallery;
}).call(this);
