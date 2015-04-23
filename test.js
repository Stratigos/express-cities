/**
 * TODO - DOCUMENTATION
 */
var request = require('supertest');
var app     = require('./app');

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
      .expect(JSON.stringify(['Lotopia', 'Caspiana', 'Indigo']), done);
  });
});