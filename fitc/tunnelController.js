function tunnelController(base){
	this.base = base;
}

tunnelController.prototype.init = function(){
	var geometry = ccMesh.cone(20.0,50.0,10.0,.2,50.);
	
    var uniforms = {
        time:       { value: 1.0 },
    };
    
	var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        wireframe:true
    } );
    
	this.mesh = new THREE.Mesh(geometry, material);
	base.scene.add(this.mesh);
	this.mesh.position.z = -20;

	base.addUpdateCallback(()=>{
        uniforms.time.value += 0.1;
		this.mesh.rotation.x = base.time.time;
		this.mesh.rotation.y = base.time.time*.333;
	});
}