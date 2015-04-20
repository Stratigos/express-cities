var express = require('express');
var app = express();

app.get('/', function(reqiest, response) {
  response.send('OK');
});

app.listen(3000);