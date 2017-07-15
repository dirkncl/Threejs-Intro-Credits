ccDebuger = function(base){
	var self = this;
	this.base = base;
	
	this.stats = new Stats();
	this.stats.setMode(0);
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.left = '0px';
	this.stats.domElement.style.top = '0px';
	document.body.appendChild( this.stats.domElement );
	
	this.base.addPreUpdateCallback( function(){
		self.stats.begin();
	});
	
	this.base.addUpdateCallback( function(){
		self.stats.end();
	});
}