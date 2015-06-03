    	
(function() {
    var root = this;

	var ViewBrowse = function(options) {
		this.view = options.view;
		this.gallery = new Gallery({view: $(this.view).find('#gallery')[0]});
		this.footer = new Footer({view: $(this.view).find('#footer')[0]});
		this.imageInputer = new Inputer({
			view: $(this.view).find('#a_add_images')[0],
			progress: document.getElementById('progress'),
			onfinish: (function(obj) {
    			return function(e) {
    				window.viewGroup.active(document.getElementById("view_share"), {'inputer': obj.imageInputer});
    			};
    		})(this)
		});
		this.videoInputer = new Inputer({
			view: $(this.view).find('#a_add_videos')[0],
			progress: document.getElementById('progress'),
			onfinish: (function(obj) {
    			return function(e) {
    				window.viewGroup.active(document.getElementById("view_share"), {'inputer': obj.videoInputer});
    			};
    		})(this)
		});
		this.handlers = {
			'display': this.display.bind(this)
		};
		this.setEventListeners();
	};

    ViewBrowse.prototype = {
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

    root.ViewBrowse = ViewBrowse;
}).call(this);

