ccMotionBlur = function ( base, strength ) {

    this.noiseAmplitude = 0.0;
    this.noiseFrequency = 4.;
    this.strength = strength;
    
	var vert = "varying vec2 local;\n"+
			"void main(){\n"+
			"	local = uv;\n"+
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n"+	
			"}";
	var frag = "varying vec2 local;\n"+
			"uniform sampler2D tex;\n"+
			"uniform sampler2D blur;\n"+
			"uniform float strength;\n"+
            "uniform float noiseAmplitude;\n"+
            "uniform float noiseFrequency;\n"+
            "uniform float time;"+
            "float rand (float x) {"+
            "return fract(sin(x)*1000.0);"+
            "}"+
            "float noise(float x, float cycles) {"+
            "   float i = floor(mod(x,cycles));"+
            "   float f = fract(mod(x,cycles));"+
            "   return mix(rand(i), rand(mod(i + 1.0, cycles)), smoothstep(0.,1.,f));"+
            "}"+
			"void main(){\n"+
            "	vec2 uv = 2.0 * local - 1.0 ;\n"+	
            "   float cycles = 16.0;"+
            "	float angle = atan(uv.y, uv.x);\n"+
            "	float angleNoise = ((angle+3.14159)/6.28318)*cycles;\n"+
            "	float l = length(uv);\n"+
            "	l *= (.5 - noise(angleNoise*noiseFrequency + time, cycles)*noiseAmplitude);\n"+
            "	uv = vec2(cos(angle)*l + 0.5, sin(angle)*l + 0.5);\n"+	        
			"	gl_FragColor = texture2D(tex,local) + texture2D(blur,uv) * strength;\n"+	
			"}";
	var defaultFrag = "varying vec2 local;\n"+
			"uniform sampler2D tex;\n"+
			"uniform float strength;\n"+
			"void main(){\n"+
			"	gl_FragColor = texture2D(tex,local);\n"+
			"}";
	
	var save = new THREE.SavePass();
	base.addPost(new THREE.RenderPass( base.scene, base.camera ));
		
    this.uniforms = {
			tex:{type:"t",value:null},
			blur:{type:"t",value:save.renderTarget},
			strength:  {type:"f",value: this.strength},
            noiseAmplitude:  {type:"f",value: 0.0},
            noiseFrequency:  {type:"f",value: this.noiseFrequency},
            time: {type:"f", value: 0.0 }  
    };
    
    this.pass = new THREE.ShaderPass(
        {
		uniforms: this.uniforms,
		vertexShader: vert,
		fragmentShader: frag
	},"tex");
    
	base.addPost(this.pass);
    
	base.addPost(save);

    base.addPost(new THREE.ShaderPass(
		{
		uniforms: {
			tex:{type:"t",value:null}
		},
		vertexShader: vert,
		fragmentShader: defaultFrag

	},"tex"));
    
    var self = this;
    base.addUpdateCallback(() => {
        self.pass.uniforms.time.value = base.time.time;
    });
};