const request = require('supertest')
const assert = require('assert')
const app = require('../api.fork.ori.js')

describe('POST /api/v1/claimTokens', function(){
  it('should return an error, 401 Unauthorised', function(done) {
    request(app)
    .post('/api/v1/claimTokens')
    .expect(401)
    .end(done)
  })
  it('should return an error, 400 address is required', function(done) {
    request(app)
    .post('/api/v1/claimTokens')
    .set({ 'Authorization': 'Basic NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5', Accept: 'application/json' })
    .expect(400)
    .end(done)
  })
  it('should return an error, 400 coin_type is invalid', function(done) {
    request(app)
    .post('/api/v1/claimTokens')
    .set({ 'Authorization': 'Basic NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5', Accept: 'application/json' })
    .send({
      address: '1',
      coin_type: '1',
      ori_address: '1',
      amount: 1
    })
    .expect(400)
    .expect(function(res) {
      assert.ok(res.body.message = 'coin_type is invalid')
    })
    .end(done)
  })
  it('should return an error, 400 claim amount exceeds available balance', function(done) {
    request(app)
    .post('/api/v1/claimTokens')
    .set({ 'Authorization': 'Basic NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5', Accept: 'application/json' })
    .send({
      address: '1LZzSCqtMSJXZawnYheKgwbXtS42XDw7DN',
      coin_type: 'Bitcoin',
      ori_address: '0x0',
      amount: 1000000000000000000000000
    })
    .expect(400)
    .expect(function(res) {
      assert.ok(res.body.message = 'claim amount exceeds available balance')
    })
    .end(done)
  })
  it('should return success, 200', function(done) {
    request(app)
    .post('/api/v1/claimTokens')
    .set({ 'Authorization': 'Basic NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5', Accept: 'application/json' })
    .send({
      address: '1LZzSCqtMSJXZawnYheKgwbXtS42XDw7DN',
      coin_type: 'Bitcoin',
      ori_address: '0x0',
      amount: 10000000
    })
    .expect(200)
    .expect(function(res) {
      assert.ok(res.body.message.ori_tokens >= 0)
    })
    .end(done)
  })
})
