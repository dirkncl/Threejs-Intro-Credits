function tunnelController(base){
	this.base = base;
}

tunnelController.prototype.init = function(){
	var geometry = ccMesh.plane(10,10, 3);
			
	var material = new THREE.MeshBasicMaterial( {
		color: 0xffffff,
		wireframe: true
	} );
	var mesh = new THREE.Mesh(geometry, material);
	base.scene.add(mesh);
	mesh.position.z = -20;

	base.addUpdateCallback(()=>{
		mesh.rotation.x += .01;
		mesh.rotation.y += .02;
	});
}