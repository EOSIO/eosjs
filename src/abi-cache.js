const assert = require('assert')
const Structs = require('./structs')

module.exports = AbiCache
 
function AbiCache(network, config) {
  // Help (or "usage") needs {defaults: true}
  config = Object.assign({}, {defaults: true}, config)
  const cache = {}

  /**
    @arg {boolean} force false when ABI is immutable.  When force is true, API
    user is still free to cache the contract object returned by eosjs. 
  */
  function abiAsync(account, force = true) {
    assert(account, 'required account')

    if(force == false && cache[account] != null) {
      return Promise.resolve(cache[account])
    }
    return network.getCode(account).then(({abi}) => {
      const schema = abiToFcSchema(abi)
      const structs = Structs(config, schema) // structs = {structs, types}
      return cache[account] = Object.assign({abi, schema}, structs)
    })
  }

  function abi(account) {
    const c = cache[account]
    if(c == null) {
      throw new Error(`Abi '${account}' is not cached, call abiAsync('${account}')`)
    }
    return c
  }

  return {
    abiAsync,
    abi
  }
}


function abiToFcSchema(abi) {
  // customTypes
  // For FcBuffer
  const abiSchema = {}

  // convert abi types to Fcbuffer schema
  if(abi.types) { // aliases
    abi.types.forEach(e => {
      abiSchema[e.new_type_name] = e.type
    })
  }

  if(abi.structs) {
    abi.structs.forEach(e => {
      const {base, fields} = e
      abiSchema[e.name] = {base, fields}
      if(base === '') {
        delete abiSchema[e.name].base
      }
    })
  }

  return abiSchema
}
