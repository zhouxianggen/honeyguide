
(function() {
    var root = this;
    
	var VideoCard = function(options) {
		this.view = options.view;
		rec = this.view.getBoundingClientRect();
        this.video = $(this.view).find('video')[0];
        this.video.width = rec.right - rec.left;
        this.video.height = rec.bottom - rec.top;
        this.video.src = this.view.dataset.url;
        this.setEventListeners();
    };

    VideoCard.prototype = {
        animate: function() {
        },

        setEventListeners: function() {
        	this.view.addEventListener('click', function(e) {
            }.bind(this), false);
        }
    };

    root.VideoCard = VideoCard;
}).call(this);
