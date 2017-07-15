ccMotionBlur = function ( base, strength ) {

	var vert = "varying vec2 local;\n"+
			"void main(){\n"+
			"	local = uv;\n"+
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n"+	
			"}";
	var frag = "varying vec2 local;\n"+
			"uniform sampler2D tex;\n"+
			"uniform sampler2D blur;\n"+
			"uniform float strength;\n"+
			"void main(){\n"+
			"	gl_FragColor = mix(texture2D(tex,local),texture2D(blur,local),strength);\n"+	
			"}";
	var defaultFrag = "varying vec2 local;\n"+
			"uniform sampler2D tex;\n"+
			"uniform float strength;\n"+
			"void main(){\n"+
			"	gl_FragColor = texture2D(tex,local);\n"+
			"}";
	
	var save = new THREE.SavePass();
	base.addPost(new THREE.RenderPass( base.scene, base.camera ));
		
	base.addPost(new THREE.ShaderPass(
		{
		uniforms: {
			tex:{type:"t",value:null},
			blur:{type:"t",value:save.renderTarget},
			strength:  {type:"f",value: strength}
		},
		vertexShader: vert,
		fragmentShader: frag

	},"tex"));
	base.addPost(save);
	base.addPost(new THREE.ShaderPass(
		{
		uniforms: {
			tex:{type:"t",value:null}
		},
		vertexShader: vert,
		fragmentShader: defaultFrag

	},"tex"));
};