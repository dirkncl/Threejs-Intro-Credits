function tunnelController(base){
	this.base = base;
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
			side:THREE.DoubleSide,
			transparent:true,
			blending: THREE.AdditiveBlending,
			depthTest: false
	} );
	
	this.meshes = [];
	
	for(var i = 0; i< 5; i++){
		var mesh = new THREE.Mesh(geometry, this.material.clone());
		base.scene.add(mesh);
		mesh.position.z = -80;
		this.meshes.push(mesh);
	}
	base.addUpdateCallback(()=>{
		for(var i = 0; i< this.meshes.length; i++){
			this.meshes[i].material.uniforms.time.value = base.time.time*(this.meshes[i].material.uniforms.seed.value%1+.5);
			//this.meshes[i].rotation.x = Math.sin(base.time.time)*.2;
			this.meshes[i].rotation.y =Math.PI;// Math.cos(base.time.time)*.2+Math.PI;
			//this.meshes[i].rotation.z = i+base.time.time;
		}
	});
	var self = this;
	this.seed();
	this.base.addMouseDownCallback(()=>{self.seed();});
}


	tunnelController.prototype.seed = function(){
		var x = Math.random()*.1;
		for(var i = 0; i< this.meshes.length; i++){
			this.meshes[i].material.uniforms.seed.value = Math.random()*100000000000000;
		}
	}