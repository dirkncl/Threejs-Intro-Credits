ccMotionBlur = function ( base, strength ) {

    this.noiseAmplitude = 0.0;
    this.noiseFrequency = 4.;
    this.strength = strength;
    this.lutIndex = 0;
    
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
            "   vec4 col = texture2D(tex,local);\n"+
			"	gl_FragColor = col + texture2D(blur,uv) * strength;\n"+
			"}";
	var defaultFrag = "varying vec2 local;\n"+
			"uniform sampler2D tex;\n"+
        	"uniform sampler2D lut1;\n"+
        	"uniform sampler2D lut2;\n"+
            "uniform float lutVal;\n"+
            "uniform float strength;\n"+
        
			"void main(){\n"+
            "vec4 textureColor = texture2D(tex,local);"+
            "vec2 texPos1 = vec2(smoothstep(0.,2.,textureColor.r + textureColor.g), 1.0-textureColor.b) ;"+
  
            "vec3 c1 = texture2D(lut1, texPos1).rgb;"+
            "vec3 c2 = texture2D(lut2, texPos1).rgb;"+
            
			"gl_FragColor = vec4(mix(textureColor.rgb, mix(c1, c2, lutVal), strength), textureColor.a);\n"+
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

    var lutUniforms = {
        tex:{type:"t",value:null},
        lut1:{type:"t", value:null},
        lut2:{type:"t", value:null},
        lutVal:  {type:"f",value: 0.0},
        strength:  {type:"f",value: 0.0}
    };

    this.lutPass = new THREE.ShaderPass(
    {
        uniforms: lutUniforms,
        vertexShader: vert,
        fragmentShader: defaultFrag
    },"tex");

    this.luts = [THREE.ImageUtils.loadTexture( "camp/maps/gradientMap9.png" ),
                THREE.ImageUtils.loadTexture( "camp/maps/gradientMap3.png" ),
                THREE.ImageUtils.loadTexture( "camp/maps/gradientMap2.png" ),
                THREE.ImageUtils.loadTexture( "camp/maps/gradientMap1.png" ),
                THREE.ImageUtils.loadTexture( "camp/maps/gradientMap8.png" ),
                THREE.ImageUtils.loadTexture( "camp/maps/gradientMap5.png" ),
                THREE.ImageUtils.loadTexture( "camp/maps/gradientMap7.png" ),
                THREE.ImageUtils.loadTexture( "camp/maps/lut vibe.png" )];
    
    base.addPost(this.lutPass);
    
    var self = this;
    base.addUpdateCallback(() => {
        self.pass.uniforms.time.value = base.time.time;
    });
    
    this.base = base;
};

ccMotionBlur.prototype.ApplyFirstLut = function(duration) {
    var self = this;
    this.lutPass.uniforms.lut1.value = this.luts[this.lutIndex];
    this.base.scheduler.callNextPhraseRange((progress)=>{   
        this.lutPass.uniforms.strength.value = progress;
    }, 0.0, 0.25);
}

ccMotionBlur.prototype.NextLut = function(duration) {

    this.lutIndex = (this.lutIndex+1) % this.luts.length;

    if (this.lutIndex % 2 != 0) 
    {
        this.lutPass.uniforms.lut2.value = this.luts[this.lutIndex];

        this.base.scheduler.callNextPhraseRange((progress)=>{   
            this.lutPass.uniforms.lutVal.value = progress;    
        }, 0.0, 0.5);
    }
    else 
    {
        this.lutPass.uniforms.lut1.value = this.luts[this.lutIndex];

        this.base.scheduler.callNextPhraseRange((progress)=>{   
            this.lutPass.uniforms.lutVal.value = 1.0-progress;    
        }, 0.0, 0.5);    
    }
}

ccMotionBlur.prototype.ClearLut = function() {
    this.base.scheduler.callNextPhraseRange((progress)=>{   
        this.lutPass.uniforms.strength.value = 1.0-progress;
    }, 0.0, 0.25);
}