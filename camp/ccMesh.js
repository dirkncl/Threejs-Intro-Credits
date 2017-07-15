ccMesh = function(){
	
}

ccMesh.plane = function(x, y, size){
	var geometry = new THREE.Geometry();
	for(var i = 0; i<=x; i++){
		for(var j = 0; j<=y;j++){
			geometry.vertices.push(new THREE.Vector3(i,0,j));
			
		}
	}
	for(var i = 0; i<x; i++){
		for(var j = 0; j<y;j++){
			var f = (i*(y+1));
			geometry.faces.push(
				new THREE.Face3(j+f,j+f+1,j+f+x+1),
				new THREE.Face3(j+f+x+1, j+f+1, j+f+x+2)
			);
			geometry.faceVertexUvs[0].push([
				new THREE.Vector2( i/x , j/y ),
				new THREE.Vector2( i/x , (j+1)/y ),
				new THREE.Vector2( (i+1)/x , j/y )
			  ],
										  [
				
				new THREE.Vector2( (i+1)/x , j/y ),
				new THREE.Vector2( i/x , (j+1)/y ),
				new THREE.Vector2( ( i+1)/x , (j+1)/y )
			  ]);
		}		
	}
	
	geometry.uvsNeedUpdate = true;
	geometry.center();
	return geometry;
}