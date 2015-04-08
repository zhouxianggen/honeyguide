
(function() {
    var root = this;

        var ViewAddTextNote = function(options) {
                this.view = document.getElementById('view_add_text_note');
                this.button = document.getElementById('button_ok');
                this.textarea = document.getElementById('textarea_note');
                this.setEventListeners();
        };

    ViewAddTextNote.prototype = {
        getText: function() {
                return this.textarea.value;
        },
        
        setEventListeners: function() {
            this.button.addEventListener('click', function(e) {
                alert(this.getText());
                        viewGroup.setTopView(document.getElementById("view_share"));
            }.bind(this));
        }
    };

    root.ViewAddTextNote = ViewAddTextNote;
}).call(this);

(function() {
    var root = this;

        var ViewRead = function(options) {
                if (!this.isFileAPIValid()) {
                        alert('file api not valid');
                }
                this.view = document.getElementById('view_read');
                this.inputElement = document.getElementById("input_files");
                this.aElement = document.getElementById('a_share');
                this.images = new Array();
                this.setEventListeners();
        };

    ViewRead.prototype = {
        isFileAPIValid: function() {
                 return (window.File && window.FileReader && window.FileList &&  window.Blob);
        },
        
        setEventListeners: function() {
                this.aElement.addEventListener('click', function(e) {
                        this.inputElement.click();
                e.preventDefault();
            }.bind(this));
            
            this.inputElement.addEventListener('change', function(e) {
                e.stopPropagation();
                e.preventDefault();
                var urls = new Array();
                for (var i = 0, f; f = this.inputElement.files[i]; i++) {
                        var reader = new FileReader();
                        reader.onload = (function(obj) {
                                return function(e) {
                                        obj.images.push(e.target.result);
                                        if (obj.images.length == obj.inputElement.files.length) {
                                                viewGroup.setTopView(document.getElementById("view_share"));
                                                viewShare.init(obj.images);
                                        }
                                };
                        })(this);
                        reader.readAsDataURL(f);
                }
            }.bind(this));
        }
    };

    root.ViewRead = ViewRead;
}).call(this);

(function() {
    var root = this;

        var ViewShare = function(options) {
                this.view = document.getElementById('view_share');
                this.divPageList = null;
                this.pages = new Array();
                this.lastX = null;
                this.left = 0;
                this.inited = false;
        };

    ViewShare.prototype = {
        init: function(images) {
                this.view.innerHTML = this.generateInnerHtml(images);
                this.divPageList = document.getElementById('div_page_list');
                        var pages = this.view.getElementsByClassName('div_page');
                        for (var i = 0; i < pages.length; i++) {
                                var canvas = pages[i].getElementsByClassName('canvas_page')[0];
                                canvas.width = pages[i].clientWidth;
                                canvas.height = pages[i].clientHeight;
                                var noteCanvas = new NoteCanvas({root:pages[i], canvas:canvas, path:images[i]});
                                this.pages.push(noteCanvas);
                        }
                        this.setEventListeners();
                        this.inited = true;
        },
        
        generatePageInnerHtml: function(image) {
                var html = '<canvas class="canvas_page"></canvas>';
                return html;
        },
        
        generateInnerHtml: function(images) {
                var cnt = images.length;
                var html = '<div id="div_page_list">';
                html += '<div class="div_swip_page" style="left: -10%;">';
                html += this.generatePageInnerHtml((cnt==1)? null : images[0]);
                html += '</div>';
                html += '<ul>';
                for (var i = 0; i < cnt; i++) {
                        html += '<li><div class="div_page">';
                        html += this.generatePageInnerHtml(images[0]);
                        html += '</div></li>';
                }
                html += '</ul>';
                html += '<div class="div_swip_page" style="left: ' + cnt + '0%;">';
                html += this.generatePageInnerHtml((cnt==1)? null : images[cnt-1]);
                html += '</div>';
                html += '</div>';
                return html;
        },
        
        doMove: function(relativeX, relativeY) {
            if(this.lastX) {
                var deltaX = relativeX - this.lastX;
                                this.left += deltaX;
            }
            this.lastX = relativeX;
        },
        
        setEventListeners: function() {
                this.divPageList.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                this.lastX  = null;
            }.bind(this));

            this.divPageList.addEventListener('touchmove', function(e) {
                e.preventDefault();
                if(e.targetTouches.length == 1) {
                    var relativeX = e.targetTouches[0].pageX - this.divPageList.getBoundingClientRect().left;
                    var relativeY = e.targetTouches[0].pageY - this.divPageList.getBoundingClientRect().top;                
                    this.doMove(relativeX, relativeY);
                }
            }.bind(this));
            
            this.divPageList.addEventListener('touchend', function(e) {
                        e.preventDefault();
            }.bind(this));
        },
        
        animate: function() {
                if (this.inited) {
                        this.divPageList.style.left = this.left + 'px';
                requestAnimationFrame(this.animate.bind(this));
                }
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

    root.ViewShare = ViewShare;
}).call(this);

function init() {
        viewGroup = new ViewGroup();
        viewAddTextNote = new ViewAddTextNote();
        viewShare = new ViewShare();
        viewRead = new ViewRead();
        
        viewGroup.setTopView(document.getElementById("view_read"));
}

