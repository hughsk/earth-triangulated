# earth-triangulated
![](http://img.shields.io/badge/stability-experimental-orange.svg?style=flat)
![](http://img.shields.io/npm/v/earth-triangulated.svg?style=flat)
![](http://img.shields.io/npm/dm/earth-triangulated.svg?style=flat)
![](http://img.shields.io/npm/l/earth-triangulated.svg?style=flat)

Mesh data for Earth, projected in 3D for easy rendering. Useable with Node and
[browserify](http://browserify.org), but note that it weighs in at ~470kB. For
a lighter file, you'll want to use the raw position data from a `Float32Array`
and load it back in as an `ArrayBuffer` using `XMLHttpRequest`.

[**view demo**](http://hughsk.io/earth-triangulated)

## Usage

[![NPM](https://nodei.co/npm/earth-triangulated.png)](https://nodei.co/npm/earth-triangulated/)

### `earth.positions`

A flat `Float32Array` containing the vertices of each country on Earth. Note
that this is an unindexed mesh, so if you were planning to render this with
WebGL you can simply use `gl.TRIANGLES` without the need for a
`gl.ELEMENT_ARRAY_BUFFER`.

### `earth.ranges`

A list of the vertex ranges for each country, i.e. where in `earth.positions`
each country begins and ends:

``` javascript
{
  "AFG": [0, 602],
  "AGO": [603, 1241],
  "ALB": [1242, 1421],
  // ...
  "ZWE": [80505,80819]
}
```

### `earth.centroids`

A list of the centroids of each country in the mesh indexed by country:

``` javascript
{
  "AFG": [-0.311692405023887,-0.7596524059851397,0.570767962250347],
  "AGO": [-0.9358763937343042,-0.2960691875556596,-0.1909932245683212],
  "ALB": [-0.7057509509290815,-0.2584029272708986,0.6596540930218867],
  // ...
  "ZWE": [-0.822293606069796,-0.468205677928872,-0.32344500084542444]
}
```

### `earth.index`

Numerical indices of each country in the mesh, so you can refer to them in
shaders consistently.

``` javascript
{
  "AFG": 0,
  "AGO": 1,
  "ALB": 2,
  // ...
  "ZWE": 176
}
```

## Caveats

Antarctica is missing :(

## License

MIT. See [LICENSE.md](http://github.com/hughsk/earth-triangulated/blob/master/LICENSE.md) for details.
