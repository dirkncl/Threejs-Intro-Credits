var names = [];
var nameIndex = 0;

function nameController(base){
	this.base = base;    
}

nameController.prototype.loadNames = function(loadingManager){
    var loader = new THREE.FileLoader(loadingManager);
    
    loader.load(
        'names.txt',

        function ( data ) {
            parseNames(data);
        },
        
        function ( xhr ) {
            console.error( 'Error loading names' );
        }
    );
}

nameController.prototype.getNextName = function() {
    var i = nameIndex;
    nameIndex = (nameIndex+1) % names.length;
    return names[i];
}

function parseNames(data) {
    names = data.split('\n');
}
