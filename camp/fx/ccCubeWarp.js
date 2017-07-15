ccCubeWarp = function ( base ) {

	var vert = "varying vec2 local;\n"+
			"void main(){\n"+
			"	local = uv;\n"+
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n"+	
			"}";
	var frag = "varying vec2 local;\n"+
			"uniform sampler2D iChannel0;\n"+
			"uniform float iGlobalTime;\n"+
			"uniform float scale;\n"+
			"float sdBox( vec3 p, vec3 b ){"+
  "vec3 d = abs(p) - b;"+
  "return min(max(d.x,max(d.y,d.z)),0.0) +"+
   "      length(max(d,0.0));}"+
"float sdSphere( vec3 p, float b ){"+
 " return length(p)-b;"+
"}"+

"float map(vec3 p){"+
 "   float t = iGlobalTime*.2;"+
  "  p.xz *= mat2(cos(t), sin(t), -sin(t), cos(t));"+
   " p.xy *= mat2(cos(t), sin(t), -sin(t), cos(t));"+
"   p.yz *= mat2(cos(t), sin(t), -sin(t), cos(t));"+
   // p.z+=t;
 "   p = mod(p,vec3(.5))-.25;"+
    
  "  float k = sdBox(p, vec3(.1));"+
   // float k = sdSphere(p, .2);
   " float o = 0.099;"+
	"k = max(k, -sdBox(p, vec3(2.0, o, o)));"+
  "  k = max(k, -sdBox(p, vec3(o, 2.0, o)));"+
"    k = max(k, -sdBox(p, vec3(o, o, 2.0)));"+
 "   return k*2.;}"+

"float trace(vec3 o, vec3 r){"+
" 	float t = 0.0;"+
"    for (int i = 0; i < 22; i++) {"+
"        vec3 p = o + r * t;"+
"        float d = map(p)*.5;"+
"        t += d;"+
"    }"+
"    return t;"+
"}"+

"void main(){"+
"	vec2 uv = local;"+
"    vec2 u = uv;"+
"    uv = uv * 2.0 - 1.0;"+
"   uv.x *= scale;"+
    
 "   vec3 o = vec3(0.0, 0.0, 0.0);"+
"    vec3 r = vec3(uv, .8);"+
"    float t = trace(o, r);   "+
"    vec3 fog = vec3(1.0) / (1.0 + t * t * .1) ;"+
"    fog = min(fog,vec3(1.));   "+
"    float c = iGlobalTime*.6 + uv.x*uv.y*2.;"+
"    fog *= vec3(sin(c)*cos(c*2.0), cos(c)*cos(c*1.5), sin(c*1.423)) * 0.5 + 0.5;   "+
"    vec3 old = texture2D(iChannel0,u).rgb;"+
"    u-=.5;"+
"    float d = length(u);"+
"    float a = atan(u.y,u.x)+(old.r*sin(iGlobalTime*.1+d*8.)*.03);"+
"    old.gb = old.gb*.01-.005;"+
"    u.x = cos(a)*(d-old.g);"+
"    u.y = sin(a)*(d+old.b);"+
"    old = texture2D(iChannel0,u+.5).rgb*.997;"+
"    fog = max(old,fog);"+
"    fog = pow(abs(fog),vec3(1.01));"+
"    gl_FragColor = vec4(fog, 1.0);"+
"}";
	var defaultFrag = "varying vec2 local;\n"+
			"uniform sampler2D tex;\n"+
			"void main(){\n"+
			"	gl_FragColor = texture2D(tex,local);\n"+
			"}";
	
	var save = new THREE.SavePass();
	base.addPost(new THREE.RenderPass( base.scene, base.camera ));
		
	var cube = new THREE.ShaderPass(
		{
		uniforms: {
			iChannel0:{type:"t",value:save.renderTarget},
			iGlobalTime:  {type:"f",value: base.time.time},
			scale:  {type:"f",value: 1}
		},
		vertexShader: vert,
		fragmentShader: frag

	});
	
	base.addPost(cube);
	base.addPost(save);
	base.addPost(new THREE.ShaderPass(
		{
		uniforms: {
			tex:{type:"t",value:null}
		},
		vertexShader: vert,
		fragmentShader: defaultFrag

	},"tex"));
	
	
	base.addUpdateCallback(function(){
		cube.uniforms.iGlobalTime.value = base.time.time;
		cube.uniforms.scale.value = (window.innerWidth/window.innerHeight);		
	});
};