ccThreeBase = function(base){
	//*******************
	//**DEFAULT SHADERS**
	//*******************
	base.defaultVertShader = "#ifdef GL_ES\n"+
			"precision highp float;\n"+
			"#endif\n"+
			"varying vec2 local;\n"+
			"void main(){\n"+
			"	local = uv;\n"+
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n"+	
			"}";
	
	//***********
	//**THREEJS**
	//***********
	{
		base.scene = new THREE.Scene();
		base.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
		base.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, 
												 antialias:true });

		base.renderer.setSize( window.innerWidth, window.innerHeight );
		base.canvas = base.renderer.domElement;
		document.body.appendChild( base.canvas );	
		
		base.post = new THREE.EffectComposer(base.renderer);
		var rend = new THREE.RenderPass(base.scene,base.camera);
		base.post.addPass(rend);
		base.postEffects = [];
		base.addPost = function(shader){
			if(base.postEffects.length>0)
				base.postEffects[base.postEffects.length-1].renderToScreen = false;
			base.postEffects.push(shader);
			shader.renderToScreen = true;
			base.post.addPass(shader);
		}
		base.removePost = function(shader){
			var i = base.postEffects.indexOf(shader);
			if(i!=-1){
				base.post.removePass(shader);
				base.postEffects.splice(i,1);
				if(base.postEffects.length>0)
					base.postEffects[base.postEffects.length-1].renderToScreen = true;
			}
		}	
          
        base.loadingManager = new THREE.LoadingManager();
            
        base.loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        base.loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        base.loadingManager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };
	}
	
	this.onResize = function(){
		base.camera.aspect = window.innerWidth/window.innerHeight;
		base.renderer.setSize(window.innerWidth,window.innerHeight);
		base.camera.updateProjectionMatrix();
	}
	base.addResizeCallback(this.onResize);
	
	this.onRender = function(){
		if(base.postEffects.length>0){
			base.renderer.autoClear = false;
			base.renderer.setRenderTarget( null );
			base.renderer.clear();
			base.post.render(0.1);
		}else{
			base.renderer.render( base.scene, base.camera );
		}
	}
	base.addUpdateCallback(this.onRender);
}