    	
(function() {
    var root = this;

	var Inputer = function(options) {
		this.view = options.view;
		this.progress = options.progress;
		this.onfinish = options.onfinish;
		this.eInput = $(this.view).find('input')[0];
		this.type = $(this.eInput).attr('accept');
		if (this.type.match(/^(\w+)\/(\S+)/)) {
			this.type = RegExp.$1;
		} else {
			throw 'error accept type ' + this.type;
		}
		this.url = null;
		this.setEventListeners();
	};

    Inputer.prototype = {
    	setEventListeners: function() {
            this.view.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eInput.click();
            }.bind(this), false);
            
            this.eInput.addEventListener('click', function(e) {
            	e.stopPropagation();
            }.bind(this), true);
            
            this.eInput.addEventListener('change', function(e) {
            	e.stopPropagation();
            	e.preventDefault();
            	if (this.eInput.files.length != 1) {
            		return;
            	}
        		var reader = new FileReader();
        		reader.onprogress = (function(obj) {
        			return function(e) {
        				if (e.lengthComputable) {
							obj.progress.dispatchEvent(new CustomEvent('progress', {'detail': e.loaded / e.total}));
        				}
        			};
        		})(this);
        		reader.onload = (function(obj) {
        			return function(e) {
        				obj.progress.dispatchEvent(new CustomEvent('complete'));
        				if (e.target.result.match(/^data\:(\w+)\/(\w+);base64\,/)) {
    						if (RegExp.$1 == obj.type) {
    							obj.url = e.target.result;
    							obj.onfinish();
    						}
    					}
        			};
        		})(this);
            	reader.readAsDataURL(this.eInput.files[0]);
            }.bind(this));
    	},
    };

    root.Inputer = Inputer;
}).call(this);
