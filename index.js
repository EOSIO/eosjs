const ecc = require('eosjs-ecc')
const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')

const Testnet = require('eosjs-api/testnet')
const api = require('eosjs-api')

const Structs = require('./src/structs')
const writeApiGen = require('./src/write-api')

/**
  config.network = Testnet() must be supplied until Mainnet is available..

  @arg {object} [config.network = Mainnet()]
*/
const Eos = (config = {}) => {
  const network = config.network //|| Mainnet()

  const {structs, types} = Structs(config)
  return {structs, types}
}

module.exports = Eos

Eos.Testnet = config => createEos(config, Testnet)
// Eos.Mainnet = config => createEos(config, Mainnet(config))

Eos.modules = {
  json,
  ecc,
  api,
  Fcbuffer
}

function createEos(config = {}, Network) {
  config = Object.assign({}, config)

  if(!config.chainId) {
    config.chainId = '00'.repeat(32)
  }

  const eos = mergeWriteFunctions(config, Network)

  let signProvider = config.signProvider
  if(!signProvider) {
    config.signProvider = defaultSignProvider(eos, config)
  }

  return eos
}

/**
  @arg {object} network - all read-only api calls
  @return {object} - read-only api calls and write method calls (create and sign transactions)
  @throw {TypeError} if a funciton name conflicts
*/
function mergeWriteFunctions(config, Network) {
  const network = Network(config)
  Object.assign(config, {network})

  const eos = Eos(config)
  let merge = Object.assign({}, eos)
  
  throwOnDuplicate(merge, network, 'Conflicting methods in Eos and Network Api')
  merge = Object.assign(merge, network)

  const writeApi = writeApiGen(Network, network, eos.structs, config)
  throwOnDuplicate(merge, writeApi, 'Conflicting methods in Eos and Transaction Api')
  merge = Object.assign(merge, writeApi)

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
