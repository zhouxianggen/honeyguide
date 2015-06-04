    	
(function() {
    var root = this;

	var Progress = function(options) {
		this.view = options.view;
		this.progress = null;
		this.setEventListeners();
	};

    Progress.prototype = {
    	setEventListeners: function() {
    		this.view.addEventListener('progress', function(e) {
    			debug(e.loaded / e.total);
    			this.progress = e.detail;
    			this.view.className = 'runing';
    			requestAnimationFrame(this.animate.bind(this));
    		}.bind(this));
 	
			this.view.addEventListener('complete', function(e) {
				this.view.className = 'finished';
    			this.progress = null;
            }.bind(this), false);
    	},
        
    	animate: function() {
        	if (this.progress != null) {
        		this.innerHTML = (this.progress * 100) + '%';
        		requestAnimationFrame(this.animate.bind(this));
        	}
        },
    };

    root.Progress = Progress;
}).call(this);

