const request = require('supertest')
const assert = require('assert')
const app = require('../api.fork.ori.js')

describe('POST /api/v1/getBalance', function(){
  it('should return an error, 401 Unauthorised', function(done) {
    request(app)
    .post('/api/v1/getBalance')
    .expect(401)
    .end(done)
  })
  it('should return an error, 400 address is required', function(done) {
    request(app)
    .post('/api/v1/getBalance')
    .set({ 'Authorization': 'Basic NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5', Accept: 'application/json' })
    .expect(400)
    .end(done)
  })
  it('should return an error, 400 coin_type is invalid', function(done) {
    request(app)
    .post('/api/v1/getBalance')
    .set({ 'Authorization': 'Basic NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5', Accept: 'application/json' })
    .send({
      address: '1',
      coin_type: '1'
    })
    .expect(400)
    .end(done)
  })
  it('should return success, with 201 Not found', function(done) {
    request(app)
    .post('/api/v1/getBalance')
    .set({ 'Authorization': 'Basic NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5', Accept: 'application/json' })
    .send({
      "address": "0X0",
      "coin_type": "Bitcoin"
    })
    .expect(201)
    .end(done)
  })
  /* Fails until we have data in the DB
  it('should return success, with 200', function(done) {
    request(app)
    .post('/api/v1/getBalance')
    .set({ 'Authorization': 'Basic NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5', Accept: 'application/json' })
    .send({
      "address": "0",
      "coin_type": "Bitcoin"
    })
    .expect(200)
    .expect(function(res) {
      assert(res.body.message.balances != null)
      assert.equal(res.body.message.balances.total_balance, 0)
    })
    .end(done)
  })*/
})
