
(function() {
    var root = this; //global object
    
    var AudioNote = function(parent, position, text) {
        this.parent = parent;
        this.position = position;
        this.text = text;
        this.eNote = document.createElement('div');
        this.eNote.className = 'div_audio_note';
        this.parentView = this.parent.getView();
        this.eNote.style.display = 'none';
        this.parentView.appendChild(this.eNote);
        this.init = false;
        this.once = true;
    };
    
    AudioNote.prototype = {
        animate: function() {
            if (this.init) {
                var p = this.parent.getPosition();
                var a = this.parent.getArea();
                var left = p.x + a.width * this.position.x;
                var top = p.y + a.height * this.position.y;
                this.eNote.style.left = left + 'px';
                this.eNote.style.top = top + 'px';
                this.eNote.style.display = 'block';
            } else {
                var a = this.parent.getArea();
                if (a.width > 0 && a.height > 0) {
                    this.init = true;
                }
            }
        }
    };
    
    var TextNote = function(parent, position, text) {
        this.parent = parent;
        this.position = position;
        this.text = text;
        this.eNote = document.createElement('div');
        this.eNote.className = 'div_text_note';
        this.eNote.innerHTML = this.text;
        this.parentView = this.parent.getView();
        this.eNote.style.display = 'none';
        this.parentView.appendChild(this.eNote);
        this.init = false;
        this.once = true;
    };
    
    TextNote.prototype = {
        animate: function() {
            if (this.init) {
                var p = this.parent.getPosition();
                var a = this.parent.getArea();
                var left = p.x + a.width * this.position.x;
                var top = p.y + a.height * this.position.y;
                this.eNote.style.left = left + 'px';
                this.eNote.style.top = top + 'px';
                this.eNote.style.display = 'block';
            } else {
                var a = this.parent.getArea();
                if (a.width > 0 && a.height > 0) {
                    this.init = true;
                }
            }
        }
    };
    
    var ImageTouchCanvas = function(options) {
        this.canvas = options.canvas;
        this.context = this.canvas.getContext('2d');
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur = 4;
        this.context.shadowColor = "#000000";

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
                if(this.scale > this.scaleRange.min) {
                    e.stopPropagation();
                }
                
                this.lastX          = null;
                this.lastY          = null;
                this.lastZoomScale  = null;
                this.scaleCenter    = null;
            }.bind(this), false);

            this.canvas.addEventListener('touchmove', function(e) {
                if(this.scale > this.scaleRange.min) {
                    e.stopPropagation();
                }
                
                e.preventDefault();
                
                if(e.targetTouches.length == 2) {
                    this.doZoom(this.gesturePinchZoom(e));
                }
                else if(e.targetTouches.length == 1 && this.scale > this.scaleRange.min) {
                    e.stopPropagation();
                    var relativeX = e.targetTouches[0].pageX - this.canvas.getBoundingClientRect().left;
                    var relativeY = e.targetTouches[0].pageY - this.canvas.getBoundingClientRect().top;                
                    this.doMove(relativeX, relativeY);
                }
            }.bind(this), false);
            
            this.canvas.addEventListener('touchend', function(e) {
                if(this.scale > this.scaleRange.min) {
                    e.stopPropagation();
                }
            }.bind(this), false);
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
            var note = new TextNote(this, position, text);
            this.notes.push(note);
        },
        
        addAudioNote: function(position, audio) {
            var note = new AudioNote(this, position, audio);
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

