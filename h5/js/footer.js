    	
(function() {
    var root = this;

	var Footer = function(options) {
		this.view = options.view;
		this.eOpenLinkers = $(this.view).find('#btn_open_linkers')[0];
		this.eLinkerList = $(this.view).find('#linker_list')[0];
		this.eOpenWaggles = $(this.view).find('#btn_open_waggles')[0];
		this.eWaggleList = $(this.view).find('#waggle_list')[0];
		this.eInputImages = $(this.view).find('#input_images')[0];
		this.eInputVedios = $(this.view).find('#input_vedios')[0];
		this.inputImages = [];
		this.inputVedios = [];
		this.eAddImages = $(this.view).find('#a_add_images')[0];
		this.eAddVedios = $(this.view).find('#a_add_vedios')[0];
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
			if (this.eWaggleList.className == 'in') {
				subIn = true;
				this.eWaggleList.className = 'out';
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
            
            this.eOpenWaggles.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eWaggleList.className = 'in';
            }.bind(this), true);
            
            this.eAddImages.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			var eInput = $(this.view).find('#input_images')[0];
    			eInput.click();
            }.bind(this), true);
            
            this.eAddVedios.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			var eInput = $(this.view).find('#input_vedios')[0];
    			eInput.click();
            }.bind(this), true);
    	},
    };

    root.Footer = Footer;
}).call(this);
