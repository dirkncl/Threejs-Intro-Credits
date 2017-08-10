varying vec2 vUv;
uniform float t;
uniform vec4 x;
uniform vec4 y;
uniform float intensity;
	
vec2 mirror(vec2 p){
	return abs(mod(p+1.,2.)-1.);
}
vec4 smin(vec4 a, vec4 b, float k){
	float h = clamp( 0.5+0.5*(b.w-a.w)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

void main(){
	vec2 uv = vUv;
	vec4 c = uv.xxxx;
	 vec4 b = c;			
	 c.a = 0.;
...
	 //b.rgb=mix(b.rgb,c.rgb,smoothstep(0.01,.0,c.a));
	 c.a = min(c.r, c.b);
	 c*= 1.-pow(1.-smoothstep(6., 1.,vUv.x), 2.);
	 c.a*= intensity;
	 gl_FragColor = c;
}