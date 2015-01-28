precision mediump float;

uniform float uindex;
varying float vindex;

void main() {
  float index = vindex * 0.005;
  float match = abs(vindex - uindex) < 0.5 ? 1.0 : 0.0;

  gl_FragColor = gl_FrontFacing
    ? vec4(vec3(index, uindex, match), 1)
    : vec4(vec3(0.8), 1);
}
