
(function() {
    var root = this;

	var List = function(options) {
		this.view = options.view;
		this.timestampView = $(this.view).find('#timestamp')[0];
		this.listView = $(this.view).find('#list')[0];
		this.cards = $(this.list).find('.card');
		
		this.moveTouchId = null;
        this.startY = null;
        this.startTop = 0;
        
		this.setEventListeners();
	};

    List.prototype = {
    	setEventListeners: function() {
    		this.listView.addEventListener('touchstart', function(e) {
                e.preventDefault();
            	e.stopPropagation();
            	if (e.touches.length > 0 && this.moveTouchId == null) {
            		this.moveTouchId = e.touches[0].identifier;
            		this.startY = e.touches[0].pageY;
            		this.startTop = $(this.listView).position().top;
            	}
            }.bind(this), false);
            
            this.listView.addEventListener('touchmove', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	for (var i = 0, t; t = e.targetTouches[i]; i++) {
            		if (t.identifier == this.moveTouchId) {
            			var deltaY = t.pageY - this.startY;
            			$(this.listView).css({top: this.startTop + deltaY});
            		}
            	}
            }.bind(this), false);
            
            this.listView.addEventListener('touchend', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	for (var i = 0, t; t = e.changedTouches[i]; i++) {
            		if (t.identifier == this.moveTouchId) {
            			this.moveTouchId = null;
            		}
            	}
            }.bind(this), false);
    	},
    };

    root.List = List;
}).call(this);