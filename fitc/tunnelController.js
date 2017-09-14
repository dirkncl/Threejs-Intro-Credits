function tunnelController(base, name, index){
	this.base = base;
    this.name = name;
    this.index = index;
}

tunnelController.prototype.init = function(){

    this.torusRadius = 300;
    
    var geometry = new THREE.TorusBufferGeometry( this.torusRadius, 50, 100, 50);    
    //geometry = ccMesh.scaleUV(geometry, 6.28, 0);
    
    var self = this;
    
	this.material = base.shaderGen.getShader(this.name);
    
	this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotation.x = Math.PI*0.5;
    var self = this;
}

tunnelController.prototype.addToScene = function() {
    this.material.uniforms.intensity.value = 0.0;
    //base.scene.add(this.mesh);
}

tunnelController.prototype.removeFromScene = function() {
    base.scene.remove(this.obj2);
}

tunnelController.prototype.HideThisPhrase = function() {
    
    var self = this;
    
    base.scheduler.callNextPhraseRange((progress)=>{
        self.material.uniforms.intensity.value = 1.0-progress;
    }, 0.7, 0.95);
}

tunnelController.prototype.AddText = function(text) {
    
    this.obj2 = new THREE.Object3D();
    this.obj = new THREE.Object3D();

    text.position.x = 0;
    text.rotation.y = Math.PI * 0.5;
    text.position.z = -this.torusRadius;

    this.obj.add(this.mesh);
    this.obj.add(text);

    this.obj.rotation.z = Math.random() * Math.PI;
    
    this.obj.position.x = Math.cos(Math.PI + this.obj.rotation.z) * this.torusRadius;
    this.obj.position.y = Math.sin(Math.PI + this.obj.rotation.z) * this.torusRadius;
    text.rotation.z = -this.obj.rotation.z; 
    
    this.base.camera.position.z = 70;
    var axis = this.obj.up;
    
    this.obj2.add(this.obj);
    this.obj.rotateOnAxis(axis, -0.5);
    base.scene.add(this.obj2);
    
    
    base.scheduler.callNextPhraseRange((progress)=>{
        
        this.obj.rotateOnAxis(axis, -1.025 * base.time.delta * (Math.max(0.1, 1.0-progress)));
        
    }, 0.0, 1.0);
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
        }, 0.0, 0.25);
    }
}

