/**
 * "Building Blocks of Express" Soup-to-Bits demo application by
 *  www.codeschool.com, implemented by Todd Morningstar. It lists some
 *  metaphorical cities, and you can add new ones, and its pretty.
 */
var express    = require('express');
var app        = express();

// Require 'body-parser' middleware to easily grab form fields from the request
//  body. Use node's native 'qs' (querystring) string parsing library by
//  passing in the `extended: false` configuration property to urlencoded().
var bodyParser = require('body-parser');
var urlEncode  = bodyParser.urlencoded({extended: false});

// Local var 'cities' acts like a db for demo
var cities = {
  'Lotopia': 'No, it isnt \'LOLtopia\'...',
  'Caspiana': 'A city on the sea. A very cold sea.',
  'Indigo': 'One blue town. Its practically ultraviolet.'
};

// ----- BEGIN ROUTES -----

// Handle requests to index.html w express 'static' middleware, mounted for
//  all requests via `app.use()`.
app.use(express.static('public'));

// Displays all current Cities
app.get('/cities', function(req, res){
  res.json(Object.keys(cities));
});

// POST requests to /cities are url-encoded via the `body-parser.urlencoded`
//  middleware.
app.post('/cities', urlEncode, function(req, res) {
  // uses 'body-parser' middleware to get request.body
  var newCity = req.body;
  cities[newCity.name] = newCity.description;
  res.status(201).json(newCity.name);
});

// ----- END ROUTES -----

// encapsulate app inside of node module, in order to allow app definition and
//  the code that binds the app to the network to exist in different
//  files/modules (this replaces `app.listen(3000);`).
module.exports = app;
