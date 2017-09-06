varying vec2 vUv;
uniform float t;
uniform vec4 x;
uniform vec4 y;
uniform float intensity;
varying float fogValue;
    
vec2 mirror(vec2 p){
	return abs(mod(p+1.,2.)-1.);
}
vec4 smin(vec4 a, vec4 b, float k){
	float h = clamp( 0.5+0.5*(b.w-a.w)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
	vec2 uv = vUv;
    uv.y *= 6.28;
    uv.x /= 0.5;
    vec4 c = uv.xxxx;
    vec4 b = c;
...
	 //b.rgb=mix(b.rgb,c.rgb,smoothstep(0.01,.0,c.a));
	 c.a = min(min(c.r, c.b), c.g);
	 //c.a *= (vUv.x);
	 c.a*= intensity;
     
     const vec3 aa = vec3(0.5,0.5,0.5);
     const vec3 bb = vec3(0.5,0.5,0.5); 
     const vec3 cc = vec3(2.0,1.0,1.0); 
     const vec3 dd = vec3(0.15,0.20,0.25);
     
     c.a *= fogValue;
     
     c.rgb = pal(length(c.rgb), aa, bb, cc, dd );
     c.rgb = pow(c.rgb, vec3(3.5));
     gl_FragColor = c;
}