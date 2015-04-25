/**
 * Routes module. Defines routes for Cities application.
 * Routes are defined relative to '/', thus any paths to these routes
 *  will be defined within app.js via middleware call, i.e.,
 *  `app.use('/cities', require('./routes/cities'))`
 */

 var express = require('express');
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
   var client = redis.createClient(rtg.port, rtg.hostname);

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

// instantiate Router object, and define application routes.
var router = express.Router();

router.route('/')
  // displays current cities
  .get(function(req, res) {
    client.hkeys('cities', function(err, citynames) {
      if (err) {
        throw err;
      }
      res.json(citynames);
    });
  })
  // POST requests to /cities are url-encoded via the `body-parser.urlencoded`
  //  middleware. `urlEncode` recieves the request, and creates the
  //  request.body property, from which POST params can be extracted.
  // Note that the route is relative to the scope of the
  //  `router.route('/cities')` route (thus, POST '/' implies POST '/cities')
  //  in this context.
  .post(urlEncode, function(req, res) {
    // uses 'body-parser' middleware to get request.body
    var newCity = req.body;

    // validation
    if(!newCity.name || !newCity.description) {
      res.sendStatus(400);
    }

    client.hset('cities', newCity.name, newCity.description, function(err) {
      if (err) {
        throw err;
      }
      res.status(201).json(newCity.name);  
    });  
  });

router.route('/:name')
  // Show a City
  .get(function(req, res) {
    client.hget('cities', req.params.name, function(err, cityDescription) {
      // EJS (Embedded Javascript Templates) looks for templates in the `views/`
      //  dir by default. The second arg for render() is an object which stores
      //  template data.
      res.render(
        'show.ejs',
        {
          city: {
            name:        req.params.name,
            description: cityDescription
          }
        }
      );
    });
  })
  // Deletes a City resource
  .delete(function(req, res) {
    client.hdel('cities', req.params.name, function(err) {
      if(err) {
        throw err;
      }
      res.sendStatus(204);
    });
  });

// Encapsulates routes into module
module.exports = router;