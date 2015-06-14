
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

function isFileAPIValid () {
	return (window.File && window.FileReader && window.FileList &&  window.Blob);
}

function  checkRequestAnimationFrame () {
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

function debug (info) {
	document.getElementById('div_debug').style.display = 'block';
	document.getElementById('div_debug').innerHTML = info;
}

rsa_public_key = '-----BEGIN PUBLIC KEY-----' +
'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJesWXbm1YhJL+/LFMlnNgkbAw' +
'AhRxHX7v+fhA3tJSfIU4bwt9vDUWP6F4lKTDB9cp6YNPz3OaBX7Sp5f2tVDFUt8u' +
'6BAnZiA5M9wElBMlJAek15gj9ljJbX2VHKhSxLfoenvSdaA1cKbSfPBqTEbTvXlX' +
'TteiCqMXgA14p8V/qwIDAQAB' +
'-----END PUBLIC KEY-----';

context = document.getElementById('context').dataset;


