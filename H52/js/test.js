    	
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

function init() {
	checkRequestAnimationFrame();
	btn = new FabButton({view: document.getElementById('add_comb')});
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
	
	var target = document.getElementById('refresh');
	var spinner = new Spinner(opts).spin();
	target.appendChild(spinner.el)
}
