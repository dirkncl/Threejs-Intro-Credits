function textController(base){
	this.base = base;
    this.meshGroup = new THREE.Object3D();
    this.uniforms = {
        time:       { type:"f", value: 0.0 },
        intensity : { type:"f", value: 0.0 },
        amp: {type:"f", value:2},
        seed:{type:"f", value:10}
    };

    var frontMaterial = new THREE.ShaderMaterial( {          
        uniforms : this.uniforms,
        transparent:true,
    } );
    
    var sideMaterial = new THREE.ShaderMaterial( {          
        uniforms : this.uniforms,
        transparent:true      
    } );
    
    this.base.loadAndSet("shaders/fontfront.frag", frontMaterial,"fragmentShader");	
    this.base.loadAndSet("shaders/fontside.frag",  sideMaterial,"fragmentShader");
    this.base.loadAndSet("shaders/fontside.frag",  sideMaterial,"fragmentShader");
    
    this.base.load("shaders/font.vert", (x)=>{
        frontMaterial.vertexShader = x;
        sideMaterial.vertexShader = x;
    } );
    
    this.material = new THREE.MultiMaterial( [frontMaterial, sideMaterial ] );
    this.letterMeshes = { };
    this.currentDisplayedMeshes = [ ];
    this.letterSfx = [ ];
	var self = this;
	
	for(var i = 0; i< 26; i++){
		var j = i;
		base.audio.loadSound("sound/letterFX/letterFX-"+j+".mp3", function(b){
			self.letterSfx.push(b);
		});
	}
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
        font: this.base.font,

        size: 2,
        height: 2,
        curveSegments: 4,

        bevelThickness: .15,
        bevelSize: .15,
        bevelEnabled: true,

        material: 0,
        extrudeMaterial: 1,
        
    });

    textGeo.computeBoundingBox();
    var textMesh = new THREE.Mesh( textGeo, this.material );
    return textMesh;
}

textController.prototype.setText = function(text) {
    var totalWidth = 0.0;
    var spacing = 0.;
    var spaceWidth = 1.0;
    var spacings = [];
    var xPos = 0.0;
    var letterIndexes = {};
    this.removeDisplayedMeshes();
    this.meshGroup = new THREE.Object3D();
    this.meshGroup.position.z = -100;
    this.uniforms.intensity.value = 0.0;
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
        spacings[i] = letterMeshGeometry.boundingBox.getSize().x;
        
        if (i < text.length-1) {
            spacings[i] += spacing;
        }
        
        totalWidth += spacings[i];
    }
    
    letterIndexes = {};
    
    // This assumes one space in the name
    xPos -= totalWidth / 2.0;
    
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
        letterMesh.position.x = xPos;
        
        this.meshGroup.add(letterMesh);
        xPos += spacings[i];
        this.currentDisplayedMeshes[meshIndex] = letterMesh;
        meshIndex++;
    }
    base.scene.add(this.meshGroup);
    this.registerAnimations();
}

textController.prototype.removeDisplayedMeshes = function() {
    base.scene.remove(this.meshGroup);    
    this.currentDisplayedMeshes = [];
}

textController.prototype.registerAnimations = function() {
    var self = this;
	var delayPerLetter = base.scheduler.totalBeat/2;
	var easeOutTime = 1;
	var startEaseOut = base.scheduler.totalPhrase-easeOutTime;	
   
	TweenMax.to(this.meshGroup.position, base.scheduler.totalPhrase, {z:-20, delay:0.0, ease: Quad.Linear});
	TweenMax.to(this.uniforms.intensity, 1.0, {value:1.0, delay:0.0, ease: Quad.easeOut});
		
	for (var i = 0; i < this.currentDisplayedMeshes.length; i++)
	{
		var mesh = this.currentDisplayedMeshes[i];
		var j = i;
	//	base.scheduler.callInSeconds(()=>{
			//if(self.letterSfx[j]!=null)
				//base.audio.play(self.letterSfx[j], false, 0.15);
	//	},j*delayPerLetter);
    }  
    
    base.scheduler.callNextPhraseRange((progress)=>{
        for (var i = 0; i < self.currentDisplayedMeshes.length; i++)
        {
			var p = i*.7+base.time.time*3;
            var mesh = self.currentDisplayedMeshes[i];
            mesh.position.y = Math.sin(p)*0.25;
            this.uniforms.time.value = base.time.time;
        }
        
        self.base.blur.pass.uniforms.noiseAmplitude.value = progress * 0.025;
        self.base.blur.pass.uniforms.strength.value = Math.min(0.97, Math.lerp(0.7, 1.1,progress));

    }, 0.0, 1.0);
}

textController.prototype.setScale = function(scale) {
    for (var i = 0; i < this.currentDisplayedMeshes.length; i++)
    {
        var mesh = this.currentDisplayedMeshes[i];
        mesh.scale.set(scale, scale, scale);        
    }        
}
