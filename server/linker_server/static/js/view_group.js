
(function() {
    var root = this;

    var ViewGroup = function(options) {
        this.views = document.getElementsByClassName('view');
    };

    ViewGroup.prototype = {
        activeView: function(view, data) {
            data = typeof data !== 'undefined' ? data : {};
            
            for (var i = 0; i < this.views.length; i++) {
                $(this.views[i]).fadeOut('slow');
            }
            
            for (var i = 0; i < this.views.length; i++) {
                if (this.views[i] == view) {
                    this.views[i].style.left = '0';
                    this.views[i].style.top = '0';
                    this.views[i].style.width = window.innerWidth + 'px';
                    this.views[i].style.height = window.innerHeight + 'px';
                    document.title = this.views[i].dataset.title;
                    $(this.views[i]).fadeIn('slow');
                    var event = new CustomEvent('active', {'detail': data});
                    this.views[i].dispatchEvent(event);
                    break;
                }
            }
        }
    };

    root.ViewGroup = ViewGroup;
}).call(this);

