varying vec2 vUv;
uniform float intensity;
uniform float time;

void main()	{

    vec2 p = vUv;

    gl_FragColor=vec4(0.0, cos(p.y*3. + intensity + time*5.)*0.5+0.5, intensity,intensity);

}