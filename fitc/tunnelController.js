function tunnelController(base, name, index){
	this.base = base;
    this.name = name;
    console.log(this.name);
    this.index = index;
}

tunnelController.prototype.init = function(){

	var geometry = ccMesh.cone(52,52.0,1.0,100.);
	geometry = ccMesh.scaleUV(geometry, 6.28, 0);
    
	this.material = new THREE.ShaderMaterial( {
        
        uniforms: {
            time: {type:"f", value: 1.0 },
            seed: {type:"f", value: 1.0 },
            amp: {type:"f", value: 10.0 }
    	},
        
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side:THREE.BackSide,
        transparent:true,
        blending: THREE.NormalBlending,
        depthTest: false,
        wireframe: true
	} );
	
	this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.z = -30;
    this.mesh.rotation.y = Math.PI;
    
	base.addUpdateCallback(()=>{
        this.mesh.material.uniforms.time.value = base.time.time*(this.mesh.material.uniforms.seed.value%1+.5);
    });
    
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
    base.scene.add(this.mesh);
    console.log("Adding " + this.name + " tunnel");
}

tunnelController.prototype.removeFromScene = function() {
    base.scene.remove(this.mesh);
    console.log("Removing " + this.name + " tunnel");
}
