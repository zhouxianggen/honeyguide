    	
(function() {
    var root = this;

	var MainActivity = function() {
		this.eCardList = $.find('#card_list')[0];

		this.moveTouchId = null;
        this.startY = null;
        this.startTop = 0;
		
		this.setEventListeners();
	};

    MainActivity.prototype = {
    	setEventListeners: function() {
    		this.eCardList.addEventListener('touchstart', function(e) {
                e.preventDefault();
            	e.stopPropagation();
            	if (e.touches.length > 0 && this.moveTouchId == null) {
            		this.moveTouchId = e.touches[0].identifier;
            		this.startY = e.touches[0].pageY;
            		this.startTop = $(this.eCardList).position().top;
            	}
            }.bind(this), false);
            
            this.eCardList.addEventListener('touchmove', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	for (var i = 0, t; t = e.targetTouches[i]; i++) {
            		if (t.identifier == this.moveTouchId) {
            			var deltaY = t.pageY - this.startY;
            			$(this.eCardList).css({top: this.startTop + deltaY});
            		}
            	}
            }.bind(this), false);
            
            this.eCardList.addEventListener('touchend', function(e) {
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

    root.MainActivity = MainActivity;
}).call(this);

function init() {
	checkRequestAnimationFrame();
	mainActivity = new(MainActivity);
}
