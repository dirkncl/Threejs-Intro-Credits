var font;

function textController(base){
	this.base = base;
    
}

textController.prototype.loadFont = function(manager){
    var loader = new THREE.FontLoader(manager);
    
    loader.load( "fonts/helvetiker_regular.typeface.js", function ( response ) {
        console.log("loaded font");
        font = response;
    } , function ( ok ) {
        
        console.log("progress " + ok.loaded)
    } , function(error){
        console.log(error)
    });
}

textController.prototype.setText = function(text) {
    var textGeo = new THREE.TextGeometry( text, {
        font: font,

        size: 20,
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
}
