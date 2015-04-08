
(function() {
    var root = this;

        var ViewGroup = function(options) {
                this.views = document.getElementsByClassName("view");
        };

    ViewGroup.prototype = {
        setTopView: function(view) {
                for (var i = 0; i < this.views.length; i++) {
                        $(this.views[i]).fadeOut("slow");
                }
                
                for (var i = 0; i < this.views.length; i++) {
                        if (this.views[i] == view) {
                                this.views[i].style.left = '0';
                                this.views[i].style.top = '0';
                                this.views[i].style.width = window.innerWidth + 'px';
                                        this.views[i].style.height = window.innerHeight + 'px';
                                $(this.views[i]).fadeIn("slow");
                                break;
                        }
                }
        }
    };

    root.ViewGroup = ViewGroup;
}).call(this);

