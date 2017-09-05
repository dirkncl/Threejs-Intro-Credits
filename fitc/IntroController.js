function IntroController(base) {
	this.base = base;
    
    this.uniforms = {
					time:       { type:"f", value: 0.0 },
                    intensity : { type:"f", value: 1.0 }
    };

    var frontMaterial = new THREE.ShaderMaterial( {          
        uniforms : this.uniforms,
        transparent:false,
    } );
    
    var sideMaterial = new THREE.ShaderMaterial( {          
        uniforms : this.uniforms,
        transparent:false      
    } );
    
    this.base.loadAndSet("shaders/fontfront.frag", frontMaterial,"fragmentShader");	
    this.base.loadAndSet("shaders/fontside.frag",  sideMaterial,"fragmentShader");
    this.base.loadAndSet("shaders/fontside.frag",  sideMaterial,"fragmentShader");
    
    this.base.load("shaders/font.vert", (x)=>{
        frontMaterial.vertexShader = x;
        sideMaterial.vertexShader = x;
    } );
    
    this.material = new THREE.MultiMaterial( [frontMaterial, sideMaterial ] );
}

IntroController.prototype.show = function(duration, onComplete) {
    
    var mesh = this.generateTextMesh("FITC presents");
    mesh.geometry.center();
    mesh.position.z = -25;
    this.base.scene.add(mesh);
    
    this.base.scheduler.callInSeconds(() => {
        this.base.scene.remove(mesh);
        onComplete();
    }, duration);
}

IntroController.prototype.generateTextMesh = function(text) {

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
