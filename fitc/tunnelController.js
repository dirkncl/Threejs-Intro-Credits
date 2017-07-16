function tunnelController(base){
	this.base = base;
}

var uniforms;
var material;

tunnelController.prototype.init = function(){
	var geometry = ccMesh.cone(20.0,50.0,10.0,.2,50.);
	
    uniforms = {
        time:       { type: "f", value: 1.0 }
    };
    
	material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        wireframe:true
    } );
    
	var mesh = new THREE.Mesh(geometry, material);
	base.scene.add(mesh);
	mesh.position.z = -36;

	base.addUpdateCallback(()=>{
        uniforms.time.value += 0.1;
		//mesh.rotation.x += .01;
		//mesh.rotation.y += .02;
	});
}