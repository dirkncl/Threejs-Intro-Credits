varying vec2 vUv;
uniform float intensity;

void main()	{
    gl_FragColor=vec4(1.0, 1.0, 1.0, intensity*0.5);

}