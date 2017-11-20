const Structs = require('./structs')

module.exports = AbiCache
 
function AbiCache(network, config) {
  const cache = {}

  function abiAsync(code, force = false) {
    if(force == false && cache[code] != null) {
      return Promise.resolve(cache[code])
    }
    return network.getCode(code).then(({abi}) => {
      const schema = abiToFcSchema(abi)
      const structs = Structs(config, schema)
      return cache[code] = Object.assign({abi, schema}, structs)
    })
  }

  function abi(code) {
    const c = cache[code]
    if(c == null) {
      throw new Error(`Abi '${code}' is not cached, call abiAsync('${code}')`)
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
  if(abi.types) {
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
