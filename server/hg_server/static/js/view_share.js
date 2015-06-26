    	
(function() {
    var root = this;

	var ViewShare = function(options) {
		this.view = options.view;
		this.inputer = null;
		this.card = null;
		this.url = null;
		this.eCard = $(this.view).find('#card')[0];
		this.eFooter = $(this.view).find('.footer')[0];
		this.ePopupSign = $(this.view).find('#popup_sign')[0];
		this.ePopupSignHelp = $(this.view).find('#popup_sign_help')[0];
		this.ePopupEnroll = $(this.view).find('#popup_enroll')[0];
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
    				this.share();
    			}
            }.bind(this), true);
            
            $(this.ePopupSign).find('#li_close')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.ePopupSign.className = 'popup out';
            }.bind(this), true);
            
            $(this.ePopupSign).find('#input_sign')[0].addEventListener('input', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			if ($(e.target).val()) {
    				$(this.ePopupSign).find('#btn_action')[0].innerText = '完成';
    			} else {
    				$(this.ePopupSign).find('#btn_action')[0].innerText = '跳过';
    			}
            }.bind(this), true);
            
            $(this.ePopupSign).find('#btn_action')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.share();
            }.bind(this), true);
            
            $(this.ePopupSign).find('#a_help')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.ePopupSignHelp.className = 'popup in';
            }.bind(this), true);
            
            $(this.ePopupSignHelp).find('#li_close')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.ePopupSignHelp.className = 'popup out';
            }.bind(this), true);
            
            $(this.ePopupSignHelp).find('#li_close')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.ePopupSignHelp.className = 'popup out';
            }.bind(this), true);
            
            $(this.ePopupSignHelp).find('#btn_enroll')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.ePopupSignHelp.className = 'popup out';
    			this.ePopupEnroll.className = 'popup in';
            }.bind(this), true);
            
            $(this.ePopupEnroll).find('#li_close')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			this.ePopupEnroll.className = 'popup out';
            }.bind(this), true);
            
            $(this.ePopupEnroll).find('#btn_finish')[0].addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			var username = $(this.ePopupEnroll).find('#input_username')[0].value;
    			var password = $(this.ePopupEnroll).find('#input_password')[0].value;
    			var encrypt = new JSEncrypt();
    			encrypt.setPublicKey(rsa_public_key);
    			username = encrypt.encrypt(username);
    			password = encrypt.encrypt(password);
    			var data = {username: username, password: password};
    			var jqxhr = $.post(context.enroll_server, data, function( data ) {
    				var obj = eval('(' + data + ')');
    				if (obj.status == 'ok') {
    					context.bee_id = obj.bee_id;
    					prompt_message.prompt('注册成功!');
    					this.ePopupEnroll.className = 'popup out';
    					this.share();
    				} else {
    					prompt_message.prompt(obj.status);
    				}
    			}.bind(this));
    			jqxhr.fail(function() {
					prompt_message.prompt('远端服务出错了，稍后再试吧');
				});
            }.bind(this), true);
    	},
    	
    	share: function() {
    		var form = new FormData();
    		var signature = $(this.ePopupSign).find('#input_sign')[0].value;
    		if (signature) {
    			signature = encrypt.encrypt(signature);
    		}
    		form.append('comb_id', context.comb_id);
    		form.append('bee_id', context.bee_id);
    		form.append('signature', signature);
    		form.append('card_type', this.inputer.type);
    		form.append('card_notes', '{}');
    		var uploader = new Uploader({
				progress: document.getElementById('progress'),
				local_url: this.url,
				target_url: context.upload_server,
				form: form,
				onfinish: (function(obj) {
	    			return function(response) {
	    				if (response == 'ok') {
	    					var url = context.comb_server + 'comb_id=' + context.comb_id + '&bee_id=' + context.bee_id;
	    					window.location.replace(url);
	    				} else {
	    					prompt_message.prompt(response);
	    				}
	    			};
	    		})(this)
			});
    	},
        
    	display: function(e) {
    		this.ePopupSign.className = 'popup out';
    		this.ePopupSignHelp.className = 'popup out';
    		this.ePopupEnroll.className = 'popup out';
    		this.inputer = e.detail.inputer;
		    this.url = this.inputer.url;
    		
            if (this.inputer.type == 'image') {
    			this.eCard.className = 'card image_card';
    			this.eCard.dataset.url = this.url;
    			$(this.eCard).height($(this.view).height() - $(this.eFooter).innerHeight());
    			this.card = new ImageCard({view: this.eCard});
				return;

				var image = new Image();		
				image.src = this.inputer.url;
				image.onload = function() {
					var iw = image.width, ih = image.height;
					var scale = Math.min(context.width/iw, context.height/ih, 1.0);
					var canvas = downScaleImage(image, scale);
					this.url = canvas.toDataURL('image/jpeg', 1.0);
    			    this.eCard.className = 'card image_card';
    			    this.eCard.dataset.url = this.url;
    			    $(this.eCard).height($(this.view).height() - $(this.eFooter).innerHeight());
    			    this.card = new ImageCard({view: this.eCard});
    		    }.bind(this);
            }
    	},
    };

    root.ViewShare = ViewShare;
}).call(this);
