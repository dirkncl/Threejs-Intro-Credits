varying vec2 vUv;
uniform float intensity;

void main()	{
    gl_FragColor=vec4(0.5, 0.5, 1.0, intensity*0.5);
}