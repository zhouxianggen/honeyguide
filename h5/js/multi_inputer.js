    	
(function() {
    var root = this;

	var Inputer = function(options) {
		this.view = options.view;
		this.progress = options.progress;
		this.onfinish = options.onfinish;
		this.eInput = $(this.view).find('input')[0];
		this.accept = $(this.eInput).attr('accept');
		if (this.accept.match(/^(\w+)\/(\S+)/))
			this.accept = RegExp.$1;
		else
			throw 'error accept type ' + this.accept;
		this.files = [];
		this.acceptedFiles = [];
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
            	for (var i = 0, f; f = this.eInput.files[i]; i++) {
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
            				obj.files.push(e.target.result);
            				obj.progress.dispatchEvent(new CustomEvent('complete'));
            				if (e.target.result.match(/^data\:(\w+)\/(\w+);base64\,/)) {
        						if (RegExp.$1 == obj.accept) {
        							obj.acceptedFiles.push(e.target.result);
        						}
        					}
            				if (obj.files.length == obj.eInput.files.length) {
            					obj.onfinish();
            				}
            			};
            		})(this);
            		reader.readAsDataURL(f);
            	}
            }.bind(this));
    	},
    };

    root.Inputer = Inputer;
}).call(this);
