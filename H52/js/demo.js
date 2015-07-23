
(function() {
    var root = this;

	var MainActivity = function() {
		this.btnOpenLinkers = new FabButton({view: document.getElementById('open_linkers')});
		this.gallery = new Gallery({view: document.getElementById('gallery')});
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