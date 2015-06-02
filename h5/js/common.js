
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

// thx to: https://github.com/jhuckaby/webcamjs/blob/master/webcam.js
function base64DecToArr (sBase64, nBlocksSize) {
	// convert base64 encoded string to Uintarray
	// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
	var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
		nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, 
		taBytes = new Uint8Array(nOutLen);
	
	for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
		nMod4 = nInIdx & 3;
		nUint24 |= this.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
		if (nMod4 === 3 || nInLen - nInIdx === 1) {
			for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
				taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
			}
			nUint24 = 0;
		}
	}
	return taBytes;
}
	
function uploadImage (image_data_uri, target_url, caller) {
	// submit image data to server using binary AJAX
	
	// detect image format from within image_data_uri
	var image_fmt = '';
	if (image_data_uri.match(/^data\:image\/(\w+)/))
		image_fmt = RegExp.$1;
	else
		throw "Cannot locate image format in Data URI";
	
	// extract raw base64 data from Data URI
	var raw_image_data = image_data_uri.replace(/^data\:image\/\w+\;base64\,/, '');
	
	// contruct use AJAX object
	var http = new XMLHttpRequest();
	http.open("POST", target_url, true);
	
	// setup progress events
	if (http.upload && http.upload.addEventListener) {
		http.upload.addEventListener( 'progress', function(e) {
			if (e.lengthComputable) {
				var progress = e.loaded / e.total;
				caller.dispatch('uploadProgress', progress, e);
			}
		}, false );
	}
	
	// completion handler
	http.onload = function() {
		caller.dispatch('uploadComplete', http.status, http.responseText, http.statusText);
	};
	
	// create a blob and decode our base64 to binary
	var blob = new Blob( [ base64DecToArr(raw_image_data) ], {type: 'image/'+image_fmt} );
	
	// stuff into a form, so servers can easily receive it as a standard file upload
	var form = new FormData();
	form.append( 'hg', blob, "hg."+image_fmt.replace(/e/, '') );
	
	// send data to server
	http.send(form);
}
