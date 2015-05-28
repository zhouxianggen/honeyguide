    	
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
		this.touchStarts = {};
		this.touchMoves = {};
		this.touchTimes = {};
		this.moveTouchId = null;
		
		this.setEventListeners();
	};

    CardList.prototype = {
    	setEventListeners: function() {
            this.view.addEventListener('touchstart', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	for (var i = 0, t; t = e.touches[i]; i++) {
            		this.touchStarts[t.identifier] = {x: t.pageX, y: t.pageY};
            		this.touchTimes[t.identifier] = new Date().getTime();
            	}
            	if (e.touches.length == 1) {
            		this.view.className = 'moving';
            		this.moveTouchId = e.touches[0].identifier;
            		this.position = $(this.view).position();
            		requestAnimationFrame(this.animate.bind(this));
            	}
            }.bind(this), false);

            this.view.addEventListener('touchmove', function(e) {
            	e.preventDefault();
            	e.stopPropagation();
                for (var i = 0, t; t = e.touches[i]; i++) {
                	this.touchMoves[t.identifier] = {x: t.pageX, y: t.pageY};
                }
            }.bind(this), false);
            
            this.view.addEventListener('touchend', function(e) {
            	for (var i = 0, t; t = e.changedTouches[i]; i++) {
            		delete this.touchStarts[t.identifier];
            		delete this.touchMoves[t.identifier];
            		delete this.touchTimes[t.identifier];
            		if (e.changedTouches[i] == this.moveTouchId) {
            			this.view.className = 'floating';
            			var sp = this.touchStarts[this.moveTouchId];
    					var mp = this.touchMoves[this.moveTouchId];
    					var deltaX = (mp && sp)? mp.x - sp.x : 0;
						var absX = Math.abs(deltaX);
						var endTime = new Date().getTime();
						var cardWidth = this.cards[this.cardIndex].width;
						var speed = absX / (endTime - this.touchTimes[this.moveTouchId]);
						if (absX*3 > cardWidth || speed > 0.2) {
							var deltaIndex = (deltaX < 0)? 1 : -1;
							this.cardIndex += deltaIndex;
							$(this.view).css({left: this.position.left - (deltaIndex * cardWidth)});
						}
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

