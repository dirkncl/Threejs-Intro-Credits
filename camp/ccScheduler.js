function ccScheduler(base){
	this.base = base;
	base.scheduler = this;
	this.frameCallbacks = [];
	this.timeCallbacks = [];
	this.sequenceCallbacks = [];
	this.barRangeCallbacks = [];
    
	this.bpm = 120;
	this.remainingTimeInBeat = 0;
	this.remainingBeatsInBar = 5;
	this.remainingBeatsInPhrase = 17;
	this.totalBeat = 0;
	this.totalBar = 0;
	this.totalPhrase = 0;
	this.self = this;
	
	this.setBPM(this.bpm);
}

ccScheduler.prototype.init = function(){
    var self = this.self;
	self.base.addUpdateCallback(()=>{self.update();});
}

ccScheduler.prototype.setBPM = function(bpm){
	this.bpm = bpm;
	this.totalBeat = 60/bpm;
	this.totalBar = this.totalBeat*4;
	this.totalPhrase = this.totalBeat*16;
}

ccScheduler.prototype.reset = function(){
	this.remainingTimeInBeat = this.totalBeat;
	this.remainingBeatsInBar = 4;
	this.remainingBeatsInPhrase = 16;
}

ccScheduler.prototype.update = function(){
	var length = this.frameCallbacks.length;
	for(var i = 0; i<length; i++) {
		var f = this.frameCallbacks[i];
		f.framesSpent++;
		if(f.framesSpent >= f.totalFrames) {
			f.func();
			this.frameCallbacks.splice(i, 1);
			i--;
			length--;
		}
	}
	
	length = this.timeCallbacks.length;
	for(var i = 0; i<length; i++){
		var f = this.timeCallbacks[i];
		f.timeSpent+=this.base.time.delta;
		if(f.timeSpent >= f.totalTime){
			f.func();
			this.timeCallbacks.splice(i, 1);
			i--;
			length--;
		}
	}
    
    length = this.barRangeCallbacks.length;
	var progress = 1.0 - ((this.remainingBeatsInBar-1) * this.totalBeat + this.remainingTimeInBeat) / this.totalBar;
    for (var i = 0; i < length; i++) {
        var barRangeCallback = this.barRangeCallbacks[i];
		
        if (progress >= barRangeCallback.startBar && progress <= barRangeCallback.endBar) {
            var rangeLength = barRangeCallback.endBar - barRangeCallback.startBar;
            var normalizedRelativeProgress = (barRangeCallback.startBar - progress) / rangeLength;
            barRangeCallback.func(normalizedRelativeProgress * -1);
        }
        else if (progress > barRangeCallback) {
            barRangeCallback.func(1.0);
            this.barRangeCallbacks.splice(i, 1);
			i--;
			length--;
        }
    }
		
	this.remainingTimeInBeat -= this.base.time.delta;
	
	if(this.remainingTimeInBeat < this.base.time.delta*.5){
		this.remainingTimeInBeat+=this.totalBeat;
		
		this.remainingBeatsInBar--;
		if(this.remainingBeatsInBar==0) {
            this.barRangeCallbacks = [];
			this.remainingBeatsInBar = 4;
        }
		
		this.remainingBeatsInPhrase--;
		if(this.remainingBeatsInPhrase==0){
			this.remainingBeatsInPhrase = 16;
		}
		
		length = this.sequenceCallbacks.length;
		for(var i = 0; i<length; i++){
			var f = this.sequenceCallbacks[i];
			f.beatsSpent++;
			if(f.beatsSpent >= f.totalBeats){
				f.func();
				this.sequenceCallbacks.splice(i, 1);
				i--;
				length--;
			}
		}
	}	
}


ccScheduler.prototype.callNextBeat = function(func){
	this.sequenceCallbacks.push({
		func: func,
		totalBeats: 1,
		beatsSpent: 0
	});
}
ccScheduler.prototype.callNextBar = function(func){
	this.sequenceCallbacks.push({
		func: func,
		totalBeats: this.remainingBeatsInBar,
		beatsSpent: 0
	});
}

ccScheduler.prototype.callNextPhrase = function(func){
	this.sequenceCallbacks.push({
		func: func,
		totalBeats: this.remainingBeatsInPhrase,
		beatsSpent: 0
	});
}

ccScheduler.prototype.callNextBarRange = function(func, start, end){
    this.barRangeCallbacks.push({
		func: func,
        startBar: start,
        endBar: end
	});
}

ccScheduler.prototype.callInSeconds = function(func, time){
	this.timeCallbacks.push({
		func: func,
		totalTime: time,
		timeSpent: 0
	});
}

ccScheduler.prototype.callNextFrame = function(func){
	this.frameCallbacks.push({
		func:func,
		totalFrames:1,
		framesSpent:0
	});
}

ccScheduler.prototype.callInFrames = function(func, frames){
	this.frameCallbacks.push({
		func:func,
		totalFrames:frames,
		framesSpent:0
	});
}