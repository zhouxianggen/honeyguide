    	
(function() {
    var root = this;

	var ViewShare = function(options) {
		this.view = options.view;
		this.eFinish = $(this.view).find('#btn_finish')[0];
		this.eFooter = $(this.view).find('#footer')[0];
		this.eNote = $(this.eFooter).find('#textarea_note')[0];
		this.handlers = {
			'display': this.display.bind(this)
		};
		this.setEventListeners();
	};

    ViewShare.prototype = {
    	setEventListeners: function() {
    		this.view.addEventListener('active', function(e) {
    			var handler = this.handlers && this.handlers[e.detail.handler] || this.display.bind(this);
    			handler(e);
    		}.bind(this));
 	
			this.view.addEventListener('click', function(e) {
    			if (this.eFooter.className == 'in') {
    				this.eFooter.className = "out";
    			} else {
    				this.eFooter.className = "in";
    			}
            }.bind(this), false);
            
            this.eNote.addEventListener('click', function(e) {
    			if (this.eNote.className == 'hint') {
    				this.eNote.innerHTML = '';
    				this.eNote.className = "edit";
    			}
    			e.stopPropagation();
            }.bind(this), false);
            
            this.eFinish.addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
            }.bind(this), false);
    	},
        
    	display: function(e) {
    		if (e.detail.card.type='image') {
    			this.card = new ImageCard({url: e.detail.card.url});
    			this.view.add(this.card.view);
    		}
    	},
    };

    root.ViewShare = ViewShare;
}).call(this);
