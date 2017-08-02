voxGenerator = function(base, sounds){	
	var self = this;
	this.sound = {};
	var v = ['f1','f2','f3','f4','f5'];
	var index = 0;
	meSpeak.loadConfig("mespeak/mespeak_config.json");
	base.loadingManager.itemStart("mespeak config");
	var base = base;
	
	function checkLoaded(){
		if(!meSpeak.isConfigLoaded()){
			base.scheduler.callNextFrame(checkLoaded);
			return;
		}
		meSpeak.loadVoice("mespeak/voices/en/en.json", ()=>{
			base.loadingManager.itemEnd("mespeak config");
			loadNextSound();
		});
	}
	
	function loadNextSound(){
		base.loadingManager.itemStart("vox "+sounds[index]);
		var j = Math.floor(Math.random()*v.length);
		self.sound[sounds[index]] = (meSpeak.speak(sounds[index], {'rawdata':'lo', speed:Math.random()*33+100, variant:v[j]}));
		//saveByteArray([self.sound[sounds[index]] ], sounds[index]+".wav");
		base.loadingManager.itemEnd("vox "+sounds[index]);
		index++;
		if(index<sounds.length){
			base.scheduler.callNextFrame(loadNextSound);
		}
	}	
	
	var saveByteArray = (function () {
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		return function (data, name) {
			var blob = new Blob(data, {type: "octet/stream"}),
				url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = name;
			a.click();
			window.URL.revokeObjectURL(url);
		};
	}());
	
	checkLoaded();
}