    	
(function() {
    var root = this;

	var CardList = function(options) {
		this.view = options.view;
		this.cards = new Array();
		var kids = $(this.view).children();
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

    CardList.prototype = {
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
					this.view.className = 'moving';
            		var relativeX = e.targetTouches[0].pageX
					if (this.lastX != null && this.lastLeft != null) {
						var deltaX = relativeX - this.lastX;
						$(this.view).css({left: this.lastLeft + deltaX})
					} else {
						this.lastX = relativeX;
						this.lastLeft = $(this.view).position().left;
						this.lastTime = new Date().getTime();
						this.moveTouchId = e.targetTouches[0].identifier;
						requestAnimationFrame(this.animate.bind(this));
					}
            	}
            }.bind(this), false);
            
            this.view.addEventListener('touchend', function(e) {
            	for (var i = 0, t; t = e.changedTouches[i]; i++) {
            		if (e.changedTouches[i].identifier == this.moveTouchId) {
						//e.preventDefault();
            			//e.stopPropagation();
            			this.view.className = 'floating';
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
								this.cardIndex =  this.cards.length - 1;
							}
							var newLeft = 0;
							for (var i = 0; i < this.cardIndex; i++) {
								newLeft -= this.cards[i].width;
							}
							debug('left=' + $(this.view).position().left + ", newleft=" + newLeft);
							$(this.view).css({left: newLeft});
						}
						var newLeft = 0;
						for (var i = 0; i < this.cardIndex; i++) {
							newLeft -= this.cards[i].width;
						}
						debug('left=' + $(this.view).position().left + ", newleft=" + newLeft);
						$(this.view).css({left: newLeft});
						this.view.className = 'moving';
						this.moveTouchId = null;
            		}
				}
            }.bind(this), false);
    	},
    	
    	animate: function() {
    		if (this.moveTouchId != null) {
    			var sp = this.touchStarts[this.moveTouchId];
    			var mp = this.touchMoves[this.moveTouchId];
    			if (sp && mp) {
    				var deltaX = mp.x - sp.x;
    				$(this.view).css({left: this.position.left + deltaX});
    			}
    			requestAnimationFrame(this.animate.bind(this));
    		}
		}
    };

    root.CardList = CardList;
}).call(this);

