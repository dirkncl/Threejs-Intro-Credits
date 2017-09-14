function shaderGenAlpha(base){
	
	var self = this;
 	base.loadAndSet("shaders/tunnel.vert",  self,"vert");
	base.loadingManager.itemStart("alphaFrag");
    
	base.load("fitc/alphaHeader.frag",(x)=>{
		x = x.split("...");
		self.fragHeader = x[0];
		self.fragFooter = x[1];
		base.loadingManager.itemEnd("alphaFrag");
	});
	
	this.parts = {};
	this.parts['a'] = "c.rgb = sin((c.bgr+vec3(.33,.0,.666)+uv.x)*3.+t)*.5+.5;\n";
	this.parts['b'] = "c.rgb = mod(c.brg+c.rgb*1.5+t*.5, 1.);\n";
	this.parts['c'] = "c.rgb = mod(c.rgb+uv.x+t*.5, .5);\n";
	this.parts['d'] = "c.rgb += cos(c.rgb+vec3(floor(mod(uv.y*2.+length(c.rgb), 3.))*.33, t, floor(mod(uv.y*2.,2.))*.25))*0.1;\n";
	this.parts['e'] = "uv.y +=floor(mod(uv.y*4.+sin(t)+floor(uv.x*10.)*.5,4.))*.05-.025;\n";
	this.parts['f'] = "uv.y = length(uv.xy+c.rb*.1)-.05;\n";
	this.parts['g'] = "c.rgb = sin((c.rgb+vec3(.0,.33,.66)+uv.x*.5)*6.+t)*.5+.5;\n";
	this.parts['h'] = "uv.x =uv.x+ mod(c.r, .5);\n";
	this.parts['i'] = "uv.x+= length(mod(c.rgb, 1.))*.1-.1;\n";
	this.parts['j'] = "c.rgb = c.brg;\n";
	this.parts['k'] = "uv.x-= length(mod(floor(uv*vec2(10., 30.)), 2.))*.1;\n";
	this.parts['l'] = "c.rgb = cos((c.brg+vec3(.0,.333,.666)+uv.x)*3.+t)*.5+.5;\n";
	this.parts['m'] = "c.rgb += sin(dot(c.rgb, pow(c.grb, vec3(.5))))*0.1;\n";
	this.parts['n'] = "c.rgb = cos(c.rgb+vec3(floor(uv*vec2(4.)), c.r*2.))*length(c.rgb);\n";
	this.parts['o'] = "uv.xy += sign(sin((50.+mod(floor((uv.x)*20.), 4.)))*(abs(mod((uv.x+uv.y)*6., 2.))+t))*.1;\n";
	this.parts['p'] = "c.rgb += sin((c.rgb+vec3(floor(uv*vec2(2.)), c.r*2.))*length(c.rgb))*0.1;\n"; 
	this.parts['q'] = "uv.y += (mod((t+uv.y)*.2,1. )-.05)*.66;\n";
	this.parts['r'] = "c.rg -= boxes(uv, 0.5, 3.0);\n";
	this.parts['s'] = "c.rgb = cos((c.rbg+vec3(sin(t),.33,cos(t)))*2.)*.5+.5;\n";
	this.parts['t'] = "c.rb = min(c.rb,c.br);\n";
	this.parts['u'] = "c.rgb = mod(1.+c.rgb+sin(vec3(.33,.25,.66)+t+floor(uv.x*5.)), vec3(1.));\n";
	this.parts['v'] = "c.rgb = 1.0-c.brg;\n";
	this.parts['w'] = "c.rgb = c.brg*.666;\n";
	this.parts['x'] = "c.rgb = mod(c.rgb*vec3(1., 4., 2.),1.);\n";
  	this.parts['y'] = "c.rgb = mod(c.rgb+t*.2+vec3(.66,.33,.0), vec3(1.));\n";
	this.parts['z'] = "c.rgb = c.brg*.666;\n";
}

shaderGenAlpha.prototype.getShader = function(s){
    var main = "";
	
	for(var i = 0; i < s.length; i++){
		var c = s.charAt(i).toLowerCase();
		if (this.parts[c] != undefined) 
        {
            main+= this.parts[c];   
        }
	}
    
    var shader = new THREE.ShaderMaterial(
		{
		uniforms: {
			t:  {type:"f",value: 0.},
			intensity:{type:"f", value:1.0 }
		},
		vertexShader: this.vert,
		fragmentShader: this.fragHeader+main+this.fragFooter,
        side:THREE.BackSide,
        transparent:true,
        blending: THREE.AdditiveBlending            
	});
	base.addUpdateCallback(()=>{
		shader.uniforms.t.value = base.time.time;
	});
	return shader;
  }