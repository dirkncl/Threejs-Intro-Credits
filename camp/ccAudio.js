ccAudio = function(base){
	var self = this;
	base.audio = this;
	this.base = base;
	this.analyser = 0;
	this.sources = [];
	
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		this.context = new AudioContext();
		this.analyser = this.context.createAnalyser();
		this.analyser.smoothingTimeConstant = .95;
		this.analyser.fftSize = 1024;
		this.analyser.connect(this.context.destination);
		this.data = new Uint8Array(this.analyser.frequencyBinCount);
	} catch(e) {
		alert('Web Audio API is not supported in this browser'+e);
	}
	this.gain = this.context.createGain();
	this.gain.connect(this.analyser);
	
	this.loadSound = function(url, callback){
		var req = new XMLHttpRequest();
		req.open("GET",url,true);
		req.responseType = 'arraybuffer';
		req.onload = function(){
        self.context.decodeAudioData(req.response,callback);
		}
		req.send();
	}
	
	this.loadAndPlay = function(url, callback){
		self.loadSound(url,function(buffer){
			self.play(buffer);
			if(callback!=null)
				callback(buffer);
		});
	}
	
	this.play = function(buffer){
		var source = self.context.createBufferSource();
		source.buffer = buffer;
		source.connect(self.gain);
		source.start(0);
		self.sources.push(source);
		return source;
	}
	
	this.volume = function(val){
		self.gain.gain.value = val;
	}
	
	this.stopAll = function(){
		for(var i = 0; i<self.sources.length;i++){
			self.sources[i].stop(0);
			self.sources[i].disconnect();	
		}
		self.sources = [];
	}
	
	this.update = function(){
		self.analyser.getByteFrequencyData(self.data);
		self.texture = new THREE.DataTexture(self.data,256,1, THREE.LuminanceFormat);
		self.texture.magFilter = self.texture.minFilter = THREE.LinearFilter;
		self.texture.needsUpdate=true;
	}
	base.addUpdateCallback(this.update);
	
	
	
	
	
	
}