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

// Using redis for data store, and redistogo for persistence. 
//  @see https://devcenter.heroku.com/articles/redistogo#using-with-node-js
var redis  = require('redis');
if (process.env.REDISTOGO_URL) {
  var rtg    = require('url').parse(process.env.REDISTOGO_URL);
  console.log("\n RTG PORT AND HOSTNAME: \n", rtg.port, rtg.hostname, "\n");
  var client = redis.createClient(rtg.port, rtg.hostname);
  console.log("\n REDIS CLIENT: ", client, "\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")

  client.auth(rtg.auth.split(":")[1]);
} else {
  var client = redis.createClient();
  // Select the appropriate database. Redis databases are identified by an
  //  integer index, so a seperate number should be used for dev and test 
  //  databases. For the sake of this demonstration, the stringlength of the
  //  'development' and 'test' environments will be used.
  client.select((process.env.NODE_ENV || 'development').length);
}

// Seed the database. Typically this would be done by a separate script on the
//  server, to avoid running this seed procedure with each app restart, but 
//  performing the seeding here simplifies this demonstration.
// client.hset('cities', 'Lotopia', 'No, it isnt \'LOLtopia\'...');
// client.hset('cities', 'Caspiana', 'A city on the sea. A very cold sea.');
// client.hset('cities', 'Indigo', 'One blue town. Its practically ultraviolet.');

// ----- BEGIN ROUTES -----

// Handle requests to index.html w express 'static' middleware, mounted for
//  all requests via `app.use()`.
app.use(express.static('public'));

// Displays all current Cities
app.get('/cities', function(req, res) { 
  client.hkeys('cities', function(err, citynames) {
    if (err) {
      throw err;
    }
    res.json(citynames);
  });
});

// POST requests to /cities are url-encoded via the `body-parser.urlencoded`
//  middleware. `urlEncode` recieves the request, and creates the request.body
//  property, from which POST params can be extracted.
app.post('/cities', urlEncode, function(req, res) {
  // uses 'body-parser' middleware to get request.body
  var newCity = req.body;
  client.hset('cities', newCity.name, newCity.description, function(err) {
    if (err) {
      throw err;
    }
    res.status(201).json(newCity.name);  
  });  
});

// Deletes a City resource
app.delete('/cities/:name', function(req, res) {
  client.hdel('cities', req.params.name, function(err) {
    if(err) {
      throw err;
    }
    res.sendStatus(204);
  });
});

// ----- END ROUTES -----

// encapsulate app inside of node module, in order to allow app definition and
//  the code that binds the app to the network to exist in different
//  files/modules (this replaces `app.listen(3000);`).
module.exports = app;
