    	
(function() {
    var root = this;

	var VideoInput = function(options) {
		this.view = options.view;
		this.eInput = options.input;
		this.files = [];
		this.setEventListeners();
	};

    VideoInput.prototype = {
    	setEventListeners: function() {
            this.view.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eInput.click();
            }.bind(this), true);
            
            this.eInput.addEventListener('change', function(e) {
            	e.stopPropagation();
            	e.preventDefault();
            	for (var i = 0, f; f = this.eInput.files[i]; i++) {
            		var reader = new FileReader();
            		reader.onload = (function(obj) {
            			return function(e) {
            				obj.files.push(e.target.result);
            				alert('input ' + e.target.result);
            				if (obj.files.length == obj.eInput.files.length) {
            					alert('finish');
            				}
            			};
            		})(this);
            		reader.readAsDataURL(f);
            	}
            }.bind(this));
    	},
    };

    root.VideoInput = VideoInput;
}).call(this);
