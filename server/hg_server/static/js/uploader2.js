
// thx to: https://github.com/jhuckaby/webcamjs/blob/master/webcam.js
(function() {
    var root = this;

	var Uploader = function(options) {
		this.progress = options.progress;
		this.onfinish = options.onfinish;
		this.local_url = options.local_url;
		this.target_url = options.target_url;
		this.form = options.form;
		this.uploadFile.bind(this)();
	};

    Uploader.prototype = {
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
						debug(e.loaded / e.total);
						this.progress.dispatchEvent(new CustomEvent('progress', {'detail': e.loaded / e.total}));
					}
				}.bind(this), false );
			}
			
			// completion handler
			http.onload = function() {
				debug('http onload ' + http.status + ', ' + http.responseText);
				this.status = http.status;
				this.reponseText = http.responseText;
				this.progress.dispatchEvent(new CustomEvent('complete'));
				this.onfinish(this.reponseText);
			}.bind(this);
			
			http.onerror = function() {
				alert('uploader error');
			}.bind(this)
			
			http.onabort = function() {
				alert('uploader abort');
			}.bind(this)
			
			this.form.append( 'content_type', typ+'/'+fmt);
			this.form.append( 'content', raw);
			
			// send data to server
			http.send(this.form);
		},
    };

    root.Uploader = Uploader;
}).call(this);

