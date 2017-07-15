function tunnelController(base){
	this.base = base;
}

tunnelController.prototype.init = function(){
	var geometry = ccMesh.cone(10.0,10.0,10.0,10.);
	
    var uniforms = {
        time:       { value: 1.0 },
    };
    
	var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side:THREE.DoubleSide
	} );
    
	this.mesh = new THREE.Mesh(geometry, material);
	base.scene.add(this.mesh);
	this.mesh.position.z = -20;

	base.addUpdateCallback(()=>{
		this.mesh.rotation.x = base.time.time;
		this.mesh.rotation.y = base.time.time*.333;
	});
}