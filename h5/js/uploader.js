
// thx to: https://github.com/jhuckaby/webcamjs/blob/master/webcam.js
(function() {
    var root = this;

	var Uploader = function(options) {
		this.progress = options.progress;
		this.onfinish = options.onfinish;
		this.local_url = options.local_url;
		this.target_url = options.target_url;
		this.uploadFile().bind(this);
	};

    Uploader.prototype = {
		base64DecToArr: function (sBase64, nBlocksSize) {
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
		},
			
		uploadFile: function () {
			// submit image data to server using binary AJAX

			// detect image format from within image_data_uri
			var typ = '';
			var fmt = '';
			var raw = '';
			if (this.local_url.match(/^data\:(\w+)\/(\w+);base64\,(\S+)$/)) {
				typ = RegExp.$1;
				fmt = RegExp.$2;
				raw = RegExp.$3;
			} else {
				throw "Cannot parse " + this.local_url;
			}
	
			// contruct use AJAX object
			var http = new XMLHttpRequest();
			http.open("POST", this.target_url, true);
			
			// setup progress events
			if (http.upload && http.upload.addEventListener) {
				http.upload.addEventListener( 'progress', function(e) {
					if (e.lengthComputable) {
						this.progress.dispatchEvent(new CustomEvent('progress', {'detail': e.loaded / e.total}));
					}
				}, false );
			}
			
			// completion handler
			http.onload = function() {
				this.status = http.status;
				this.reponseText = http.responseText;
				this.progress.dispatchEvent(new CustomEvent('complete'));
				this.onfinish();
			};
			
			// create a blob and decode our base64 to binary
			var blob = new Blob( [ this.base64DecToArr(raw) ], {type: typ+'/'+fmt} );
			
			// stuff into a form, so servers can easily receive it as a standard file upload
			var form = new FormData();
			form.append( 'upload', blob, "upload." + fmt.replace(/e/, '') );
			
			// send data to server
			http.send(form);
		}.bind(this),
    };

    root.Uploader = Uploader;
}).call(this);
