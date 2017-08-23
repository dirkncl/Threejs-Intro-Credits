var nameIndex = 0;
    
function nameController(base){
	this.base = base;
    this.textController = new textController(base);
    this.textController.loadFont();
    this.names = [];
    this.numOverlappingTunnels = 2;
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

    var tunnelToEnableIndex = 0;

    while (tunnelToEnableIndex <= this.numOverlappingTunnels) 
    {
        var intensity = 1.0 - (tunnelToEnableIndex) / (this.numOverlappingTunnels);
        this.names[nameIndex + tunnelToEnableIndex].show(intensity);
        tunnelToEnableIndex++;
    }

    this.textController.setText(this.names[nameIndex].name);
    this.textController.setScale(0.01);

    this.names[nameIndex].fadeOutTunnelThisPhrase();        

    if (nameIndex > 0) {
        this.names[nameIndex-1].removeTunnelFromScene();        
    }

    nameIndex = (nameIndex+1) % this.names.length;
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
