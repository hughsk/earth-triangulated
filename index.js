var mesh  = require('./mesh.json')
var tab64 = require('tab64')

// Positions are encoded in base64 to reduce their size
// significantly. Further improvements can be made by
// encoding the binary data directly.
module.exports = {
  positions: tab64.decode(mesh.positions, 'float32'),
  ranges: mesh.ranges,
  index: mesh.index,
  centroids: mesh.centroids
}
