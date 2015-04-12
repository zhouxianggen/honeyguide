
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
                this.touchId = null;
                this.lastTouchX = null;
                this.pageIndex = 0;
                this.pageWidth = 0;
                this.moveTouchId = null;
                this.touchStartXs = {};
                this.touchStartTimes = {};
                
                this.inputImages = new Array();
                this.handlers = {
                        'display': this.display.bind(this), 
                        'addShare': this.addShare.bind(this)
                };
                this.setEventListeners();
        };

    ViewRead.prototype = {
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
                        if (this.eGallery.className == 'blur') {
                                $(this.eLinkers).fadeOut('fast');
                                $(this.eOpenLinkers).fadeIn('fast');
                                this.eGallery.className = 'active';
                        }
            }.bind(this));
            
                this.eOpenLinkers.addEventListener('click', function(e) {
                        e.stopPropagation();
                        $(this.eOpenLinkers).fadeOut('fast');
                        $(this.eLinkers).fadeIn('fast');
                        this.eLinkers.style.display = 'flex';
                        this.eGallery.className = 'blur';
            }.bind(this));
            
                this.eAddShare.addEventListener('click', function(e) {
                        this.eInputFiles.click();
                e.preventDefault();
            }.bind(this));
            
            this.eInputFiles.addEventListener('change', function(e) {
                e.stopPropagation();
                e.preventDefault();
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
            }.bind(this));
            
            this.ePageList.addEventListener('touchstart', function(e) {
                if (e.touches.length == 1 && !this.moveTouchId) {
                        this.moveTouchId = e.touches[0].identifier;
                        this.touchStartXs[this.moveTouchId] = e.touches[0].pageX;
                        this.touchStartTimes[this.moveTouchId] = new Date().getTime();
                }
            }.bind(this));

            this.ePageList.addEventListener('touchmove', function(e) {
                e.preventDefault();
                for (var i = 0; i < e.touches.length; i++) {
                        if(e.touches[0].identifier == this.moveTouchId) { // do move
                            var deltaX = e.touches[0].pageX - this.touchStartXs[this.moveTouchId];
                            var left = -(this.pageIndex * this.pageWidth) + deltaX;
                            this.ePageList.style.left = left + 'px';
                            document.getElementById('div_debug').innerHTML = 'pageIndex: '+this.pageIndex+' left: '+this.ePageList.style.left;
                        }
                }
            }.bind(this));
            
            this.ePageList.addEventListener('touchend', function(e) {
                e.preventDefault();
                                for (var i = 0; i < e.changedTouches.length; i++) {
                                        if (e.changedTouches[i].identifier == this.moveTouchId) {
                                                var deltaX = e.changedTouches[0].pageX - this.touchStartXs[this.moveTouchId];
                                                var absX = Math.abs(deltaX);
                                                var endTime = new Date().getTime();
                                                var speed = absX / (endTime - this.touchStartTimes[this.moveTouchId]);
                                                if (absX*3 > this.pageWidth || speed > 0.2) {
                                                        var duration = (this.pageWidth - absX)/this.pageWidth * 0.001;
                                                        this.pageIndex += (deltaX < 0)? 1 : -1;
                                                        this.setNoteCanvas(this.pageIndex);
                                                } else {
                                                        var duration = (absX)/this.pageWidth * 0.001;
                                                }
                                                this.ePageList.style.WebkitTransition = 'left ' + duration + 's easy-out';
                            this.ePageList.style.left = -(this.pageIndex * this.pageWidth) + 'px';
                            this.ePageList.style.WebkitTransition = 'ease-out';
                            delete this.touchStartTimes[this.moveTouchId];
                            delete this.touchStartXs[this.moveTouchId];
                            this.moveTouchId = null;
                                                document.getElementById('div_debug').innerHTML = 'pageIndex: '+this.pageIndex +' deltaX: '+deltaX+' speed: '+speed;
                                        }
                                }
            }.bind(this));
        },
        
        display: function(e) {
                this.ePages = $(this.ePageList).find('.div_page');
                for (var i = 0, e; e = this.ePages[i]; i++) {
                        var divCanvas = $(e).find('.canvas_page')[0];
                        divCanvas.width = e.clientWidth;
                                divCanvas.height = e.clientHeight;
                                this.pageWidth = e.clientWidth;
                                this.setNoteCanvas(i);
                }
                this.ePageList.style.left = -(this.pageIndex * this.pageWidth) + 'px';
                this.setNoteCanvas(this.pageIndex);
        },
        
        setNoteCanvas: function(i) {
                var root = this.ePages[i];
                var canvas = $(root).find('.canvas_page')[0];
                this.noteCanvas = new NoteCanvas({
                                root:root, canvas:canvas, path:canvas.dataset.img});
                        var divNotes = $(root).find('.div_note');
                        for (var j = 0, n; n = divNotes[j]; j++) {
                                if (n.dataset.type == 'text') {
                                        var position = {x: n.dataset.x, y: n.dataset.y};
                                        //noteCanvas.addTextNote(position, n.dataset.data);
                                }
                        }
        },
        
        addShare: function(e) {
        },
        
        animate: function(duration, tf) {
                tf = typeof tf !== 'undefined' ? tf : 'linear';
                this.ePageList.style.WebkitTransition = 'left ' + duration + 's ' + tf;
                this.ePageList.style.MozTransition = 'left ' + duration + 's ' + tf;
                this.ePageList.style.msTransition = 'left ' + duration + 's ' + tf;
                this.ePageList.style.transition = 'left ' + duration + 's ' + tf;
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

