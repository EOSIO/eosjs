const schema = Object.assign(
  {},
  require('./chain_types.json'),
  require('./eosio_system.json'),
  require('./eosio_token.json')
)

// change "bytes" to "abi_def"
schema.setabi.fields.abi = 'abi_def'

module.exports = schema
