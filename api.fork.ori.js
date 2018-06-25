const express = require('express')
const compression = require('compression')
const routes  = require('./routes/routes')
const morgan = require('morgan')
const helmet = require('helmet')
const https = require('https')
const auth = require('http-auth')

var basic = auth.basic({ realm: 'api.fork.ori' }, function (username, password, callback) {
/*  NzFGQjM2MzFERjhDQkUwNkQ3RDQ1Qjc4QjQxOTlERTdFN0ZDQkVFMTY5REExQzcwQkQwRDUxNTUxMUMyMUE5NjpDRUZCQUUwQzM1MUE4QkY0OEM5OUFBMUU0NTYwNzQ3MkNGMUEzQ0VGQkJEMDI0RDk2RDE5Q0JDMUE4RjYxNTM5 */
  callback(username === '71FB3631DF8CBE06D7D45B78B4199DE7E7FCBEE169DA1C70BD0D515511C21A96' && password === 'CEFBAE0C351A8BF48C99AA1E45607472CF1A3CEFBBD024D96D19CBC1A8F61539')
})

var app = express()


app.all('/*', function(req, res, next) {
  // CORS headers
  res.set('Content-Type', 'application/json')
  res.header('Access-Control-Allow-Origin', '*')// restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS')
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization,Username,Password,Signature,X-Access-Token,X-Key')
  if (req.method == 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

app.use(morgan('dev'))

app.use(auth.connect(basic))
app.use(helmet())
app.use(compression())

app.use('/', routes)

function handleData(req, res) {
  if (res.statusCode === 205) {
    if (res.body) {
      if (res.body.length === 0) {
        res.status(204)
        res.json({
          'status': 204,
          'message': 'No Content'
        })
      } else {
        res.status(200)
        res.json(res.body)
      }
    } else {
      res.status(204)
      res.json({
        'status': 204,
        'message': 'No Content'
      })
    }
  } else if (res.statusCode === 400) {
    res.status(res.statusCode)
    res.json(res.body)
  } else if (res.statusCode === 401) {
    res.status(res.statusCode)
    res.json(res.body)
  } else if (res.statusCode) {
    res.status(res.statusCode)
    res.json(res.body)
  } else {
    res.status(200)
    res.json(res.body)
  }
}
app.use(handleData)
app.use(function(err, req, res) {
  if (err) {
    if (res.statusCode == 500) {
      res.status(250)
      res.json({
        'status': 250,
        'message': err
      })
    } else if (res.statusCode == 501) {
      res.status(250)
      res.json({
        'status': 250,
        'message': err
      })
    } else {
      res.status(500)
      res.json({
        'status': 500,
        'message': err.message
      })
    }
  } else {
    res.status(404)
    res.json({
      'status': 404,
      'message': 'Request not found'
    })
  }
})

//var options = {}
https.globalAgent.maxSockets = 50
app.set('port', 8081)
var server = null
server = require('http').Server(app)
server.listen(app.get('port'), function () {
  console.log('api.fork.ori',server.address().port)
})
module.exports = server
