    	
(function() {
    var root = this;

	var ViewBrowseComb = function(options) {
		this.view = document.getElementById('view_browse_comb');
		this.eFooter = $(this.view).find('#footer')[0];
		this.eOpenLinkers = $(this.view).find('#btn_open_linkers')[0];
		this.eCloseLinkers = $(this.view).find('#close_linkers')[0];
		this.eLinkerList = $(this.view).find('#linker_list')[0];
		this.gallery = new Gallery({view: $(this.view).find('#gallery')[0]});
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
    			if (this.eFooter.className == 'in') {
    				if (this.eLinkerList.className == 'in') {
    					this.eLinkerList.className = 'out';
    				}
    				else {
    					this.eFooter.className = 'out';
    				}
    			}
    			else {
    				this.eFooter.className = 'in';
    			}
            }.bind(this), false);
            
            this.eFooter.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
            }.bind(this), false);
            
            this.eOpenLinkers.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eLinkerList.className = 'in';
            }.bind(this), true);
            
            this.eCloseLinkers.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eLinkerList.className = 'out';
            }.bind(this), true);
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
	viewGroup.activeView(document.getElementById("view_browse_comb"));
}
