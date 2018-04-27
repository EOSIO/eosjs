const chainTypes = require('./chain_types.json')
const eosio = require('./eosio_system.json')

module.exports = Object.assign({}, chainTypes, eosio)
