    	
(function() {
    var root = this;

	var Gallery = function(options) {
		this.view = options.view;
		this.eCardList = $(this.view).find('#card_list')[0];
		this.cards = new Array();
		var kids = $(this.eCardList).children();
		for (var i = 0; i < kids.length; i++) {
			if (kids[i].className == 'image_card') {
				this.cards.push(new ImageCard({view: kids[i]}));
			} else {
				kids[i].style.display = 'none';
			}
		}
		this.cardIndex = 0;
		
        this.lastX = null;
        this.lastLeft = null;
        this.lastTime = null;
		this.moveTouchId = null;
		
		this.setEventListeners();
	};

    Gallery.prototype = {
    	setEventListeners: function() {
            this.view.addEventListener('touchstart', function(e) {
                this.lastX          = null;
				this.lastLeft       = null;
                this.lastTime       = null;
				this.moveTouchId    = null;
            }.bind(this), false);

            this.view.addEventListener('touchmove', function(e) {
            	if (e.targetTouches.length == 1) {
					e.preventDefault();
            		e.stopPropagation();
					this.eCardList.className = 'moving';
            		var relativeX = e.targetTouches[0].pageX
					if (this.lastX != null && this.lastLeft != null) {
						var deltaX = relativeX - this.lastX;
						$(this.eCardList).css({left: this.lastLeft + deltaX})
						debug('left=' + $(this.eCardList).position().left);
					} else {
						this.eCardList.className = 'moving';
						this.lastX = relativeX;
						this.lastLeft = $(this.eCardList).position().left;
						this.lastTime = new Date().getTime();
						this.moveTouchId = e.targetTouches[0].identifier;
					}
            	}
            }.bind(this), false);
            
            this.view.addEventListener('touchend', function(e) {
            	for (var i = 0, t; t = e.changedTouches[i]; i++) {
            		if (e.changedTouches[i].identifier == this.moveTouchId) {
            			this.eCardList.className = 'floating';
						var deltaX = e.changedTouches[i].pageX - this.lastX;
						var endTime = new Date().getTime();
						var deltaT = endTime - this.lastTime;
						var absX = Math.abs(deltaX);
						var cardWidth = this.cards[this.cardIndex].width;
						var speed = absX / deltaT;
						debug('deltaX=' + deltaX + ", speed=" + speed);
						if (absX*2.1 > cardWidth || speed > 0.2) {
							this.cardIndex += (deltaX < 0)? 1 : -1;
							if (this.cardIndex < 0) {
								this.cardIndex = 0;
							} else if (this.cardIndex >= this.cards.length) {
								// request more cards from server
								var data = {
									comb_id: context.comb_id,
									bee_id: context.bee_id,
									start: this.cards.length,
									count: 10
								};
								$.post(context.waggles_server_url, data, function(data, status) {
									debug('status: '+status+' data:'+data);
									this.cardIndex =  this.cards.length;
									if (status == 'success') {
										this.eCardList.innerHTML = this.eCardList.innerHTML + data;
										var kids = $(this.eCardList).children();
										for (var i = this.cards.length; i < kids.length; i++) {
											if (kids[i].className == 'image_card') {
												this.cards.push(new ImageCard({view: kids[i]}));
											} else {
												kids[i].style.display = 'none';
											}
										}
									}
								}.bind(this));
							}
						}
						var newLeft = 0;
						for (var i = 0; i < this.cardIndex; i++) {
							newLeft -= this.cards[i].width;
						}
						debug('left=' + $(this.eCardList).position().left + ", newleft=" + newLeft);
						$(this.eCardList).css({left: newLeft});
						this.moveTouchId = null;
            		}
				}
            }.bind(this), false);
    	},
    	
    	animate: function() {
		}
    };

    root.Gallery = Gallery;
}).call(this);

