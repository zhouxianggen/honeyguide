
(function() {
    var root = this; //global object
    
    var TextNote = function(options) {
        this.container = options.container;
        this.percentX = options.percentX;
        this.percentY = options.percentY;
        this.text = options.text;
        this.element = document.createElement('div');
        this.element.className = 'text_note';
        this.element.innerHTML = this.text;
        this.parentView = this.container.getView();
        this.parentView.appendChild(this.element);
        this.init = false;
    };
    
    TextNote.prototype = {
        animate: function() {
                if (this.init) {
                        var p = this.container.getPosition();
                        var area = this.container.getArea();
                    var left = p.x + area.width * this.percentX;
                    var top = p.y + area.height * this.percentY;
                    this.element.style.left = left + 'px';
                    this.element.style.top = top + 'px';
                    this.init = true;
                } else {
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        this.element.appendChild(canvas);
                        
                        var width = canvas.width;
                            var height = canvas.height;
                            var mid = Math.min(width*0.3, height*0.3);      
                            ctx.beginPath();
                            ctx.moveTo(0, 0);
                            ctx.lineTo(0, height-mid);
                            ctx.quadraticCurveTo(0, height, mid, height);
                            ctx.lineTo(width, height);
                            ctx.lineTo(width, mid);
                            ctx.quadraticCurveTo(width, 0, width-mid, 0);
                            ctx.lineTo(0, 0);
                        ctx.fillStyle = "rgba(14, 14, 14, 0.75)";
                        ctx.fill();
  
                        this.init = true;
                }
        }
    };
    
        var ImageTouchCanvas = function(options) {
        this.canvas = options.canvas;
        this.context = this.canvas.getContext('2d');

                this.init = false;
                this.position = {x: 0, y: 0};
        this.scale = 1.0;
        this.scaleCenter = {x: 0, y: 0};
        this.scaleRange = {min: 0, max: 0};
        
                this.imgTexture = new Image();
        this.imgTexture.src = options.path;
        this.imgTexture.onload = function() {
                        var cw = this.canvas.clientWidth, ch = this.canvas.clientHeight;
                var iw = this.imgTexture.width, ih = this.imgTexture.height;
            this.scale = Math.min(cw/iw, ch/ih);
            this.scaleRange = {min: this.scale, max: 4};
                        this.position.x= (cw - this.scale * iw) / 2;
                        this.position.y = (ch - this.scale * ih) / 2;
                        this.init = true;
                }.bind(this);

        this.lastZoomScale = null;
        this.lastX = null;
        this.lastY = null;
        this.setEventListeners();
    };

    ImageTouchCanvas.prototype = {
        animate: function() {
                if (this.init) {
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
                    this.context.drawImage(
                        this.imgTexture, 
                        this.position.x, this.position.y, 
                        this.scale * this.imgTexture.width, 
                        this.scale * this.imgTexture.height);
                }
        },

        gesturePinchZoom: function(event) {
            var zoom = false;

            if( event.targetTouches.length >= 2 ) {
                var p1 = event.targetTouches[0];
                var p2 = event.targetTouches[1];
                var zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)); //euclidian distance

                if( this.lastZoomScale ) {
                    zoom = (zoomScale - this.lastZoomScale) / 100;
                } else {
                        this.scaleCenter = {x: (p1.pageX + p2.pageX)/2, y: (p1.pageY + p2.pageY)/2}
                }

                this.lastZoomScale = zoomScale;
            }    

            return zoom;
        },

        doZoom: function(zoom) {
            if(!zoom) return;
            
            var currentScale = this.scale;
            var newScale = this.scale + zoom;
            if (newScale < this.scaleRange.min) {
                newScale = this.scaleRange.min;
            }
            if (newScale > this.scaleRange.max) {
                newScale = this.scaleRange.max;
            }
            var deltaScale = newScale - currentScale;
            var currentWidth    = (this.imgTexture.width * this.scale);
            var currentHeight   = (this.imgTexture.height * this.scale);
            var deltaWidth  = this.imgTexture.width*deltaScale;
            var deltaHeight = this.imgTexture.height*deltaScale;
            var deltaX = (deltaHeight * (this.scaleCenter.x - this.position.x)) / currentHeight;
            var deltaY = (deltaWidth * (this.scaleCenter.y - this.position.y)) / currentWidth;
            this.scale = newScale;
            this.position.x -= deltaX;
            this.position.y -= deltaY;
            this.alignEdge();
        },

        doMove: function(relativeX, relativeY) {
            if(this.lastX && this.lastY) {
                var deltaX = relativeX - this.lastX;
                                var deltaY = relativeY - this.lastY;
                                this.position.x += deltaX;
                                this.position.y += deltaY;
                this.alignEdge();
            }
            this.lastX = relativeX;
            this.lastY = relativeY;
        },
        
        alignEdge: function() {
                var cw = this.canvas.clientWidth, ch = this.canvas.clientHeight;
                var iw = this.imgTexture.width * this.scale, ih = this.imgTexture.height * this.scale;
            if (iw < cw) {
                this.position.x= (cw - iw) / 2;
            } else {
                if (this.position.x > 0) {
                        this.position.x = 0;
                }
                if (this.position.x + iw < cw) {
                        this.position.x = cw - iw;
                }
            }
            if (ih < ch) {
                                this.position.y = (ch - ih) / 2;
            } else {
                if (this.position.y > 0) {
                        this.position.y = 0;
                }
                if (this.position.y + ih < ch) {
                        this.position.y = ch - ih;
                }
            }
        },

        setEventListeners: function() {
            this.canvas.addEventListener('touchstart', function(e) {
                this.lastX          = null;
                this.lastY          = null;
                this.lastZoomScale  = null;
                this.scaleCenter    = null;
            }.bind(this));

            this.canvas.addEventListener('touchmove', function(e) {
                e.preventDefault();
                
                if(e.targetTouches.length == 2) {
                    this.doZoom(this.gesturePinchZoom(e));
                }
                else if(e.targetTouches.length == 1) {
                    var relativeX = e.targetTouches[0].pageX - this.canvas.getBoundingClientRect().left;
                    var relativeY = e.targetTouches[0].pageY - this.canvas.getBoundingClientRect().top;                
                    this.doMove(relativeX, relativeY);
                }
            }.bind(this));
        }
    };
    
    var NoteCanvas = function(options) {
                this.root = options.root;
                this.imageTouchCanvas = new ImageTouchCanvas(options);
                this.notes = new Array();
        this.checkRequestAnimationFrame();
        requestAnimationFrame(this.animate.bind(this));
    };

    NoteCanvas.prototype = {
        addTextNote: function(position, text) {
                var p = this.imageTouchCanvas.position;
                var w = this.imageTouchCanvas.imgTexture.width * this.imageTouchCanvas.scale;
                var h = this.imageTouchCanvas.imgTexture.height * this.imageTouchCanvas.scale;
//          alert(position.x + ', ' + position.y);
//          alert(p.x + ', ' + p.y);
//          alert(w + ', ' + h);
                        var percentX = (position.x - p.x) / w;
                        var percentY = (position.y - p.y) / h;
//          alert(percentX + ', ' + percentY);
                        var options = {'container': this, 'percentX': percentX, 'percentY': percentY, 'text': text};    
                var note = new TextNote(options);
                this.notes.push(note);
        },
        
        getView: function() {
                return this.root;   
        },
        
        getPosition: function() {
                return this.imageTouchCanvas.position;
        },
        
        getArea: function() {
                var iw = this.imageTouchCanvas.imgTexture.width;
                var ih = this.imageTouchCanvas.imgTexture.height;
                var scale = this.imageTouchCanvas.scale;
                return {width: iw * scale, height: ih * scale};
        },
        
        animate: function() {
                this.imageTouchCanvas.animate();
                for (var i = 0, note; note = this.notes[i]; i++) {
                        note.animate();
                }
            requestAnimationFrame(this.animate.bind(this));
        },

        checkRequestAnimationFrame: function() {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame = 
                        window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
            }
        }
    };

    root.NoteCanvas = NoteCanvas;
}).call(this);

