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
}, {
  buffer: glBuffer(gl, expandRanges(data.ranges, data.positions, data.index))
  , size: 1
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
  shader.attributes.position.location = 0
  shader.attributes.index.location = 1
  shader.uniforms.view = view
  shader.uniforms.proj = proj
  shader.uniforms.uindex = data.index.AUS

  mesh.bind()
  mesh.draw(gl.TRIANGLES, mesh.length)
}

window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)

function expandRanges(ranges, positions, index) {
  var output = new Float32Array(positions.length / 3)

  Object.keys(ranges).forEach(function(code) {
    var start = ranges[code][0] / 3
    var end   = ranges[code][1] / 3

    for (var i = start; i < end; i++) {
      output[i] = index[code]
    }
  })

  return output
}
