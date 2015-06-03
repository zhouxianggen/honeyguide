    	
(function() {
    var root = this;

	var Input = function(options) {
		this.view = options.view;
		this.progress = options.progress;
		this.onInputFinished = options.onInputFinished;
		this.onUploadFinished = options.onUploadFinished;
		this.eInput = $(this.view).find('input')[0];
		this.accept = $(this.eInput).attr('accept');
		if (this.accept.match(/^(\w+)\/(\S+)/))
			this.accept = RegExp.$1;
		else
			throw 'error accept type ' + this.accept;
		this.url = null;
		this.format = null;
		this.raw_data = null;
		this.setEventListeners();
	};

    Input.prototype = {
    	// thx to: https://github.com/jhuckaby/webcamjs/blob/master/webcam.js
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
			
		uploadFile: function (target_url) {
			// submit image data to server using binary AJAX

			// contruct use AJAX object
			var http = new XMLHttpRequest();
			http.open("POST", target_url, true);
			
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
				var data = {stauts: http.status, reponseText: http.responseText};
				this.progress.dispatchEvent(new CustomEvent('complete'));
			};
			
			// create a blob and decode our base64 to binary
			var blob = new Blob( [ this.base64DecToArr(this.raw_data) ], {type: 'image/'+this.format} );
			
			// stuff into a form, so servers can easily receive it as a standard file upload
			var form = new FormData();
			form.append( 'hg', blob, "hg."+this.format.replace(/e/, '') );
			
			// send data to server
			http.send(form);
		}.bind(this),			

    	setEventListeners: function() {
            this.view.addEventListener('click', function(e) {
            	e.stopPropagation();
    			e.preventDefault();
    			this.eInput.click();
            }.bind(this), false);
            
            this.eInput.addEventListener('click', function(e) {
            	e.stopPropagation();
            }.bind(this), true);
            
            this.eInput.addEventListener('change', function(e) {
            	e.stopPropagation();
            	e.preventDefault();
            	if (this.eInput.files.length <= 0)
            		return;
        		var reader = new FileReader();
        		reader.onprogress = (function(obj) {
        			return function(e) {
        				if (e.lengthComputable) {
							this.progress.dispatchEvent(new CustomEvent('progress', {'detail': e.loaded / e.total}));
        				}
        			};
        		})(this);
        		reader.onload = (function(obj) {
        			return function(e) {
        				if (e.target.result.match(/^data\:(\w+)\/(\w+);base64\,(\S+)$/)) {
        					if (RegExp.$1 == obj.accept) {
        						obj.url = e.target.result;
        						obj.format = RegExp.$2;
        						obj.raw_data = RegExp.$3;
        						obj.progress.dispatchEvent(new CustomEvent('complete'));
        					}
        				}
        			};
        		})(this);
        		reader.readAsDataURL(this.eInput.files[0]);
            }.bind(this));
    	},
    };

    root.Input = Input;
}).call(this);
