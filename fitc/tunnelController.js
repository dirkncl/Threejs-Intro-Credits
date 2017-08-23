function tunnelController(base, name, index){
	this.base = base;
    this.name = name;
    this.index = index;
}

tunnelController.prototype.init = function(){

	var geometry = ccMesh.cone(52,52.0,52.0,100.);
	geometry = ccMesh.scaleUV(geometry, 6.28, 0);
    var self = this;
    
    this.uniforms = {
        time: {type:"f", value: 1.0 },
        seed: {type:"f", value: 1.0 },
        amp: {type:"f", value: 10.0 },
        intensity: { type:"f", value : 0.0 }
    };
    
	this.material = base.shaderGen.getShader(this.name);
    
	this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.z = -25;
    this.mesh.rotation.y = Math.PI;
	var self = this;
	this.seed();
	this.base.addMouseDownCallback(()=>{self.seed();});
}


tunnelController.prototype.seed = function(){
    var x = Math.random()*10.;
    this.mesh.material.uniforms.seed.value = Math.random()*1000;
    this.mesh.material.uniforms.amp.value = x;
}

tunnelController.prototype.addToScene = function() {
    this.material.uniforms.intensity.value = 0.0;
    base.scene.add(this.mesh);
}

tunnelController.prototype.removeFromScene = function() {
    base.scene.remove(this.mesh);
}

tunnelController.prototype.HideThisPhrase = function() {
    
    var self = this;
    
    base.scheduler.callNextPhraseRange((progress)=>{
        self.material.uniforms.intensity.value = 1.0-progress;
    }, 0.5, 1.0);
}

tunnelController.prototype.ShowThisPhrase = function(destIntensity) {
    
    var self = this;
    var startIntensity = this.material.uniforms.intensity.value;
    var startScale = this.mesh.scale.x;
    console.log(this.name + " " + startIntensity + " " + destIntensity);

    if (destIntensity == 0.5) {
        base.scheduler.callNextPhraseRange((progress)=>{    
            self.material.uniforms.intensity.value = Math.lerp(startIntensity, destIntensity, progress);
        }, 0.5, 1.0);
    } else {
        base.scheduler.callNextPhraseRange((progress)=>{    
            self.material.uniforms.intensity.value = Math.lerp(startIntensity, destIntensity, progress);
        }, 0.0, 0.5);    
    }
}

