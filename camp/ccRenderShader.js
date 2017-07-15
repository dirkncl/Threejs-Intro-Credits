ccRenderShader = function ( shader, size ) {

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	this.size = size;
	this.material = new THREE.ShaderMaterial( {

		defines: shader.defines || {},
		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );
	this.writeBuffer =  new THREE.WebGLRenderTarget( size,size, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat } );

};

ccRenderShader.prototype = {

	render: function ( renderer ) {
		this.quad.material = this.material;
		this.writeBuffer.size = this.size;
		renderer.render( this.scene, this.camera, this.writeBuffer );
		return this.writeBuffer;
	}

};