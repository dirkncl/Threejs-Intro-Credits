var font;

function textController(base){
	this.base = base;
    this.material = new THREE.MultiMaterial( [
        new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } ), // front
        new THREE.MeshBasicMaterial( { color: 0xff00ff, shading: THREE.SmoothShading } ) // side
    ] );
    this.textMesh = new THREE.Mesh();
}

textController.prototype.loadFont = function(){
    var loader = new THREE.FontLoader(base.loadingManager);
    
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

    base.scene.remove(this.textMesh);
    
    this.textMesh = new THREE.Mesh( textGeo, this.material );
    this.textMesh.position.z = -200;

    base.scene.add( this.textMesh );
}
