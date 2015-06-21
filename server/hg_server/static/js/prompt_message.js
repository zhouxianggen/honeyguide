
(function() {
    var root = this;
    
	var PromptMessage = function(options) {
		this.view = options.view;
    };

    PromptMessage.prototype = {
        prompt: function(info) {
        	this.view.innerHTML = info;
        	this.view.className = 'in';
        	setTimeout(function() { this.view.className = 'out'; }.bind(this), 1000);
        },
    };

    root.PromptMessage = PromptMessage;
}).call(this);
