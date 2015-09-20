var app = require("express")()
var bodyParser = require("body-parser")
var handler = require("./handler")

// Respond to the valid json payload using the logic in handler.js
function respond(req, res, next){
	res.json(
		handler(req.body.payload)
	)
}

function invalidJSON(error, req, res, next) {
	error instanceof SyntaxError ?
		res.status(400).json({ "error": "Could not decode request: JSON parsing failed" })
	:
		next()
}

app.use(bodyParser.json())
app.use(invalidJSON)
app.post("/", respond)

var server = app.listen(process.env.PORT || 8080, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});