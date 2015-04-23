/**
 * TODO - DOCUMENTATION
 */
var request = require('supertest');
var app     = require('./app');

describe('Requests to Root Path', function() {
  it('Returns a HTTP Status Code: 200', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(error){
        if(error) {
          throw error;
        }
        done();
    });
  });
});

