varying vec2 vUv;
uniform float intensity;
uniform float time;

void main()	{

    vec2 p = vUv;

    gl_FragColor=vec4(0.85, 0.85, 0.85, intensity*0.5);

}