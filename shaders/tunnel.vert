varying vec2 vUv;
uniform float t;
uniform float amp;
uniform float seed;
varying float fogValue;
void main()
{
    vUv = uv;
    vec3 pos = position;
    //pos.xy *=1.-pow(uv.x/10.3, .1);

    //pos.xy += vec2(cos(pos.z*10. - t*(mod(seed, 1.)-.5)*2.+seed), sin(pos.z*200.0 - t*(mod(seed, 1.)-.5)*3.))*amp*uv.x;
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    vec3 wPos = (modelMatrix * vec4( position, 1.0 )).xyz;
    
    fogValue = clamp(1.0-abs(wPos.z)/300.0,0.,1.);
    gl_Position = projectionMatrix * mvPosition;
}