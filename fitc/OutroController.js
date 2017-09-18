var outroController = null;

function OutroController(base) {
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

OutroController.prototype.show = function(duration, onComplete) {
    outroController = this;
    this.time = 0.0;
    this.duration = duration;
    this.onComplete = onComplete;
    
    this.mesh = this.base.textTools.textMeshes.outroTitle;
    
    this.mesh.geometry.center();
    this.mesh.position.z = -25;
    this.mesh.scale.z = 0.1;
    this.base.scene.add(this.mesh);
    this.base.addUpdateCallback(this.update);
    this.base.blur.pass.uniforms.noiseAmplitude.value = 0.01;
    this.base.camera.position.z = 0.0;
    
    this.base.scheduler.callNextBarRange((progress)=>{
        self.base.blur.pass.uniforms.strength.value = Math.lerp(1.0, 0.5,progress);
    
    }, 0.0, 0.5);
    
    this.base.camera.position.x = 0.0;
    this.base.scheduler.callInSeconds(() => {
        this.replayTextMesh = this.base.textTools.textMeshes.click;
        this.replayTextMesh.scale.x = 0.5;
        this.replayTextMesh.scale.y = 0.5;
        this.replayTextMesh.scale.z = 0.1;
        
        this.replayTextMesh.geometry.center();
        this.replayTextMesh.position.z = -25;
        this.replayTextMesh.position.y = -5;
        this.base.scene.add(this.replayTextMesh);
        this.base.addMouseDownCallback(this.onClickToReplay);
        //this.base.removeUpdateCallback(this.update);
    }, duration);
}


OutroController.prototype.update = function() {
    
    var progress = Math.min(1.0, outroController.time/outroController.duration);
    
    outroController.mesh.rotation.z = Math.cos(outroController.time)*0.05;
    outroController.mesh.rotation.y = Math.cos(outroController.time*1.25)*0.05;
    
    base.blur.pass.uniforms.strength.value = Math.lerp(1.0, 0.925, progress);
    outroController.time += base.time.delta;
}

OutroController.prototype.onClickToReplay = function () {
    outroController.base.scene.remove(outroController.mesh);
    outroController.base.scene.remove(outroController.replayTextMesh);
    outroController.base.removeMouseDownCallback(outroController.onClickToReplay);
    outroController.onComplete();
}