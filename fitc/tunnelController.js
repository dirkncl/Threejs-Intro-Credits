function tunnelController(base, name, index){
	this.base = base;
    this.name = name;
    this.index = index;
}

tunnelController.prototype.init = function(){

    this.torusRadius = 300;
    
    var geometry = new THREE.TorusBufferGeometry( this.torusRadius, 50, 90, 45);    
    
    var self = this;
    
	this.material = base.shaderGen.getShader(this.name);
    
	this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotation.x = Math.PI*0.5;
    var self = this;
}

tunnelController.prototype.addToScene = function() {
    this.material.uniforms.intensity.value = 1.0;
    //base.scene.add(this.mesh);
}

tunnelController.prototype.removeFromScene = function() {
    base.scene.remove(this.obj2);
    base.scene.remove(this.textParent);
}

tunnelController.prototype.HideThisPhrase = function() {
    /*
    var self = this;
    
    base.scheduler.callNextPhraseRange((progress)=>{
        self.material.uniforms.intensity.value = 1.0-progress;
    }, 0.5, 0.8);
    */
}

tunnelController.prototype.AddText = function(text) {
    
    
    this.obj2 = new THREE.Object3D();
    this.textParent = new THREE.Object3D();
    this.obj = new THREE.Object3D();

    text.position.x = 0;
    text.rotation.y = Math.PI * 0.5;
    text.position.z = -this.torusRadius;

    this.obj.add(this.mesh);
    this.textParent.add(text);
    
    this.obj.rotation.z = Math.random() * Math.PI;
    this.textParent.rotation.z = this.obj.rotation.z;
    
    this.obj.position.x = Math.cos(Math.PI + this.obj.rotation.z) * this.torusRadius;
    this.obj.position.y = Math.sin(Math.PI + this.obj.rotation.z) * this.torusRadius;
    
    this.textParent.position.x = this.obj.position.x;
    this.textParent.position.y = this.obj.position.y;
    
    text.rotation.z = -this.obj.rotation.z; 
    
    this.base.camera.position.z = 50;
    var axis = this.obj.up;
    
    this.obj2.add(this.obj);
    this.obj.rotateOnAxis(axis, -0.5);
    this.textParent.rotateOnAxis(axis, -0.5);
    base.scene.add(this.obj2);
    base.scene.add(this.textParent);
    var self = this;
    
    base.scheduler.callNextPhraseRange((progress)=>{        
        this.obj.rotateOnAxis(axis, -1.05 * base.time.delta);
        this.textParent.rotateOnAxis(axis, -1.45 * base.time.delta * (Math.max(0.05, 1.0-progress*1.45)));       
    }, 0.0, 1.0);
}


tunnelController.prototype.ShowThisPhrase = function(destIntensity) {
    
    /*
    var self = this;
    var startIntensity = this.material.uniforms.intensity.value;
    
    base.scheduler.callNextPhraseRange((progress)=>{    
        self.material.uniforms.intensity.value = Math.lerp(startIntensity, destIntensity, progress);
    }, 0.0, 0.3);
    */
}

