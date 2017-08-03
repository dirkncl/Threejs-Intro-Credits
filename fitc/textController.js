var font;

function textController(base){
	this.base = base;
    var uniforms = {
					time:       { value: 1.0 },
					resolution: { value: new THREE.Vector2() }
				};
    this.material = new THREE.MultiMaterial( [
        new THREE.ShaderMaterial( {          
        
        uniforms: {
            time: {type:"f", value: 1.0 }
    	},
        
        vertexShader: document.getElementById( 'fontVertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fontFragmentShader' ).textContent
                                     } ), // front
        new THREE.MeshBasicMaterial( { color: 0x999998, shading: THREE.SmoothShading } ) // side
    ] );
    this.letterMeshes = { };
    this.font = null;
    this.currentDisplayedMeshes = [ ];
}

textController.prototype.loadFont = function() {

    var loader = new THREE.FontLoader(base.loadingManager);
    var self = this;
    
    loader.load( "fonts/helvetiker_regular.typeface.js", function ( response ) {
        self.font = response;
        console.log(self.font);
    } , function ( ok ) {

    } , function(error){
        console.log(error)
    });  
}

textController.prototype.loadLettersForNames = function(names) {
    
    var maxLetterCount = {};
    
    // Calculate the maximum amounts of each letter you'll need for any name
    for (var i = 0; i < names.length; i++) {
        
        var name = names[i].name;
        var letterCount = { };
        
        for (var j = 0; j < name.length; j++) {
            letterCount[name[j]] = 0;
        }
        for (var j = 0; j < name.length; j++) {
            letterCount[name[j]] += 1;
        }
        
        for (var key in letterCount) { 
        
            if (letterCount[key] > maxLetterCount[key] || maxLetterCount[key] == undefined ) {
                maxLetterCount[key] = letterCount[key];
            }
        }
    }
    console.log(maxLetterCount);
    
    for (var key in maxLetterCount) {
        
        console.log(key + " " + maxLetterCount[key]);
        this.letterMeshes[key] = [];
        
        for (var j = 0; j < maxLetterCount[key]; j++) {
            
            this.letterMeshes[key][j] = this.generateTextMesh(key);
            
        } 
    }
    console.log("end loading letters");
}

textController.prototype.generateTextMesh = function(text) {
    var textGeo = new THREE.TextGeometry( text, {
        font: this.font,

        size: 20,
        height: 20,
        curveSegments: 4,

        bevelThickness: 1.5,
        bevelSize: 1.0,
        bevelEnabled: true,

        material: 0,
        extrudeMaterial: 1
    });

    textGeo.computeBoundingBox();
    var textMesh = new THREE.Mesh( textGeo, this.material );

    return textMesh;
}

textController.prototype.setText = function(text) {

    var totalWidth = 0.0;
    var spacing = 0.;
    var spacings = [];
    var xPos = 0.0;
    var letterIndexes = {};
    this.removeDisplayedMeshes();
    
    for (var i = 0; i < text.length; i++) {
        var key = text[i];
        
        if (letterIndexes[key] == undefined) 
        {
            letterIndexes[key] = 0;
        }
        else 
        {
            letterIndexes[key] += 1;
        }
        
        var letterMeshGeometry = this.letterMeshes[key][letterIndexes[key]].geometry;
        spacings[i] = letterMeshGeometry.boundingBox.getSize().x + spacing;
        totalWidth += spacings[i];
        console.log(totalWidth);
    }
    
    letterIndexes = {};
    xPos -= totalWidth / 2.0;
    
    for (var i = 0; i < text.length; i++) {
        var key = text[i];

        if (letterIndexes[key] == undefined) 
        {
            letterIndexes[key] = 0;
        }
        else 
        {
            letterIndexes[key] += 1;
        }
        
        var letterMesh = this.letterMeshes[key][letterIndexes[key]];
        letterMesh.position.z = -200;
        letterMesh.position.x = xPos;
        base.scene.add(letterMesh);
        xPos += spacings[i];
        this.currentDisplayedMeshes[i] = letterMesh;
    }
}

textController.prototype.removeDisplayedMeshes = function() {
    
    for (var i = 0; i < this.currentDisplayedMeshes.length; i++) {
        base.scene.remove(this.currentDisplayedMeshes[i]);
    }
    this.currentDisplayedMeshes = [];
}
