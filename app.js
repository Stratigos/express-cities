var express = require('express');
var app = express();

app.get('/', function(reqiest, response) {
  response.send('OK');
});

// encapsulate app inside of node module, in order to allow app definition and
//  the code that binds the app to the network to exist in different
//  files/modules (this replaces `app.listen(3000);`).
module.exports = app;
