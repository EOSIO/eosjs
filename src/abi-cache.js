const {abiToFcSchema} = require('./format')
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
      return cache[code] = {abi, schema, ...structs}
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
    abi,
    abiAsync
  }
}

