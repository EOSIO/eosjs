const ecc = require('eosjs-ecc')
const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')
const api = require('eosjs-api')

const Structs = require('./structs')
const writeApiGen = require('./write-api')
const assert = require('assert')

const Eos = {}

module.exports = Eos

Eos.modules = {
  json,
  ecc,
  api,
  Fcbuffer
}

// Eos.Mainnet = config => ..

Eos.Testnet = config => {
  const Network = api.Testnet
  const network = Network(Object.assign({}, {debug: false}, config))

  const defaultConfig = {transactionLog: consoleObjCallbackLog}
  config = Object.assign({}, defaultConfig, config, {network})

  return createEos(config, Network)
}

function createEos(config, Network) {
  config = Object.assign({}, config)

  if(!config.chainId) {
    config.chainId = '00'.repeat(32)
  }

  const eos = mergeWriteFunctions(config, Network)

  if(!config.signProvider) {
    config.signProvider = defaultSignProvider(eos, config)
  }

  return eos
}

function consoleObjCallbackLog(error, result) {
  if(error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(result, null, 4))
  }
}

/**
  Merge in write functions (operations).  Tested against existing methods for
  name conflicts.

  @arg {object} config.network - read-only api calls
  @arg {object} Network - api[Network] read-only api calls
  @return {object} - read and write method calls (create and sign transactions)
  @throw {TypeError} if a funciton name conflicts
*/
function mergeWriteFunctions(config, Network) {
  assert(config.network, 'network instance required')

  const {network} = config
  const {structs, types} = Structs(config)
  const merge = Object.assign({}, {fc: {structs, types}})

  throwOnDuplicate(merge, network, 'Conflicting methods in Eos and Network Api')
  Object.assign(merge, network)

  const writeApi = writeApiGen(Network, network, structs, config)
  throwOnDuplicate(merge, writeApi, 'Conflicting methods in Eos and Transaction Api')
  Object.assign(merge, writeApi)

  return merge
}

function throwOnDuplicate(o1, o2, msg) {
  for(const key in o1) {
    if(o2[key]) {
      throw new TypeError(msg + ': ' + key)
    }
  }
}

const defaultSignProvider = (eos, config) => ({sign, buf, transaction}) => {
  let keyProvider = config.keyProvider
  if(typeof keyProvider === 'function') {
    keyProvider = keyProvider({transaction})
  }
  if(keyProvider) {
    return Promise.resolve(keyProvider).then(keys => {
      if(!Array.isArray(keys)) {
        keys = [keys]
      }

      if(!keys.length) {
        throw new Error('missing private key(s), check your keyProvider')
      }

      // Public to private key map -> maps server's required public keys
      // back to signing keys.
      const keyMap = keys.reduce((map, wif) => {
        map[ecc.privateToPublic(wif)] = wif
        return map
      }, {})

      return eos.getRequiredKeys(transaction, Object.keys(keyMap))
      .then(({required_keys}) => {
        if(!required_keys.length) {
          throw new Error('missing required keys ')
        }
        const sigs = []
        for(const key of required_keys) {
          sigs.push(sign(buf, keyMap[key]))
        }
        return sigs
      })
    })
  }
  throw new TypeError('This transaction requires a config.keyProvider for signing')
}
