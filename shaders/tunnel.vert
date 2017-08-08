varying vec2 vUv;
uniform float time;
uniform float amp;
uniform float seed;

void main()
{
    vUv = uv;
    vec3 pos = position;
    pos.xy *=1.-pow(uv.x/6.3, .1);

    pos.xy += vec2(cos(pos.z*10. - time*(mod(seed, 1.)-.5)*2.+seed), sin(pos.z*200.0 - time*(mod(seed, 1.)-.5)*3.))*amp*uv.x;
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

    gl_Position = projectionMatrix * mvPosition;
}