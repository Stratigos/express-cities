/**
 * "Building Blocks of Express" Soup-to-Bits demo application by
 *  www.codeschool.com, implemented by Todd Morningstar. It lists some
 *  metaphorical cities, and you can add new ones, and its pretty.
 */
var express    = require('express');
var app        = express();

// Handle requests to index.html w express 'static' middleware, mounted for
//  all requests via `app.use()`.
app.use(express.static(__dirname + '/public'));

// Modularized middleware for routes.
var cities = require('./routes/cities');
// Adds all routes defined in ./routes/cities to the '/cities' path
app.use('/cities', cities);

// Encapsulate app inside of node module, in order to allow app definition and
//  the code that binds the app to the network to exist in different
//  files/modules (this replaces `app.listen(3000);`).
// @see ./bin/www
module.exports = app;
