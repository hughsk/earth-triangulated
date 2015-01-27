precision mediump float;

void main() {
  gl_FragColor = gl_FrontFacing
    ? vec4(vec3(0.2), 1)
    : vec4(vec3(0.8), 1);
}
