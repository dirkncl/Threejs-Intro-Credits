uniform float seed;
uniform float time;
uniform float intensity;

varying vec2 vUv;

void main( void ) {
    vec2 p = vUv.yx;
    float v = smoothstep(.6, 1., p.y);
    p.y-=sin(time+seed)*.8-time;
    vec3 f = sin(vec3(seed*.1+p.x, sin(v*10.), seed+v*2.5) +p.x*6.+v*sin(p.y*10.+seed*4.)+(v*sin(seed*.5)*10.)+(v+sin(time*.4)*10.))*.5+.75;
    //f.r = sin(length(p.y*20.));
    //f.gb = f.rr;
    float a = length(f*.4)-.5;
    //a*= v;
    gl_FragColor = vec4( f, a*intensity);
}