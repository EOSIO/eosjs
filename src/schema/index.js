const chainTypes = require('./chain_types.json')
const eosio = require('./eosio_token.json')

module.exports = Object.assign({}, chainTypes, eosio)
