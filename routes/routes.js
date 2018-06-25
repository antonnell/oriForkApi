var express = require('express')
var router = express.Router()
var model = require('../models/model.js')
var bodyParser = require('body-parser')

router.get('/', function (req, res, next) {
  res.status(400)
  next(null, req, res, next)
})

//Gets the unclaimed and total balance of the address that is sent in for one of the 5 forked coin types.
router.post('/api/v1/getBalance', bodyParser.json( ), model.getBalance)
//Claim ORI tokens for an address.
router.post('/api/v1/claimTokens', bodyParser.json(), model.claimTokens)

module.exports = router
