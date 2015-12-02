(function() {
    var root = this;

	var MainActivity = function() {
		this.browseActivity = new BrowseActivity({view: document.getElementById('view_browse')});
		this.setEventListeners();
	};

    MainActivity.prototype = {
    	setEventListeners: function() {
    	},
    };

    root.MainActivity = MainActivity;
}).call(this);


function init() {
	checkRequestAnimationFrame();
	mainActivity = new MainActivity();
}