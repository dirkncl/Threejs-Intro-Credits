varying vec2 vUv;
uniform float intensity;
uniform float time;

void main()	{

    vec2 p = vUv;

    gl_FragColor=vec4(1.0, sin(p.y*5. + intensity + time)*0.5+0.5, intensity,intensity);

}