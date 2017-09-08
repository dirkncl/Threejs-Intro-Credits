function ccTextTools(base) {
    this.base = base;
    this.textMeshes = {};
    
    var loader = new THREE.FontLoader(base.loadingManager);
    var self = this;

    this.uniforms = {
        time:       { type:"f", value: 0.0 },
        intensity : { type:"f", value: 1.0 }
    };

    var frontMaterial = new THREE.ShaderMaterial( {          
        uniforms : this.uniforms,
        transparent:false,
    } );
    
    var sideMaterial = new THREE.ShaderMaterial( {          
        uniforms : this.uniforms,
        transparent:false      
    } );
    
    this.base.loadAndSet("shaders/fontfront.frag", frontMaterial,"fragmentShader");	
    this.base.loadAndSet("shaders/fontside.frag",  sideMaterial,"fragmentShader");
    this.base.loadAndSet("shaders/fontside.frag",  sideMaterial,"fragmentShader");
    
    this.base.load("shaders/font.vert", (x)=>{
        frontMaterial.vertexShader = x;
        sideMaterial.vertexShader = x;
    } );
    
    this.material = new THREE.MultiMaterial( [frontMaterial, sideMaterial ] );
    
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

ccTextTools.prototype.generateTextMesh = function(text) {
    
    var textGeo = new THREE.TextGeometry( text, {
        font: base.textTools.font,

        size: 2,
        height: 2,
        curveSegments: 4,

        bevelThickness: .15,
        bevelSize: .15,
        bevelEnabled: true,

        material: 0,
        extrudeMaterial: 1,
        
    });

    textGeo.computeBoundingBox();
    var textMesh = new THREE.Mesh( textGeo, this.material );
    return textMesh;
}