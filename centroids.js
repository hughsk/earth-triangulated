const getShapeMesh = require('./country-mesher').shape
const cartesian    = require('./cartesian')

module.exports = getCentroids

function getCentroids(countries) {
  return countries.reduce(function(index, country) {
    var shapes = country.geometry.coordinates

    if (!Array.isArray(shapes[0][0][0])) {
      shapes = [shapes]
    }

    // Determines the largest shape in this country
    // and works out its centroid. Some countries, such
    // as the US, are spread out in such a way that their
    // *actual* centroid is misleading.
    var areas = shapes.map(getShapeArea)

    var maxIndex = -1
    var maxValue = -Infinity

    for (var i = 0; i < areas.length; i++) {
      if (areas[i] < maxValue) continue
      maxIndex = i
      maxValue = areas[i]
    }

    var centroid = getCentroid(shapes[maxIndex][0])
    index[country.id] = cartesian(centroid[1], centroid[0])

    return index
  }, {})
}

function getShapeArea(shape) {
  var tris = getShapeMesh(shape, true)
  var area = 0

  for (var i = 0; i < tris.length; i++) {
    area += triangleArea(tris[i])
  }

  return area
}

function triangleArea(tri) {
  var area = (
      tri[0][0] * tri[1][1]
    + tri[1][0] * tri[2][1]
    + tri[2][0] * tri[0][1]
    - tri[0][1] * tri[1][0]
    - tri[1][1] * tri[2][0]
    - tri[2][1] * tri[0][0]
  )

  return area > 0 ? area : -area
}

function getCentroid(points) {
  var centroid = [0, 0]

  for (var i = 0; i < points.length; i++) {
    centroid[0] += points[i][0]
    centroid[1] += points[i][1]
  }

  centroid[0] /= points.length
  centroid[1] /= points.length

  return centroid
}
