ccStringGlitch = function ( base ) {

	var vert = "varying vec2 local;\n"+
			"void main(){\n"+
			"	local = uv;\n"+
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n"+	
			"}";
	var fragStart = "varying vec2 local;\n"+
			"uniform sampler2D tex;\n"+
			"uniform float strength;\n"+
			"uniform float t;\n"+
			"uniform float orbMix;\n"+
			"uniform vec2 pos0;\n"+
			"uniform vec2 pos1;\n"+
			"uniform vec2 pos2;\n"+      
			"vec2 mirror(vec2 p){\n"+
			"	return abs(mod(p+1.,2.)-1.);}\n"+
			"vec4 smin(vec4 a, vec4 b, float k){\n"+
			"float h = clamp( 0.5+0.5*(b.w-a.w)/k, 0.0, 1.0 );\n"+
			"return mix( b, a, h ) - k*h*(1.0-h);"+
      "}\n";
  var mainStart = "void main(){\n"+
			"	vec4 c = texture2D(tex,local);\n"+
			" vec4 b = c;\n"+			
			" c.a = 0.;";			
	var mainEnd = " b.rgb=mix(b.rgb,c.rgb,smoothstep(0.01,.0,c.a));\n	gl_FragColor = b;\n"+//mix(b,c,strength);\n"+
			"}";
	var count = 1;
	var parts = {};
	parts['a'] = "c.rgb = sin((c.bgr+vec3(.33,.0,.666)+uv.x)*3.+t)*.5+.5;\n";
	parts['b'] = "c.rgb = mod(c.brg+c.rgb*1.5, 1.);\n";
	parts['c'] = "c.rgb = mod(c.rgb+uv.x, .5);\n";
	parts['d'] = "c.rgb = (c.rgb+vec3(floor(mod(uv.x*200.+length(c.rgb), 3.))*.33, t, floor(mod(uv.y*20.,2.))*.25));\n";
	parts['e'] = "uv.x+=floor(mod(uv.y*100.+sin(t)+floor(uv.x*10.)*.5,2.))*.05-.025;\n";
	parts['f'] = "uv.xy = (uv.xy+c.rb*.1)-.05;\n";
	parts['g'] = "c.rgb = sin((c.rgb+vec3(.0,.33,.66)+uv.y*.5)*6.+t)*.5+.5;\n";
	parts['h'] = "uv.y =uv.y+ mod(c.r, .1);\n";
	parts['i'] = "uv.y+= length(mod(c.rgb, 1.))*.1-.1;\n";
	parts['j'] = "c.rgb = c.brg;\n";
	parts['k'] = "uv-= mod(floor(uv*vec2(100., 300.)), 2.)*.1;\n";
	parts['l'] = "c.rgb = mod(c.grb*2.,1.);\n";
	parts['m'] = "c.rgb = normalize(c.rgb);\n";
	parts['n'] = "c.rgb = 1.0-c.brg;\n";
	parts['o'] = "uv.xy += sign(sin((50.+mod(floor((uv.x)*20.), 4.)))*(abs(mod((uv.x+uv.y)*6., 2.))+t))*.1;\n";
	parts['p'] = "c.rgb = normalize(c.rgb+vec3(floor(uv*vec2(10., 20.)), c.r*10.))*length(c.rgb);\n"; 
	parts['q'] = "c.rgb = mod(c.rgb+vec3(.33,.95,.66), vec3(1.));\n";
	parts['r'] = "uv.x += (mod((t+uv.y)*.2,.1 )-.05)*.66;\n";
	parts['s'] = "c.rgb = cos((c.rbg+vec3(sin(t),.33,cos(t)))*7.)*.5+.5;\n";
	parts['t'] = "c.rb = min(c.rb,c.br);\n";
	parts['u'] = "c.rgb = mod(1.+c.rgb+sin(vec3(.33,.25,.66)*7.+t+floor(uv.x*5.)), vec3(1.));\n";
	parts['v'] = "c.rgb = 1.0-c.brg;\n";
	parts['w'] = "c.rgb = c.brg*.666;\n";
	parts['x'] = "c.rgb = mod(c.rgb*vec3(1., 10., 5.),1.);\n";
  parts['y'] = "c.rgb = mod(c.rgb+t*.2+vec3(.66,.33,.0), vec3(1.));\n";
	parts['z'] = "c.rgb = c.brg*.333;\n";
	
	
	var shader = new THREE.ShaderPass(
		{
		uniforms: {
			tex:{type:"t",value:null},
			strength:  {type:"f",value: 1.},
			t:  {type:"f",value: 0.},
			orbMix:  {type:"f",value: 0.},
			pos0:  {type:"v2",value: new THREE.Vector2(0,0)},
			pos1:  {type:"v2",value: new THREE.Vector2(0,0)},
			pos2:  {type:"v2",value: new THREE.Vector2(0,0)}
		},
		vertexShader: vert,
		fragmentShader: fragStart+mainStart+mainEnd

	},"tex");
	var strength = .1;
	var show = false;
	var showSpeed = 0.015;
	var hideSpeed = 0.005
	
	base.addPost(shader);
	
	base.addUpdateCallback(function(){
    var a = Math.PI*2/count;
    var p = base.time.time;
    var d = .2;
    for(var i = 0; i<count; i++){
      shader.uniforms["pos"+i].value = new THREE.Vector2(Math.sin(p+a*i)*d+.5, Math.cos(p+a*i)*d+.5);
    }
    shader.uniforms.strength.value = 1;//strength;	
		shader.uniforms.t.value = base.time.time*.2;
		shader.uniforms.orbMix.value = base.mouse.y/window.innerHeight;
	});
	
  
  this.setString = function(s){
    var names = s.split(" ");
    
    var func = "";
    var vars = "";
    var size = .2;
    var main = mainStart;
    count = Math.min(3,names.length);
    for(var i = 0; i<count; i++){
      var valid = false;
      for(var j = 0; j<names[i].length; j++){
        if(parts[names[i].charAt(j)]!=null){
          valid=true;
          break;
        }
      }
      if(!valid){
        count--;
        continue;
      }
      main+="vec4 o"+i+" = orb"+i+"(c, local, pos"+i+", "+size+");\n";
      size*=.666;
      func+="vec4 orb"+i+"(vec4 c, vec2 uv, vec2 position, float size){\n";
      for(var j = 0; j<names[i].length; j++){
        var s = names[i].charAt(j);
        if(parts[s] !=null){
          func+=parts[s];
        }
      }
      func+="c.a = length(uv-position)-size;\n return c;}\n";
    }  
    main+="c = o0;\n";
    if(count>1){
      for(var i = 1; i<count; i++){
        main+= "c = smin(c, o"+i+", orbMix);\n"; 
      }
    }else if(count<=0){
      return;
    }
    main+=mainEnd;
    show = true;
    strength = 1;
    shader.material.fragmentShader = fragStart+vars+func+main;
    shader.material.needsUpdate = true;
  }
	
	base.setString = this.setString;
      base.setString("cale bradbury");
	this.setStrength = function(i){
		shader.uniforms.strength.value = i;	
	}
};