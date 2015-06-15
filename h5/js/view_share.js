    	
(function() {
    var root = this;

	var ViewShare = function(options) {
		this.view = options.view;
		this.inputer = null;
		this.card = null;
		this.eCard = $(this.view).find('#card')[0];
		this.eFooter = $(this.view).find('.footer')[0];
		this.ePopupSign = $(this.view).find('#popup_sign')[0];
		this.handlers = {
			'display': this.display.bind(this)
		};
		this.setEventListeners();
	};

    ViewShare.prototype = {
    	setEventListeners: function() {
    		this.view.addEventListener('active', function(e) {
    			var handler = this.handlers && this.handlers[e.detail.handler] || this.display.bind(this);
    			handler.bind(this)(e);
    		}.bind(this));
 	
			this.view.addEventListener('click', function(e) {
            }.bind(this), false);
            
            $(this.view).find('#btn_main')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			if (!context.bee_id) {
    				this.ePopupSign.className = 'popup in';
    			} else {
    				var uploader = new Uploader({
	    				progress: document.getElementById('progress'),
	    				local_url: this.inputer.url,
	    				target_url: 'http://54.149.127.185/upload?',
	    				onfinish: (function(obj) {
			    			return function(e) {
			    				window.viewGroup.active('view_browse');
			    			};
			    		})(this)
    				});
    			}
            }.bind(this), true);
            
            $(this.ePopupSign).find('#li_close')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.ePopupSign.className = 'popup out';
            }.bind(this), true);
    	},
        
    	display: function(e) {
    		this.eCard.className = 'image_card';
    		this.eCard.dataset.url = 'http://img10.guang.j.cn/g3/M01/1C/EE/wKggDVOj_eGQUdMAAAIskqV9KkU891.jpg'
			$(this.eCard).height($(this.view).height() - $(this.eFooter).innerHeight());
			this.card = new ImageCard({view: this.eCard});
    		return;
    		this.inputer = e.detail.inputer;
    		if (this.inputer.type == 'image') {
    			var eCard = document.createElement('div');
    			eCard.className = 'image_card';
    			eCard.dataset.url = this.inputer.url;
    			eCard.innerHTML = '<canvas></canvas>';
    			this.view.appendChild(eCard);
    			this.card = new ImageCard({view: eCard});
    		} else if (this.inputer.type == 'video') {
    			var eCard = document.createElement('div');
    			eCard.className = 'video_card';
    			eCard.dataset.url = this.inputer.url;
    			eCard.innerHTML = '<video controls autoplay></video>';
    			this.view.appendChild(eCard);
    			this.card = new VideoCard({view: eCard});
    		}
    	},
    };

    root.ViewShare = ViewShare;
}).call(this);
