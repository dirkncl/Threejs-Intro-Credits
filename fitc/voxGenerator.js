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
		self.sound[sounds[index]] = (meSpeak.speak(sounds[index], {'rawdata':'array', speed:Math.random()*33+100, variant:v[j]}));
		base.loadingManager.itemEnd("vox "+sounds[index]);
		index++;
		if(index<sounds.length){
			base.scheduler.callNextFrame(loadNextSound);
		}
	}	
	
	checkLoaded();
}