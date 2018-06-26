const db = require('../helpers/db.js').db

const model = {

  /**
  * @name coinTypes
  *   The types of coins that can be claimed
  */
  coinTypes: [
    'Bitcoin',
    'BitcoinCash',
    'LiteCoin',
    'Dash',
    'Ethereum'
  ],

  /**
  * @name getBalance
  *   Gets the unclaimed and total balance of the address that is sent in for one of the 5 forked coin types.
  *
  * @param {string} coin_type
  *   The type of coin that is being looked up
  *     Bitcoin
  *     BitcoinCash
  *     Litecoin
  *     Dash
  *     Ethereum
  * @param {string} address
  *   The address that will be looked up
  *
  * @return {float} claimed_balance
  *   The unclaimed balance of the address
  * @return {float} unclaimed_balance
  *   The unclaimed balance of the address
  * @return {float} total_balance
  *   The total balance of the address
  */
  getBalance(req, res, next) {
    //validate incoming parameters
    var validationResult = model.getBalanceValidation(req.body)
    if(validationResult !== true) {
      res.status(400)
      res.body = validationResult
      return next(null, req, res, next)
    }

    //select unclaimed and total balance
    model.selectBalances(req.body.coin_type, req.body.address, (err, balances) => {
      if(err) {
        return model.returnError(req, res, next, err)
      }
      if(balances == null) {
        //return object
        res.status(201)
        res.body = { 'status': 201, 'success': true, 'message': 'Not found' }
        return next(null, req, res, next)
      }

      //return object
      res.status(205)
      res.body = { 'status': 200, 'success': true, 'message': { balances } }
      return next(null, req, res, next)
    })
  },

  getBalanceValidation(body) {
    if(body.coin_type == null) {
      return { 'status': 400, 'success': false, 'message': 'coin_type is required' }
    }
    if(!model.coinTypes.includes(body.coin_type)) {
      return { 'status': 400, 'success': false, 'message': 'coin_type is invalid' }
    }
    if(body.address == null) {
      return { 'status': 400, 'success': false, 'message': 'address is required' }
    }
    if(!model.validateAddress(body.coin_type, body.address)) {
      return { 'status': 400, 'success': false, 'message': 'address is invalid' }
    }

    return true
  },

  validateAddress(coin_type, address) {
    //TODO: implement
    /*
      Bitcoin
      BitcoinCash
      Litecoin
      Dash
      Ethereum
      OriToken (erc20)
    */
    return true
  },

  selectBalances(coinType, address, callback) {
    switch(coinType) {
      case 'Bitcoin':
        db.oneOrNone('select btc.address, coalesce(sum(btc.amount), 0) as total_balance, coalesce(claimed_balance, 0) as claimed_balance, coalesce(sum(btc.amount), 0)-coalesce(claimed_balance, 0) as unclaimed_balance from bitcoin_utxo btc left join (select claim_address, coalesce(sum(claim_amount), 0) as claimed_balance from claimed_tokens where claim_address = $1 group by claim_address) ct on btc.address = ct.claim_address where btc.address = $1 group by btc.address, claimed_balance;',
        [address])
        .then((data) => {
          callback(null, data)
        })
        .catch(callback)
        return
      case 'BitcoinCash':
        db.oneOrNone('select bcc.address, coalesce(sum(bcc.amount), 0) as total_balance, coalesce(claimed_balance, 0) as claimed_balance, coalesce(sum(bcc.amount), 0)-coalesce(claimed_balance, 0) as unclaimed_balance from bitcoin_cash_utxo bcc left join (select claim_address, coalesce(sum(claim_amount), 0) as claimed_balance from claimed_tokens where claim_address = $1 group by claim_address) ct on bcc.address = ct.claim_address where bcc.address = $1 group by bcc.address, claimed_balance;',
        [address])
        .then((data) => {
          callback(null, data)
        })
        .catch(callback)
        return
      case 'LiteCoin':
        db.oneOrNone('select ltc.address, coalesce(sum(ltc.amount), 0) as total_balance, coalesce(claimed_balance, 0) as claimed_balance, coalesce(sum(ltc.amount), 0)-coalesce(claimed_balance, 0) as unclaimed_balance from litecoin_utxo ltc left join (select claim_address, coalesce(sum(claim_amount), 0) as claimed_balance from claimed_tokens where claim_address = $1 group by claim_address) ct on ltc.address = ct.claim_address where ltc.address = $1 group by ltc.address, claimed_balance;',
        [address])
        .then((data) => {
          callback(null, data)
        })
        .catch(callback)
        return
      case 'Dash':
        db.oneOrNone('select dash.address, coalesce(sum(dash.amount), 0) as total_balance, coalesce(claimed_balance, 0) as claimed_balance, coalesce(sum(dash.amount), 0)-coalesce(claimed_balance, 0) as unclaimed_balance from dash_utxo dash left join (select claim_address, coalesce(sum(claim_amount), 0) as claimed_balance from claimed_tokens where claim_address = $1 group by claim_address) ct on dash.address = ct.claim_address where dash.address = $1 group by dash.address, claimed_balance;',
        [address])
        .then((data) => {
          callback(null, data)
        })
        .catch(callback)
        return
      case 'Ethereum':
        //TODO: implement
        callback('Not implemented')
        return
      default:
        callback('coinType not supported')
        return
    }

  },

  /**
  * @name claimTokens
  *   Claim ORI tokens for an address.
  *
  * @param {string} coin_type
  *   The type of coin that is being looked up
  *     Bitcoin
  *     BitcoinCash
  *     Litecoin
  *     Dash
  *     Ethereum
  * @param {string} address
  *   The address that will be looked up
  * @param {string} amount
  *   The amount of {coin_type} that the person wants to claim for
  * @param {string} ori_address
  *   The address that the ORI tokens will be depositted into
  *
  * @return {float} ori_tokens
  *   The number of ORI tokens claimed
  */
  claimTokens(req, res, next) {
    //validate incoming parameters
    var validationResult = model.claimTokensValidation(req.body)
    if(validationResult !== true) {
      res.status(validationResult.status)
      res.body = validationResult
      return next(null, req, res, next)
    }

    //select unclaimed total
    model.selectBalances(req.body.coin_type, req.body.address, (err, balances) => {
      if(err) {
        return model.returnError(req, res, next, err)
      }

      if(balances == null) {
        res.status(201)
        res.body = { 'status': 201, 'success': true, 'message': 'Not found' }
        return next(null, req, res, next)
      }

      if(balances.unclaimed_balance <= req.body.amount) {
        res.status(400)
        res.body = { 'status': 400, 'success': false, 'message': 'claim amount exceeds available balance' }
        return next(null, req, res, next)
      }

      //calculate how many ORI tokens to pay out
      var claimAmount = model.calculateClaimAmount(req.body.amount)

      //insert claim
      model.insertClaimedTokens(req.body, claimAmount, (err) => {
        console.log('inserted', err)
        if(err) {
          return model.returnError(req, res, next, err)
        }

        //return object
        res.status(205)
        res.body = { 'status': 200, 'success': true, 'message': { ori_tokens: claimAmount } }
        return next(null, req, res, next)
      })
    })
  },

  claimTokensValidation(body) {
    if(body.coin_type == null) {
      return { 'status': 400, 'success': false, 'message': 'coin_type is required' }
    }
    if(!model.coinTypes.includes(body.coin_type)) {
      return { 'status': 400, 'success': false, 'message': 'coin_type is invalid' }
    }
    if(body.address == null) {
      return { 'status': 400, 'success': false, 'message': 'address is required' }
    }
    if(!model.validateAddress(body.coin_type, body.address)) {
      return { 'status': 400, 'success': false, 'message': 'address is invalid' }
    }
    if(body.amount == null) {
      return { 'status': 400, 'success': false, 'message': 'amount is required' }
    }
    if(!(!isNaN(parseFloat(body.amount)) && isFinite(body.amount)) || body.amount <= 0) {
      return { 'status': 400, 'success': false, 'message': 'amount is invalid' }
    }
    if(body.ori_address == null) {
      return { 'status': 400, 'success': false, 'message': 'amount is required' }
    }
    if(!model.validateAddress('ORI', body.ori_address)) {
      return { 'status': 400, 'success': false, 'message': 'address is invalid' }
    }

    return true
  },

  calculateClaimAmount(amount) {
    //TODO: get the ration of bitcoin to Ethereum/Litecoin/Bitcoin-Cash/Dash to ORI tokens. Use that to calculate how many ORI tokkens to pay out.
    return amount
  },

  insertClaimedTokens(body, claimAmount, callback) {
    db.none('insert into claimed_tokens (uuid, coin_address, coin_type, coin_amount, claim_address, claim_amount, created) values (md5(random()::text || clock_timestamp()::text)::uuid, $1, $2, $3, $4, $5, now());',  [body.address, body.coin_type, body.amount, body.ori_address, claimAmount])
    .then(callback)
    .catch(callback)
  },

  returnError(req, res, next, err) {
    res.status(501)
    res.body = { 'status': 501, 'success': false, 'message': err }
    return next(null, req, res, next)
  }
}

module.exports = model
