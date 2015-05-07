
(function() {
    var root = this;

    var ViewServing = function(options) {
        this.view = document.getElementById('view_setting');
        this.handlers = {
            'display': this.display.bind(this)
        };
        this.setEventListeners();
    };

    ViewServing.prototype = {
        display: function(e) {
        },
        
        setEventListeners: function() {
        }
    };

    root.ViewServing = ViewServing;
}).call(this);

function init() {
    checkRequestAnimationFrame();
    viewGroup = new ViewGroup();
    viewServing = new ViewServing();
    viewGroup.activeView(document.getElementById("view_serving"), {'handler': 'display'});
}
