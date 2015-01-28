module.exports = generateRanges

function generateRanges(countries, index, positions) {
  var size = positions.reduce(function(size, p) {
    return p.length + size
  }, 0)

  var mapping = {}
  var n = 0

  for (var i = 0; i < countries.length; i++) {
    var country = countries[i]
    var limit   = positions[i].length
    var id      = countries[i].id
    var idx     = index[id]

    mapping[id] = [n, n += limit]
  }

  return mapping
}
