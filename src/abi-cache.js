const assert = require('assert')
const Structs = require('./structs')

module.exports = AbiCache

function AbiCache(network, config) {
  // Help (or "usage") needs {defaults: true}
  config = Object.assign({}, {defaults: true}, config)
  const cache = {}

  /**
    Asynchronously fetch and cache an ABI from the blockchain.

    @arg {string} account - blockchain account with deployed contract
    @arg {boolean} [force = true] false when ABI is immutable.
  */
  function abiAsync(account, force = true) {
    assert.equal(typeof account, 'string', 'account string required')

    if(force == false && cache[account] != null) {
      return Promise.resolve(cache[account])
    }

    if(network == null) {
      const abi = cache[account]
      assert(abi, `Missing ABI for account: ${account}, provide httpEndpoint or add to abiCache`)
      return Promise.resolve(abi)
    }

    return network.getAbi(account).then(code => {
      assert(code.abi, `Missing ABI for account: ${account}`)
      return abi(account, code.abi)

    })
  }

  /**
    Synchronously set or fetch an ABI from local cache.

    @arg {string} account - blockchain account with deployed contract
    @arg {string} [abi] - blockchain ABI json data.  Null to fetch or non-null to cache
  */
  function abi(account, abi) {
    assert.equal(typeof account, 'string', 'account string required')
    if(abi) {
      assert.equal(typeof abi, 'object', 'abi')
      if(Buffer.isBuffer(abi)) {
        abi = JSON.parse(abi)
      }
      const schema = abiToFcSchema(abi)
      const structs = Structs(config, schema) // structs = {structs, types}
      return cache[account] = Object.assign({abi, schema}, structs)
    }
    const c = cache[account]
    if(c == null) {
      throw new Error(`Abi '${account}' is not cached`)
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
      const fields = {}
      for(const field of e.fields) {
        fields[field.name] = field.type
      }
      abiSchema[e.name] = {base: e.base, fields}
      if(e.base === '') {
        delete abiSchema[e.name].base
      }
    })
  }

  return abiSchema
}
