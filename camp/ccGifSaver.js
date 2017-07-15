ccGifSaver = function(base){
	var self = this;
	this.base = base;
	
	this.length = 50;	
	this.frame = 0;
	this.pngSave = document.createElement('a');
	this.pngEvent = document.createEvent("MouseEvents");
	this.pngEvent.initMouseEvent( 
		"click", true, false, window, 0, 0, 0, 0, 0,
		false, false, false, false, 0, null		   );		
	
	this.saveFrame = function(){
		self.frame++;
		if(self.frame>=self.length){
			self.base.removeUpdateCallback(self.saveFrame);	
		}
		var c = self.base.canvas.toDataURL("image/png");
		c = c.replace("image/png", "image/octet-stream");
		self.pngSave.href = c;
		self.pngSave.download = 'img '+self.frame+'.png';
		self.pngEvent = document.createEvent("MouseEvents");
		self.pngEvent.initMouseEvent( 
			"click", true, false, window, 0, 0, 0, 0, 0,
			false, false, false, false, 0, null		   );
		self.pngSave.dispatchEvent(self.pngEvent);
	}
	
	this.save = function(){
		self.frame = 0;
		//TODO make gif capture port
		
		base.camera.aspect = 1/1;
		base.renderer.setSize(500,500);
		base.camera.updateProjectionMatrix();
		
		self.base.addUpdateCallback(self.saveFrame);
	}
	
}