    	
(function() {
    var root = this;

	var ViewBrowseComb = function(options) {
		this.view = document.getElementById('view_browse_comb');
		this.gallery = new Gallery({view: $(this.view).find('#gallery')[0]});
		this.footer = new Footer({view: $(this.view).find('#footer')[0]});
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
    			if (this.footer.view.className == 'in') {
    				this.footer.popOut();
    			} else {
    				this.footer.popIn();
    			}
            }.bind(this), false);
    	},
        
    	display: function(e) {
    	},
    };

    root.ViewBrowseComb = ViewBrowseComb;
}).call(this);

function init() {
	checkRequestAnimationFrame();
	viewGroup = new ViewGroup();
	viewBrowseComb = new ViewBrowseComb();
	viewShare = new ViewShare({view: document.getElementById("view_share")});
	//viewGroup.activeView(document.getElementById("view_browse_comb"));
	//viewGroup.activeView(document.getElementById("view_share"), 
		//{'handler': 'display', 'card': {'type': 'image', 'url': 'img/page2.jpg'}});
	viewGroup.activeView(document.getElementById("view_share"), 
		{'handler': 'display', 'card': {'type': 'video', 'url': 'video/love.mp4'}});
}
