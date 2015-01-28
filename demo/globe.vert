precision mediump float;

attribute vec3 position;
attribute float index;

uniform mat4 proj;
uniform mat4 view;

varying float vindex;

void main() {
  vindex = index;
  gl_Position = proj * view * vec4(position, 1);
}
