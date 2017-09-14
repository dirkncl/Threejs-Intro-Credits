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

    uv.x /= 0.25;
    vec4 c = uv.xxxx;
    uv.y *= 6.28;
    vec4 b = c;
...
	 c.a*= intensity;
     
     const vec3 aa = vec3(0.15,0.15,0.15);
     const vec3 bb = vec3(0.15,0.15,0.15); 
     const vec3 cc = vec3(2.0,1.0,1.0); 
     const vec3 dd = vec3(0.85,0.8,0.75);

     c.a *= fogValue;
     
     c.rgb = sin(c.rgb)*0.15+0.15;
     //c.rgb = pal((length(c.rgb))*0.5, aa, bb, cc, dd );
     c.rgb = pow(c.rgb, vec3(1.666));
     c.a *= intensity;
     gl_FragColor = c;
}