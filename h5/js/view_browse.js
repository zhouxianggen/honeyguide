    	
(function() {
    var root = this;

	var ViewBrowse = function(options) {
		this.view = options.view;
		this.comb_id = this.view.dataset.comb_id;
		this.gallery = new Gallery({view: $(this.view).find('.gallery')[0]});
		this.eFooter = $(this.view).find('.footer')[0];
		this.eLinkerList = $(this.view).find('#popup_linker_list')[0];
		this.eInputList = $(this.view).find('#popup_input_list')[0];
		// 添加分享的按钮
		// 添加图片分享
		this.imageInputer = new Inputer({
			view: $(this.view).find('#a_add_images')[0],
			progress: document.getElementById('progress'),
			onfinish: (function(obj) {
    			return function(e) {
    				window.viewGroup.active('view_share', {'inputer': obj.imageInputer});
    			};
    		})(this)
		});
		// 添加视频分享
		this.videoInputer = new Inputer({
			view: $(this.view).find('#a_add_videos')[0],
			progress: document.getElementById('progress'),
			onfinish: (function(obj) {
    			return function(e) {
    				window.viewGroup.active('view_share', {'inputer': obj.videoInputer});
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
    			if (this.eFooter.className == 'footer in') {
    				if (this.eLinkerList.className == 'popup in') {
    					this.eLinkerList.className = 'popup out';
    					return;
    				}
    				if (this.eInputList.className == 'popup in') {
    					this.eInputList.className = 'popup out';
    					return;
    				}
    				this.eFooter.className = 'footer out';
    			} else {
    				this.eFooter.className = 'footer in';
    			}
            }.bind(this), false);
            
            this.eFooter.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
            }.bind(this), false);
            
            $(this.eFooter).find('#btn_main')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.eLinkerList.className = 'popup in';
            }.bind(this), true);
            
            $(this.eFooter).find('#btn_open_inputs')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.eInputList.className = 'popup in';
            }.bind(this), true);
    	},
        
    	display: function(e) {
    	},
    };

    root.ViewBrowse = ViewBrowse;
}).call(this);

