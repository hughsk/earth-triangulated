var canvas   = document.body.appendChild(document.createElement('canvas'))
var camera   = require('canvas-orbit-camera')(canvas)
var gl       = require('gl-context')(canvas, render)
var glBuffer = require('gl-buffer')
var glslify  = require('glslify')
var mat4     = require('gl-mat4')
var glVAO    = require('gl-vao')

var data = require('../')
var mesh = glVAO(gl, [{
  buffer: glBuffer(gl, data.positions)
  , size: 3
}])

var shader = glslify({
    vert: './globe.vert'
  , frag: './globe.frag'
})(gl)

mesh.length = data.positions.length / 3
camera.distance = 3

var proj = mat4.create()
var view = mat4.create()

function render() {
  var width  = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight

  gl.enable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  gl.viewport(0, 0, width, height)
  gl.clearColor(1, 1, 1, 1)
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

  camera.view(view)
  camera.tick()
  mat4.perspective(proj, Math.PI / 4, width / height, 0.001, 1000)

  shader.bind()
  shader.uniforms.view = view
  shader.uniforms.proj = proj

  mesh.bind()
  mesh.draw(gl.TRIANGLES, mesh.length)
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)
