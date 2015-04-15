
(function() {
    var root = this;

    var ViewAddTextNote = function(options) {
        this.view = document.getElementById('view_add_text_note');
        this.btnOk = document.getElementById('view_add_text_note_button_ok');
        this.textareaNote = document.getElementById('view_add_text_note_textarea_note');
        this.handlers = {
            'display': this.display.bind(this)
        };
        this.setEventListeners();
    };

    ViewAddTextNote.prototype = {
        display: function(e) {
            this.position = e.detail.position;
        },
        
        setEventListeners: function() {
            this.view.addEventListener('active', function(e) {
                e.stopPropagation();
                e.preventDefault();
                var handler = this.handlers && this.handlers[e.detail.handler];
                if (handler) {
                    handler(e);
                }
            }.bind(this));
            
            this.btnOk.addEventListener('click', function(e) {
                var note = null;
                if (this.textareaNote.value) {
                    note = {'type':'text', 'data':this.textareaNote.value, 'position':this.position};
                }
                viewGroup.activeView(document.getElementById('view_share'),
                    {'handler': 'addNote', 'note': note});
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
        this.eInputFiles = document.getElementById("input_files");
        this.eAddShare = document.getElementById('a_add_share');
        this.eOpenLinkers = document.getElementById('btn_open_linkers');
        this.eLinkers = document.getElementById('div_linkers');
        this.eGallery = document.getElementById('div_gallary');
        this.ePageList = document.getElementById('div_page_list');
        this.ePages = null;
        this.noteCanvas = null;
        this.noteCanvasList = new Array();
        this.pageIndex = 0;
        
        this.touchStarts = {};
        this.touchMoves = {};
        this.touchTimes = {};
        this.openLinkersTouchId = null;
        this.openLinkersPosition = {x: 0, y: 0};
        this.pageListTouchId = null;
        this.pageListPosition = {x: 0, y: 0};
        
        this.inputImages = new Array();
        this.handlers = {
            'display': this.display.bind(this), 
            'addShare': this.addShare.bind(this)
        };
        this.checkRequestAnimationFrame();
        this.setEventListeners();
    };

    ViewRead.prototype = {
        debug: function(info) {
            document.getElementById('div_debug').style.display = 'block';
            document.getElementById('div_debug').innerHTML = info;
        },
        
        isFileAPIValid: function() {
             return (window.File && window.FileReader && window.FileList &&  window.Blob);
        },
        
        setEventListeners: function() {
            this.view.addEventListener('active', function(e) {
                e.stopPropagation();
                e.preventDefault();
                var handler = this.handlers && this.handlers[e.detail.handler] || this.display.bind(this);
                handler(e);
            }.bind(this));
            
            this.view.addEventListener('click', function(e) {
                //e.preventDefault();
                if (this.eGallery.className == 'blur') {
                    e.stopPropagation();
                    $(this.eLinkers).fadeOut('fast');
                    $(this.eAddShare).fadeIn('fast');
                    $(this.eOpenLinkers).fadeIn('fast');
                    this.eGallery.className = 'active';
                }
            }.bind(this), false);
            
            this.eOpenLinkers.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this.eOpenLinkers).fadeOut('fast');
                $(this.eAddShare).fadeOut('fast');
                $(this.eLinkers).fadeIn('fast');
                this.eGallery.className = 'blur';
            }.bind(this), true);
            
            this.eOpenLinkers.addEventListener('touchstart', function(e) {
                if (e.touches.length == 1 && this.openLinkersTouchId == null) {
                    this.openLinkersTouchId = e.touches[0].identifier;
                    this.eOpenLinkers.className = 'pressed';
                    var rec1 = this.view.getBoundingClientRect();
                    var rec2 = this.eOpenLinkers.getBoundingClientRect();
                    this.openLinkersPosition.x = rec2.left - rec1.left;
                    this.openLinkersPosition.y = rec2.top - rec1.top;
                    requestAnimationFrame(this.animate.bind(this));
                }
            }.bind(this), true);
            
            this.eOpenLinkers.addEventListener('touchend', function(e) {
                for (var i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier == this.openLinkersTouchId) {
                        this.openLinkersTouchId = null;
                        this.eOpenLinkers.className = 'normal';
                    }
                }
            }.bind(this), true);
            
            this.ePageList.addEventListener('touchstart', function(e) {
                if (e.touches.length == 1 && this.pageListTouchId == null) {
                    this.pageListTouchId = e.touches[0].identifier;
                    var rec1 = this.view.getBoundingClientRect();
                    var rec2 = this.ePageList.getBoundingClientRect();
                    this.pageListPosition.x = rec2.left - rec1.left;
                    this.pageListPosition.y = rec2.top - rec1.top;
                    requestAnimationFrame(this.animate.bind(this));
                }
            }.bind(this), true);
            
            this.ePageList.addEventListener('touchend', function(e) {
                for (var i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier == this.pageListTouchId) {
                        var sp = this.touchStarts[this.pageListTouchId];
                        var mp = this.touchMoves[this.pageListTouchId];
                        var deltaX = (mp && sp)? mp.x - sp.x : 0;
                        var absX = Math.abs(deltaX);
                        var endTime = new Date().getTime();
                        var speed = absX / (endTime - this.touchTimes[this.pageListTouchId]);
                        if (absX*3 > this.pageWidth || speed > 0.2) {
                            var duration = (this.pageWidth - absX)/this.pageWidth * 0.002;
                            this.pageIndex += (deltaX < 0)? 1 : -1;
                            if (this.pageIndex < 0) {
                                this.pageIndex = 0;
                            }
                            if (this.pageIndex >= this.ePages.length) {
                                this.pageIndex = this.ePages.length - 1;
                            }
                        } else {
                            var duration = (absX)/this.pageWidth * 0.002;
                        }
                        this.ePageList.style.WebkitTransition = 'left ' + duration + 's easy-out';
                        this.pageListPosition.x = -(this.pageIndex * this.pageWidth);
                        this.ePageList.style.left = this.pageListPosition.x + 'px';
                        this.ePageList.style.WebkitTransition = 'ease-out';
                        this.pageListTouchId = null;
                    }
                }
            }.bind(this), true);
            
            this.eAddShare.addEventListener('click', function(e) {
                this.eAddShare.className = 'pressed';
                this.eInputFiles.click();
                e.preventDefault();
                e.stopPropagation();
            }.bind(this), false);
            
            this.eInputFiles.addEventListener('change', function(e) {
                for (var i = 0, f; f = this.inputElement.files[i]; i++) {
                    var reader = new FileReader();
                    reader.onload = (function(obj) {
                        return function(e) {
                            obj.inputImages.push(e.target.result);
                            if (obj.inputImages.length == obj.inputElement.files.length) {
                                viewGroup.activeView(document.getElementById("view_share"), 
                                    {'handler': 'display', 'images': obj.inputImages});
                            }
                        };
                    })(this);
                    reader.readAsDataURL(f);
                }
                e.stopPropagation();
                e.preventDefault();
            }.bind(this));
            
            this.view.addEventListener('touchstart', function(e) {
                //e.preventDefault();
                for (var i = 0, t; t = e.touches[i]; i++) {
                    this.touchStarts[t.identifier] = {x: t.pageX, y: t.pageY};
                    this.touchTimes[t.identifier] = new Date().getTime();
                }
            }.bind(this), false);

            this.view.addEventListener('touchmove', function(e) {
                e.preventDefault();
                for (var i = 0, t; t = e.touches[i]; i++) {
                    this.touchMoves[t.identifier] = {x: t.pageX, y: t.pageY};
                }
            }.bind(this), false);
            
            this.view.addEventListener('touchend', function(e) {
                //e.preventDefault();
                for (var i = 0, t; t = e.changedTouches[i]; i++) {
                    //this.touchMoves[t.identifier] = {x: t.pageX, y: t.pageY};
                    delete this.touchStarts[t.identifier];
                    delete this.touchMoves[t.identifier];
                    delete this.touchTimes[t.identifier];
                }
            }.bind(this), false);
        },
        
        display: function(e) {
            this.ePages = $(this.ePageList).find('.div_page');
            for (var i = 0, e; e = this.ePages[i]; i++) {
                var divCanvas = $(e).find('.canvas_page')[0];
                divCanvas.width = e.clientWidth;
                divCanvas.height = e.clientHeight;
                this.pageWidth = e.clientWidth;
                this.addNoteCanvas(i);
            }
            this.ePageList.style.left = -(this.pageIndex * this.pageWidth) + 'px';
        },
        
        addNoteCanvas: function(i) {
            var root = this.ePages[i];
            var canvas = $(root).find('.canvas_page')[0];
            var noteCanvas = new NoteCanvas({
                root:root, canvas:canvas, path:canvas.dataset.img});
            var divNotes = $(root).find('.div_note');
            for (var j = 0, n; n = divNotes[j]; j++) {
                if (n.dataset.type == 'text') {
                    var position = {x: n.dataset.x, y: n.dataset.y};
                    noteCanvas.addTextNote(position, n.dataset.data);
                }
            }
            this.noteCanvasList.push(noteCanvas);
        },
        
        addShare: function(e) {
        },
        
        animate: function() {
            if (this.pageListTouchId != null) {
                var sp = this.touchStarts[this.pageListTouchId];
                var mp = this.touchMoves[this.pageListTouchId];
                if (sp && mp) {
                    var deltaX = mp.x - sp.x;
                    this.ePageList.style.left = (this.pageListPosition.x + deltaX) + 'px';
                }
                requestAnimationFrame(this.animate.bind(this));
            }
            
            if (this.openLinkersTouchId != null) {
                var sp = this.touchStarts[this.openLinkersTouchId];
                var mp = this.touchMoves[this.openLinkersTouchId];
                if (sp && mp) {
                    var deltaX = mp.x - sp.x;
                    var deltaY = mp.y - sp.y;
                    this.eOpenLinkers.style.left = (this.openLinkersPosition.x + deltaX) + 'px';
                    this.eOpenLinkers.style.top = (this.openLinkersPosition.y + deltaY) + 'px';
                    //this.debug(deltaX+','+deltaY+','+this.eOpenLinkers.style.left+','+this.eOpenLinkers.style.top);
                }
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

    root.ViewRead = ViewRead;
}).call(this);

(function() {
    var root = this;
    var STATUS_ADD_TEXT_NOTE = 1;

    var ViewShare = function(options) {
        this.view = document.getElementById('view_share');
        this.divPage = document.getElementById('div_page');
        this.canvasPage = document.getElementById('canvas_page');
        this.divFooter = document.getElementById('div_footer');
        this.btnNoteText = document.getElementById('btn_note_text');
        this.btnNoteVoice = document.getElementById('btn_note_voice');
        this.btnOk = document.getElementById('btn_ok');
        this.noteCanvas = null;
        this.handlers = {
            'display': this.display.bind(this), 
            'addNote': this.addNote.bind(this)
        };
        this.setEventListeners();
    };

    ViewShare.prototype = {
        display: function(e) {
            this.divPage = document.getElementById('div_page');
            this.canvasPage = document.getElementById('canvas_page');
            this.canvasPage.width = this.divPage.clientWidth;
            this.canvasPage.height = this.divPage.clientHeight;
            this.noteCanvas = new NoteCanvas({
                root:this.divPage, canvas:this.canvasPage, path:e.detail.images[0]});
        },
        
        addNote: function(e) {
            var note = e.detail.note;
            if (!note) return;
            
            if (note.type == 'text') {
                this.noteCanvas.addTextNote(note.position, note.data);
            }
        },
        
        setEventListeners: function() {
            this.view.addEventListener('active', function(e) {
                e.stopPropagation();
                e.preventDefault();
                var handler = this.handlers && this.handlers[e.detail.handler];
                if (handler) {
                    handler(e);
                }
            }.bind(this));
            
            this.btnOk.addEventListener('click', function(e) {
                e.stopPropagation();
                viewGroup.activeView(document.getElementById("view_read"));
            }.bind(this));
            
            this.btnNoteText.addEventListener('click', function(e) {
                e.stopPropagation();
                this.status = STATUS_ADD_TEXT_NOTE;
            }.bind(this));
            
            this.view.addEventListener('click', function(e) {
                if (this.status == STATUS_ADD_TEXT_NOTE) {
                    this.status = null;
                    var position = {x: e.pageX, y: e.pageY};
                    viewGroup.activeView(document.getElementById("view_add_text_note"),
                        {'handler': 'display', 'position': position});
                }
            }.bind(this));
        }
    };

    root.ViewShare = ViewShare;
}).call(this);

function init() {
    viewGroup = new ViewGroup();
    viewAddTextNote = new ViewAddTextNote();
    viewShare = new ViewShare();
    viewRead = new ViewRead();
    
    viewGroup.activeView(document.getElementById("view_read"));
}

