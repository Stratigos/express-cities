var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('OK');
});

app.get('/cities', function(req, res){
  var cities = ['Lotopia', 'Caspiana', 'Indigo'];
  res.json(cities);
});

// encapsulate app inside of node module, in order to allow app definition and
//  the code that binds the app to the network to exist in different
//  files/modules (this replaces `app.listen(3000);`).
module.exports = app;
