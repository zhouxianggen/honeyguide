

(function() {
    var root = this;

	var ViewSetting = function(options) {
		this.view = document.getElementById('view_setting');
		this.ePhoneNumber = $(this.view).find('#div_phone_number')[0];
		this.eAddress = $(this.view).find('#div_address')[0];
		this.eFinish = $(this.view).find('#btn_finish')[0];
		this.eKeyboard = $(this.view).find('#table_keyboard')[0];
		this.eKeys = document.getElementsByClassName('key');
		this.handlers = {
			'display': this.display.bind(this)
		};
		this.setEventListeners();
	};

    ViewSetting.prototype = {
    	display: function(e) {
    	},
    	
    	setEventListeners: function() {
    		for (var i = 0; i < this.eKeys.length; i++) {
    			this.eKeys[i].addEventListener('click', function(e) {
    				var phoneNumber = '';
    				if (this.ePhoneNumber.className == 'numbers') {
    					phoneNumber = this.ePhoneNumber.innerHTML;
    				}
    				if (e.target.id == 'empty') {
    				} else if (e.target.id == 'del') {
    					var len = phoneNumber.length;
    					if (len > 0) {
    						phoneNumber = phoneNumber.substring(0, len-1);
    					}
    				} else {
    					phoneNumber += e.target.innerHTML;
    				}
    				if (phoneNumber.length > 0) {
    					this.ePhoneNumber.className = 'numbers';
    					this.ePhoneNumber.innerHTML = phoneNumber;
    				} else {
    					this.ePhoneNumber.className = 'hint';
    					this.ePhoneNumber.innerHTML = '设置您的电话号码';
    				}
    			}.bind(this));
    		}
    		
    		this.eFinish.addEventListener('click', function(e) {
    			e.stopPropagation();
    			e.preventDefault();
    			if (this.ePhoneNumber.className == 'numbers') {
    				var phoneNumber = this.ePhoneNumber.innerHTML;
    				if (phoneNumber.length > 0) {
    					var data = {'comb': this.view.dataset.comb, 'phone_number': phoneNumber};
    					$.post('free_call?act=set_phone_number', data, function(result) {
  							alert(result);
						});
						returnToApp('');
    				}
    			}
    			viewGroup.activeView(document.getElementById("view_read"));
            }.bind(this), false);
    	}
    };

    root.ViewSetting = ViewSetting;
}).call(this);

function init() {
	checkRequestAnimationFrame();
	viewGroup = new ViewGroup();
	viewSetting = new ViewSetting();
	viewGroup.activeView(document.getElementById("view_setting"));
}