Functional Endpoint for the mi9 coding challenge
================================================

Endpoint available at: http://james-forbes-mi9.herokuapp.com/

By sending a post message with [this request data](https://github.com/mi9/coding-challenge-samples/blob/master/sample_request.json)

The response should be [this response data](https://github.com/mi9/coding-challenge-samples/blob/master/sample_request.json)



What do you mean by functional exactly?
---------------------------------------

As this task is mostly stateless data filtration and transformation, it seemed a perfect fit for the functional utility
belt library [Ramda](http://ramdajs.com/docs/)

Ramda is a close cousin to libraries like Lodash or Underscore.js. 

The key difference that Ramda provides is composition.  Because each function waits for all its arguments before being
invoked, you can create powerful super functions by composing them.

To filter the response by custom predicates I composed several predicates using `R.allPass`

```js
var predicate = R.allPass([
  R.propEq("drm", true),
  R.prop("episodeCount")
])

//example

predicate({ drm: false, episodeCount:1 }) //=> false
predicate({ drm: true, episodeCount:0 }) //=> false
predicate({ drm: true, episodeCount:1 }) //=> true
```

To transform the data I compose `R.pick` and `R.evolve` to create a transformation function

```js
var transform = R.pipe(
  R.pick(["title","slug","image"]),
  R.evolve({
    image: R.prop("showImage")
  })
)

//example
transform({ a:1, b:2, c:3 , title: "Hi", slug: "...", image: { showImage: "picture.png" } }) 
//=> { title: "hi", slug: "...", image: "picture.png"}
```

The final output needed to be attached to a key called `response`.  Of course you could just return..
```
{ 
  response: ...
}
```
But I wanted to keep each component of the business logic as a composition of functions.

So instead the server handler is just a composition of the filtration, transformation and creating the `response` key

```
var handler = R.pipe(
  R.filter(predicate),
  R.map(transform),
  R.createMapEntry("response")
)
```

By exporting this handler, the server can handle all the logic of routing and parsing json, without having to
be _concerned_ with the particulars of the transformation of the response.


```
//server.js
var handler = require("./handler")

function respond(req, res, next){
	res.json(
		handler(req.body.payload)
	)
}

```

An added benefit of this approach is the possibility of conditionally using an alternative function 
based on the API request.

More Reading
------------


I've written a few posts on composition and ramda on my website http://james-forbes.com

- An explanation of Currying: http://james-forbes.com/#!posts/CurryingHurrying
- Using composition with Ramda for scraping wikipedia: http://james-forbes.com/#!posts/CurryingHurrying

