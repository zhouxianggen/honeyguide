
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
                                                viewGroup.activeView(document.getElementById("view_share"), 
                                                        {'handler': 'display', 'images': obj.images});
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

