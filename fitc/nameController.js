var nameIndex = 0;
    
function nameController(base){
	this.base = base;
    this.textController = new textController(base);
    this.textController.loadFont();
    this.names = [];
    this.numOverlappingTunnels = 10;
    this.fadeInTime = 2.0;
    this.fadeOutTime = 2.0;
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
        var i = nameIndex;
        nameIndex = (nameIndex+1) % this.names.length;
        
        var tunnelToEnableIndex = nameIndex + this.numOverlappingTunnels;
        
        if (tunnelToEnableIndex < this.names.length) {
            this.names[tunnelToEnableIndex].show();        
        }

        this.textController.setText(this.names[i].name);
    
        var tunnelToDisableIndex = i-1;
        
        if (tunnelToDisableIndex > -1) {
            this.names[tunnelToDisableIndex].hide();           
        }
        
        base.scheduler.callNextPhraseRange((progress)=>{
            //console.log("phrase range " + progress);
        }, 0.5, 1.0);
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
