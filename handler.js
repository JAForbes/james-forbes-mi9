/*
	Business logic for transformation and filtration of request
*/

var R = require("ramda")


// Filter the request by drm and episode count
var predicate = R.allPass([
  R.propEq("drm", true),
  R.prop("episodeCount")
])

// Change the shape of the response to only have title, slug and image.showImage
var transform = R.pipe(
  R.pick(["title","slug","image"]),
  R.evolve({
    image: R.prop("showImage")
  })
)

// Filter and transform the request, return an object { response: [...] }
var handler = R.pipe(
  R.filter(predicate),
  R.map(transform),
  R.createMapEntry("response")
)

module.exports = handler