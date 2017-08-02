var font;

function textController(base){
	this.base = base;
    var uniforms = {
					time:       { value: 1.0 },
					resolution: { value: new THREE.Vector2() }
				};
    console.log(document.getElementById( 'fontFragmentShader' ).textContent)
    this.material = new THREE.MultiMaterial( [
        new THREE.ShaderMaterial( {          
        
        uniforms: {
            time: {type:"f", value: 1.0 }
    	},
        
        vertexShader: document.getElementById( 'fontVertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fontFragmentShader' ).textContent,
                                     } ), // front
        new THREE.MeshBasicMaterial( { color: 0x999998, shading: THREE.SmoothShading } ) // side
    ] );
    this.textMesh = new THREE.Mesh();
}

textController.prototype.loadFont = function(){
    var loader = new THREE.FontLoader(base.loadingManager);
    
    loader.load( "fonts/helvetiker_regular.typeface.js", function ( response ) {
        font = response;
    } , function ( ok ) {

    } , function(error){
        console.log(error)
    });

    this.animation = new ccAnimate(base, this.textMesh, new THREE.Vector3( 0, 0, 1 ))
        base.addUpdateCallback(()=>{
        this.textMesh.rotateOnAxis(new THREE.Vector3(0,0,1), Math.sin(base.time.time)*0.0025 );
    });
}

textController.prototype.setText = function(text) {
    this.animation.end();
    
    var textGeo = new THREE.TextGeometry( text, {
        font: font,

        size: 20,
        height: 20,
        curveSegments: 4,

        bevelThickness: 1.5,
        bevelSize: 1.0,
        bevelEnabled: true,

        material: 0,
        extrudeMaterial: 1
    });

    textGeo.center();

    base.scene.remove(this.textMesh);
    
    this.textMesh = new THREE.Mesh( textGeo, this.material );
    this.textMesh.position.z = -200;

    base.scene.add( this.textMesh );
    this.animation.start();
}
