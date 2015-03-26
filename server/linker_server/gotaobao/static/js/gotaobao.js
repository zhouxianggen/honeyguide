
navigator.__defineGetter__('userAgent', function() {
    return 'uc facked user agent';
});

function init() {
	alert(navigator.userAgent);
}