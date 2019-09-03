var nameIndex = 0;
    
function nameController(base) {
	this.base = base;
    this.textController = new textController(base);
    this.names = [];
    this.numOverlappingTunnels = 1;
}

nameController.prototype.isDone = function() {
    return nameIndex >= this.names.length;
}

nameController.prototype.loadNames = function() {
    var loader = new THREE.FileLoader(base.loadingManager);
    var self = this;
    
    loader.load(
        'names.txt',

        function ( data ) {
            self.parseNames(data);
        }
    );
}

nameController.prototype.reset = function() {
    nameIndex = 0;
}

nameController.prototype.showNextName = function() {

    var tunnelToEnableIndex = 0;

    if (nameIndex >= this.names.length) {
        this.names[nameIndex-1].removeTunnelFromScene();
        this.base.blur.ClearLut();
        return false;
    }
    
    while (tunnelToEnableIndex < this.numOverlappingTunnels) 
    {
        var intensity = 1.0 - (tunnelToEnableIndex) / (this.numOverlappingTunnels);
        if (nameIndex + tunnelToEnableIndex < this.names.length) {
            this.names[nameIndex + tunnelToEnableIndex].show(intensity);
        }
        tunnelToEnableIndex++;
    }

    var t = this.textController.setText(this.names[nameIndex].name);

    this.names[nameIndex].addTextToTunnel(t);        

    this.names[nameIndex].fadeOutTunnelThisPhrase();        

    if (nameIndex > 0) {
        this.names[nameIndex-1].removeTunnelFromScene();        
        if (nameIndex % 2 == 0) {
            this.base.blur.NextLut(1.0);
        }
    }
    
    nameIndex++;
    return true;
}

nameController.prototype.parseNames = function(data) {
    function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a; 
    }
    
    nameArray = data.split('\n');
    for (var i = 0; i < nameArray.length; i++) {
        var name = new FitcName(this.base,nameArray[i], i);
        this.names.push(name);
    }
    this.names = shuffle(this.names)
}

nameController.prototype.loadLetters = function() {
    this.textController.loadLettersForNames(this.names);    
}
