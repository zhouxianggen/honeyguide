
(function() {
    var root = this;

	var FabButton = function(options) {
		this.view = options.view;
		this.onClick = options.onClick;
		this.tapId = null;
		this.tapX = null;
		this.tapY = null;
		this.setEventListeners();
	};

    FabButton.prototype = {
    	setEventListeners: function() {
    		this.view.addEventListener('touchstart', function(e) {
                e.preventDefault();
            	e.stopPropagation();
            	if (e.touches.length == 1 && this.tapId == null) {
            		this.view.className = 'fab_button pressed';
            		this.tapId = e.touches[0].identifier;
            		this.tapX = e.touches[0].pageX;
            		this.tapY = e.touches[0].pageY;
            	}
            }.bind(this), false);
            
            this.view.addEventListener('touchend', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	for (var i = 0, t; t = e.changedTouches[i]; i++) {
            		if (t.identifier == this.tapId) {
            			this.tapId = null;
            			this.view.className = 'fab_button';
            			if (t.pageX == this.tapX && t.pageY == this.tapY) {
            				//this.onClick();
            			}
            		}
            	}
            }.bind(this), false);
            
    	},
    };

    root.FabButton = FabButton;
}).call(this);
