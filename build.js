const getCountryMesh = require('./country-mesher')
const getRanges      = require('./country-ranges')
const getCentroids   = require('./centroids')
const topojson       = require('topojson')
const flatten        = require('flatten')
const tab64          = require('tab64')
const path           = require('path')
const fs             = require('fs')

;['110m'].forEach(function(scale) {
  const earth = require('earth-topojson/' + scale)
  const layer = Object.keys(earth.objects)[0]

  const countries = topojson
    .feature(earth, earth.objects[layer])
    .features
    .filter(function(d) {
      return d.id != '-99'
    })

  // Convert our GeoJSON data into triangles
  const positions = countries
    .map(getCountryMesh)
    .map(function(d) {
      return flatten(d)
    })

  // Work out the centroid for each country ahead of
  // time so they can be pinpointed.
  const centroids = getCentroids(countries)

  // Map 3-letter country codes to numerical
  // identifiers, such that it's possible to refer
  // to them individually in a shader.
  var countryIndex = {}
  var id = 0

  countries.forEach(function(country) {
    countryIndex[country.id] = id++
  })

  const ranges = getRanges(countries, countryIndex, positions)
  const mesh   = {
    ranges: ranges,
    index: countryIndex,
    positions: tab64.encode(new Float32Array(flatten(positions))),
    centroids: centroids
  }

  fs.writeFileSync(path.join(__dirname, 'mesh.json'), JSON.stringify(mesh))
})
