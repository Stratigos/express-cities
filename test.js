/**
 * Each test represents the addition of some feature to the application,
 *  which was essentially built with test
  driven development.
 */
var request = require('supertest');
var app    = require('./app');
var redis  = require('redis');
var client = redis.createClient();

// `NODE_ENV` set via 'npm test' command in package.json
client.select(process.env.NODE_ENV.length);
client.flushdb();

describe('Requests to Root Path', function() {
  it('Returns a HTTP Status Code: 200', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Returns HTML Format', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/, done);
  });

  it('Returns Index File with Cities', function(done) {
    request(app)
      .get('/')
      .expect(/cities/i, done);
  });
});

describe('Listing Cities on /cities', function() {
  it('Returns a HTTP Status Code: 200', function(done) {
    request(app)
      .get('/cities')
      .expect(200, done);
  });

  it('Returns JSON Format', function(done) {
    request(app)
      .get('/cities')
      .expect('Content-Type', /json/, done);
  });

  it('Returns Initial Cities', function(done) {
    request(app)
      .get('/cities')
      .expect(JSON.stringify([]), done);
  });
});

describe('Creating New Cities', function() {
  it('Returns 201 Status Code', function(done) {
    request(app)
      .post('/cities')
      .send('name=Springfield&description=where+the+simpsons+live')
      .expect(201, done);
  });

  it('Returns City Name', function(done) {
    request(app)
      .post('/cities')
      .send('name=Springfield&description=where+the+simpsons+live')
      .expect(/springfield/i, done);
  });

  it('Validates New City Name and Description', function(done) {
    // first check that invalid data returns 'Bad Request'
    request(app)
      .post('/cities')
      .send('name=&description=')
      .expect(400, done);
  });
});

describe('Deleting Cities', function() {

  // add a city to be deleted.
  before(function() {
    client.hset('cities', 'Bananaville', 'A Town Created from Grafting.');
  });

  it('Returns 204 Status Code', function(done) {
    request(app)
      .delete('/cities/Bananaville')
      .expect(204, done);
  });

  // remove any data created for this test
  after(function() {
    client.flushdb();
  });
});

describe('Shows a City Resource\'s Info', function() {

  before(function() {
    client.hset('cities', 'Derpltuckia', 'A City Filled with Hurp.');
  });

  it('Returns 200 Status Code', function(done) {
    request(app)
      .get('/cities/Derpltuckia')
      .expect(200, done);
  });

  // a simple test to show templates are returning HTML
  // it('Returns HTML Format', function(done) {
    
  // });

  after(function() {
    client.flushdb();
  });
});
