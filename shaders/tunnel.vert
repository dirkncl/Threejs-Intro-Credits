varying vec2 vUv;
uniform float t;
varying float fogValue;
void main()
{
    vUv = uv;
    vec3 pos = position;
    vec4 mvPosition = modelViewMatrix * vec4(    pos, 1.0 );
    vec3 wPos = (modelMatrix * vec4( position, 1.0 )).xyz;
    fogValue = clamp(1.0-abs(wPos.z)/300.0,0.,1.);
    gl_Position = projectionMatrix * mvPosition;
}