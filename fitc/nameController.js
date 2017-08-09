var nameIndex = 0;
    
function nameController(base){
	this.base = base;
    this.textController = new textController(base);
    this.textController.loadFont();
    this.names = [];
    this.numOverlappingTunnels = 1;
}

nameController.prototype.loadNames = function(){
    var loader = new THREE.FileLoader(base.loadingManager);
    var self = this;
    
    loader.load(
        'names.txt',

        function ( data ) {
            self.parseNames(data);
        }
    );
}

nameController.prototype.showNextName = function() {
    if (this.names.length > 0) {
        var tunnelToEnableIndex = nameIndex + this.numOverlappingTunnels;
        
        if (tunnelToEnableIndex < this.names.length) {
            this.names[tunnelToEnableIndex].show();        
        }

        this.textController.setText(this.names[nameIndex].name);
        this.textController.setScale(0.01);
        
        this.names[nameIndex].fadeOutTunnelThisPhrase();        
        
        if (nameIndex > 1) {
            this.names[nameIndex-1].removeTunnelFromScene();        
        }
        
        nameIndex = (nameIndex+1) % this.names.length;
    }
}
    
nameController.prototype.warmupTunnels = function() {
    if (this.names.length > 0) {
        for (var i = 0; i < this.numOverlappingTunnels; i++) {
            this.names[i].show();
        }
    }
}

nameController.prototype.parseNames = function(data) {
    
    nameArray = data.split('\n');
    for (var i = 0; i < nameArray.length; i++) {
        var name = new FitcName(this.base,nameArray[i], i);
        this.names.push(name);
    }
}

nameController.prototype.loadLetters = function() {
    console.log("start loading letters");
    this.textController.loadLettersForNames(this.names);    
}
