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

ccMesh.cone = function(radialSegments, depthSegments, radius, depth) {
	var geometry = new THREE.Geometry();
    
	for(var i = 0.0; i <= depthSegments; i+=1.0)
    {
        var depthProgress = (i / depthSegments) * depth
        var currentRadius = Math.lerp(radialSegments, 0.0, i / depthSegments)
        
		for(var segment = 0.0; segment <= radialSegments; segment++)
        {
            var angle = (segment / radialSegments) * Math.PI * 2.0
            
            var x = Math.cos(angle) * currentRadius 
            var y = Math.sin(angle) * currentRadius
            
			geometry.vertices.push(new THREE.Vector3(x,y,depthProgress))
		}
	}
    
    for(var i = 0; i<radialSegments; i++){
		for(var j = 0; j<depthSegments;j++){
			var f = (i*(depthSegments+1));
			geometry.faces.push(
				new THREE.Face3(j+f,j+f+1,j+f+radialSegments+1),
				new THREE.Face3(j+f+radialSegments+1, j+f+1, j+f+radialSegments+2)
			);
			geometry.faceVertexUvs[0].push([
				new THREE.Vector2( i/radialSegments , j/radialSegments ),
				new THREE.Vector2( i/radialSegments , (j+1)/depthSegments ),
				new THREE.Vector2( (i+1)/radialSegments , j/depthSegments )
			  ],
										  [
				
				new THREE.Vector2( (i+1)/radialSegments , j/depthSegments ),
				new THREE.Vector2( i/radialSegments , (j+1)/depthSegments ),
				new THREE.Vector2( ( i+1)/radialSegments , (j+1)/depthSegments )
			  ]);
		}		
	}
    
	/*for(var i = 0.0; i <= depthSegments; i+=1.0)
    {
		for(var segment = 0.0; segment < radialSegments; segment++)
        {
			var f1 = i*radialSegments + segment
            var f2 = (i+1)*radialSegments + segment
            
            geometry.faces.push(
				new THREE.Face3(f1, f2, f2 + 1),
				new THREE.Face3(f1, f2 + 1, f1 + 1)
			);
            
            var uvxp1 = (segment / radialSegments)
            var uvyp1 = i/depthSegments
            var uvxp2 = ((segment+1) / radialSegments)
            var uvyp2 = (i+1)/depthSegments
            
			geometry.faceVertexUvs[0].push([
				new THREE.Vector2( uvxp1, uvyp1 ),
				new THREE.Vector2( uvxp1, uvyp2 ),
				new THREE.Vector2( uvxp2, uvyp2 )
			  ],
										  [
				
            new THREE.Vector2( uvxp1, uvyp1),
            new THREE.Vector2( uvxp2, uvyp2 ),
            new THREE.Vector2( uvxp2, uvyp1 )
          ]);
    }		
	}*/
	
	geometry.uvsNeedUpdate = true;
	geometry.center();
	return geometry;
}