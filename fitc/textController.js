var font;

function textController(base){
	this.base = base;
    
}

textController.prototype.createText = function(text, size){
    var loader = new THREE.FontLoader();
    loader.load( "fonts/helvetiker_regular.typeface.js", function ( response ) {
        font = response;
        var textGeo = new THREE.TextGeometry( "hi fitc", {
            font: font,

            size: size,
            height: 20,
            curveSegments: 4,

            bevelThickness: 1.5,
            bevelSize: 2.0,
            bevelEnabled: true,

            material: 0,
            extrudeMaterial: 1
        });

        textGeo.center();

        var material = new THREE.MultiMaterial( [
            new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } ), // front
            new THREE.MeshBasicMaterial( { color: 0xff00ff, shading: THREE.SmoothShading } ) // side
        ] );
        var textMesh1 = new THREE.Mesh( textGeo, material );
        textMesh1.position.z = -200;
        
        base.scene.add( textMesh1 );
    } , function ( ok ) {
        
        console.log("progress " + ok.loaded)
    } , function(error){
        console.log(error)
    });
    
}
