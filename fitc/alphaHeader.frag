varying vec2 vUv;
uniform float t;
uniform vec4 x;
uniform vec4 y;
uniform float intensity;
varying float fogValue;
    
    float opS( float d1, float d2 )
{
    return max(-d1,d2);
}

float sdBox( vec2 p, vec2 b )
{
  vec2 d = abs(p) - b;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float boxes(vec2 uv, float size, float repetitions) {
    uv = mod (uv*repetitions, 1.) - 0.5;

    float dist = sdBox(uv, vec2(size));
    dist = opS(sdBox(uv, vec2(size*0.8)), dist);
    
    return step(dist,0.);
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
...
     c.a *= fogValue;
     c.a *= intensity;
     
     c.b = 0.0;
     c.rg = pow(c.rg, vec2(3.666));
     
     gl_FragColor = c;
}