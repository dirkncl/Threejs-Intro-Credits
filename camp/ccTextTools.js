function ccTextTools(base) {
    this.base = base;
    this.textMeshes = {};
    
    var loader = new THREE.FontLoader(base.loadingManager);
    var self = this;

    this.uniforms = {
        intensity : { type:"f", value: 1.0 }
    };

    this.titleMaterial = new THREE.ShaderMaterial( {          
        uniforms : this.uniforms,
        transparent:false,
    } );
    
    this.base.loadAndSet("shaders/titlefontfront.frag", this.titleMaterial,"fragmentShader");	

    this.base.loadAndSet("shaders/font.vert", this.titleMaterial, "vertexShader");
    
    loader.load( "fonts/droid/droid_sans_regular.typeface.js", function ( response ) {
        self.font = response;
    } , function ( progress ) {

    } , function(error){
        console.log(error);
    });  
}

ccTextTools.prototype.loadTextMeshes = function(strings, onComplete) {
    for (var i = 0; i < strings.length; i++) {
        var string = strings[i].string;
        var key = strings[i].key;
        this.textMeshes[key] = this.generateTextMesh(string);
    }
    onComplete();
}

ccTextTools.prototype.generateTextMesh = function(text, mat) {
    
    var textGeo = new THREE.TextGeometry( text, {
        font: base.textTools.font,

        size: 2,
        height: 2,
        curveSegments: 4,

       
        material: 0,
        extrudeMaterial: false,
        
    });

    textGeo.computeBoundingBox();
    
    return new THREE.Mesh( textGeo, this.titleMaterial );    
}