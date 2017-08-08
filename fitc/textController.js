var font;

function textController(base){
	this.base = base;
    this.uniforms = {
					time:       { type:"f", value: 0.0 },
                    intensity : { type:"f", value: 0.0 }
				};
    this.material = new THREE.MultiMaterial( [
        new THREE.ShaderMaterial( {          
            uniforms : this.uniforms,
            vertexShader: document.getElementById( 'fontVertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fontFragmentShader' ).textContent,
            transparent:true,
         } ),
        
        new THREE.ShaderMaterial( {          
            uniforms : this.uniforms,
            vertexShader: document.getElementById( 'fontVertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fontSideFragmentShader' ).textContent,
            transparent:true,
         } ),
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
    
    for (var key in maxLetterCount) {
        
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
    var spaceWidth = 10.0;
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
    }
    
    letterIndexes = {};
    
    // This assumes one space in the name
    xPos -= totalWidth / 2.0 - spaceWidth*0.5;
    
    var meshIndex = 0;
    
    for (var i = 0; i < text.length; i++) {
        var key = text[i];

        if (key == ' ') 
        {
            xPos += spaceWidth;
            continue;
        }
        
        if (letterIndexes[key] == undefined) 
        {
            letterIndexes[key] = 0;
        }
        else 
        {
            letterIndexes[key] += 1;
        }
        
        var letterMesh = this.letterMeshes[key][letterIndexes[key]];
        letterMesh.position.z = -300;
        letterMesh.position.x = xPos;
        base.scene.add(letterMesh);
        xPos += spacings[i];
        this.currentDisplayedMeshes[meshIndex] = letterMesh;
        meshIndex++;
    }
    
    this.registerAnimations();
}

textController.prototype.removeDisplayedMeshes = function() {
    
    for (var i = 0; i < this.currentDisplayedMeshes.length; i++) {
        base.scene.remove(this.currentDisplayedMeshes[i]);
    }
    this.currentDisplayedMeshes = [];
}

textController.prototype.registerAnimations = function() {
    
    var self = this;
    
    base.scheduler.callNextPhraseRange((progress)=>{
        var s = 1.0-progress;
        self.setScale(s);    
        self.uniforms.intensity.value = s;
    }, 0.85, 1.0);

    base.scheduler.callNextPhraseRange((progress)=>{
        self.uniforms.intensity.value = progress;
        
        for (var i = 0; i < this.currentDisplayedMeshes.length; i++)
        {
            var scale = progress;
            var mesh = this.currentDisplayedMeshes[i];
            mesh.scale.x = scale;
            mesh.scale.y = scale;        
            mesh.scale.z = scale
            mesh.position.z = -300.0 + progress * 100.0;
        }        
    }, 0.0, 0.15);
    
    base.scheduler.callNextPhraseRange((progress)=>{

        for (var i = 0; i < self.currentDisplayedMeshes.length; i++)
        {
            var mesh = self.currentDisplayedMeshes[i];
            mesh.position.y = 1.0 + Math.sin(i + self.base.time.time)*2;
            this.uniforms.time.value = base.time.time;
        }
        
    }, 0.0, 1.0);
}

textController.prototype.setScale = function(scale) {
    for (var i = 0; i < this.currentDisplayedMeshes.length; i++)
    {
        var mesh = this.currentDisplayedMeshes[i];
        mesh.scale.x = scale;
        mesh.scale.y = scale;        
        mesh.scale.z = scale;        
    }        
}
