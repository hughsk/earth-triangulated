const cartesian = require('./cartesian')
const poly2tri  = require('poly2tri')

module.exports = getCountryMesh
module.exports.shape = getShapeMesh

function getCountryMesh(country) {
  var shapes = country.geometry.coordinates

  // normalize countries with only one shape
  if (!Array.isArray(shapes[0][0][0])) {
    shapes = [shapes]
  }

  return shapes
    .map(getShapeMesh)
    .filter(Boolean)
}

function toPolyPoint(p) {
  return new poly2tri.Point(p[0], p[1])
}

function getShapeMesh(shape, i) {
  var polar   = i === true

  // convert our shape data into 2D poly2tri points
  var contour = shape[0].map(toPolyPoint)
  var holes   = shape.slice(1).map(function(d) {
    return d.map(toPolyPoint)
  })

  // We're triangulating latitudes/longitudes here so that
  // this problem can be solved in 2D instead of 3D. However,
  // this means that sometimes points wrap around the world map
  // resulting in weird triangles. The following corrects this problem.
  var distance = maxDistance(contour)
  if (distance > 300) {
    if (!unwrapContour(contour)) return false
    if (distance > 9000) {
      contour = contour.filter(function(p) {
        return p.x < 9000 && p.y < 9000
      })
    }
  }

  // poly2tri is pretty picky with its data. This is the
  // simplest workaround :(
  nudgeOverlappingVertices(contour)

  return triangulate(contour, polar)
}

// Work out the maxiumum distance between any two points
// on a single shape.
function maxDistance(contour) {
  var md = 0
  for (var i = 0; i < contour.length; i++)
  for (var j = 0; j < contour.length; j++) {
    var dx = contour[i].x - contour[j].x
    var dy = contour[i].y - contour[j].y
    var cd = dx * dx + dy * dy
    if (cd > md) md = cd
  }

  return Math.sqrt(md)
}

// Some contours wrap from one side of the map to the other,
// in particular Russia which ranges from -180 to 179. This is normally
// fine when projecting to 2D, but we have to triangulate the points in 2D by
// their latitude/longitude before we project them onto a sphere. If we leave
// this step out it we get a huge triangle stretching through the middle of
// the Earth.
function unwrapContour(contour) {
  for (var i = 0; i < contour.length; i++) {
    var p = contour[i]
    if (p.x < 0) p.x += 360
  }

  // return false if it's not fixed
  return !maxDistance(contour) < 300
}

// poly2tri freaks out if two vertices are *exactly* the
// same. Nudging them by an arbitrary amount causes errors
// with intersecting constraints, so instead we're moving the
// overlapping points closer to the point immediately before them.
function nudgeOverlappingVertices(contour) {
  var l = contour.length
  for (var i = 0; i < l; i++)
  for (var j = 0; j < l; j++) {
    if (i === j) continue
    var a = contour[i]
    var b = contour[j]
    if (a.x !== b.x) continue
    if (a.y !== b.y) continue
    var c = contour[(i+l-1)%l]
    var d = contour[(j+l-1)%l]
    a.x += (c.x - a.x) * 0.0001
    a.y += (c.y - a.y) * 0.0001
    b.x += (d.x - b.x) * 0.0001
    b.y += (d.y - b.y) * 0.0001
  }
}

function triangulate(contour, polar) {
  try {
    var swctx = new poly2tri.SweepContext(contour)
    swctx.triangulate()

    var triangles = swctx.getTriangles()
    for (var i = 0; i < triangles.length; i++) {
      var points = triangles[i] = triangles[i].getPoints()

      for (var j = 0; j < points.length; j++) {
        // working around the data: lat/lng appear to be in
        // the wrong order, and lat is offset by 90 degrees.
        points[j] = polar
          ? [points[j].y, points[j].x]
          : cartesian(points[j].y, points[j].x)
      }
    }
  } catch(e) {
    console.warn(e.message)
    return false
  }

  return triangles
}
