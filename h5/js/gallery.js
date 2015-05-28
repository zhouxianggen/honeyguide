    	
(function() {
    var root = this;

	var Gallery = function(options) {
		this.view = options.view;
		this.cardList = new CardList({view: $(this.view).find('#card_list')[0]});

		this.setEventListeners();
	};

    Gallery.prototype = {
    	setEventListeners: function() {
    	},
    	
    	animate: function() {
		}
    };

    root.Gallery = Gallery;
}).call(this);

