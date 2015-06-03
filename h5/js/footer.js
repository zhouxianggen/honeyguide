    	
(function() {
    var root = this;

	var Footer = function(options) {
		this.view = options.view;
		this.eOpenLinkers = $(this.view).find('#btn_open_linkers')[0];
		this.eOpenInputs = $(this.view).find('#btn_open_inputs')[0];
		this.eLinkerList = $(this.view).find('#linker_list')[0];
		this.eInputList = $(this.view).find('#input_list')[0];
		this.setEventListeners();
	};

    Footer.prototype = {
    	popIn: function(e) {
    		this.view.className = 'in';
    	},
    	
    	popOut: function(e) {
    		var subIn = false;
			if (this.eLinkerList.className == 'in') {
				subIn = true;
				this.eLinkerList.className = 'out';
			}
			if (this.eInputList.className == 'in') {
				subIn = true;
				this.eInputList.className = 'out';
			}
			if (subIn == false) {
				this.view.className = 'out';
			}
    	},
    	
    	setEventListeners: function() {
            this.view.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
            }.bind(this), false);
            
            this.eOpenLinkers.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eLinkerList.className = 'in';
            }.bind(this), true);
            
            $(this.eLinkerList).find('#close')[0].addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eLinkerList.className = 'out';
            }.bind(this), true);
            
            this.eOpenInputs.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eInputList.className = 'in';
            }.bind(this), true);
            
            $(this.eInputList).find('#close')[0].addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eInputList.className = 'out';
            }.bind(this), true);
    	},
    };

    root.Footer = Footer;
}).call(this);
