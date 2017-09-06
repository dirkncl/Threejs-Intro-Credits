function tunnelController(base, name, index){
	this.base = base;
    this.name = name;
    this.index = index;
}

tunnelController.prototype.init = function(){

    this.torusRadius = 300;
    
	//var geometry = ccMesh.cone(52,52.0,52.0,100.);
    var geometry = new THREE.TorusBufferGeometry( this.torusRadius, 45, 150, 50);
    
    //geometry = ccMesh.scaleUV(geometry, 6.28, 0);
    var self = this;
    
    this.uniforms = {
        time: {type:"f", value: 1.0 },
        seed: {type:"f", value: 1.0 },
        amp: {type:"f", value: 10.0 },
        intensity: { type:"f", value : 0.0 }
    };
    
	this.material = base.shaderGen.getShader(this.name);
    
	this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotation.x = Math.PI*0.5;
    console.log(this.mesh);
    var self = this;
	this.seed();
}


tunnelController.prototype.seed = function(){
    var x = Math.random()*10.;
    this.mesh.material.uniforms.seed.value = Math.random()*1000;
    this.mesh.material.uniforms.amp.value = x;
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
    }, 0.5, 1.0);
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
    
    this.obj2.add(this.obj);
    base.scene.add(this.obj2);
    
    var axis = this.obj.up;
    
    base.scheduler.callNextPhraseRange((progress)=>{
        this.obj.rotateOnAxis(axis, -0.61 * base.time.delta);
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
        }, 0.0, 0.5);    
    }
}

