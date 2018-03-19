try {
  require("babel-polyfill");
} catch(e) {
  if(e.message.indexOf('only one instance of babel-polyfill is allowed') === -1) {
    console.error(e)
  }
}

const ecc = require('eosjs-ecc')
const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')
const api = require('eosjs-api')

const Structs = require('./structs')
const AbiCache = require('./abi-cache')
const writeApiGen = require('./write-api')
const assert = require('assert')
const format = require('./format')

const pkg = require('../package.json')
const Eos = {
  version: pkg.version
}

module.exports = Eos

Eos.modules = {
  json,
  ecc,
  api,
  Fcbuffer,
  format
}

const configDefaults = {
  broadcast: true,
  debug: false,
  sign: true
}

function development(Network) {
  return (config = {}) => {
    config = Object.assign({}, configDefaults, config)
    const network = Network(Object.assign({}, {
      apiLog: consoleObjCallbackLog(config.verbose)},
      config
    ))
    const eosConfig = Object.assign({}, {
      transactionLog: consoleObjCallbackLog(config.verbose)},
      config
    )
    return createEos(eosConfig, Network, network)
  }
}

Eos.Testnet = development(api.Testnet)
Eos.Localnet = development(api.Localnet)
// Eos.Mainnet = config => ..

function createEos(config, Network, network) {
  const abiCache = AbiCache(network, config)
  config = Object.assign({}, config, {network, abiCache})

  if(!config.chainId) {
    config.chainId = '00'.repeat(32)
  }

  if(config.mockTransactions != null) {
    if(typeof config.mockTransactions === 'string') {
      const mock = config.mockTransactions
      config.mockTransactions = () => mock
    }
    assert.equal(typeof config.mockTransactions, 'function', 'config.mockTransactions')
  }

  const eos = mergeWriteFunctions(config, Network)

  if(!config.signProvider) {
    config.signProvider = defaultSignProvider(eos, config)
  }

  return eos
}

function consoleObjCallbackLog(verbose = false) {
  return (error, result, name) => {
    if(error) {
      if(name) {
        console.error(name, 'error')
      }
      console.error(error);
    } else if(verbose) {
      if(name) {
        console.log(name, 'reply:')
      }
      console.log(JSON.stringify(result, null, 4))
    }
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

/**
  The default sign provider is designed to interact with the available public
  keys (maybe just one), the transaction, and the blockchain to figure out
  the minimum set of signing keys.

  If only one key is available, the blockchain API calls are skipped and that
  key is used to sign the transaction.
*/
const defaultSignProvider = (eos, config) => ({sign, buf, transaction}) => {
  const {keyProvider} = config

  if(!keyProvider) {
    throw new TypeError('This transaction requires a config.keyProvider for signing')
  }

  let keys = keyProvider
  if(typeof keyProvider === 'function') {
    keys = keyProvider({transaction})
  }

  if(!Array.isArray(keys)) {
    keys = [keys]
  }

  if(!keys.length) {
    throw new Error('missing key, check your keyProvider')
  }

  // simplify default signing #17
  if(keys.length === 1 && ecc.isValidPrivate(keys[0])) {
    const wif = keys[0]
    return sign(buf, wif)
  }

  const keyMap = new Map()

  // keys are either public or private keys
  for(const key of keys) {
    const isPrivate = ecc.isValidPrivate(key)
    const isPublic = ecc.isValidPublic(key)

    assert(
      isPrivate || isPublic,
      'expecting public or private keys from keyProvider'
    )

    if(isPrivate) {
      keyMap.set(ecc.privateToPublic(key), key)
    } else {
      keyMap.set(key, null)
    }
  }

  const pubkeys = Array.from(keyMap.keys())

  return eos.getRequiredKeys(transaction, pubkeys).then(({required_keys}) => {
    if(!required_keys.length) {
      throw new Error('missing required keys for ' + JSON.stringify(transaction))
    }

    const wifs = [], missingKeys = []

    for(const requiredKey of required_keys) {
      const wif = keyMap.get(requiredKey)
      if(wif) {
        wifs.push(wif)
      } else {
        missingKeys.push(requiredKey)
      }
    }

    if(missingKeys.length !== 0) {
      assert(typeof keyProvider === 'function',
        'keyProvider function is needed for private key lookup')

      keyProvider({pubkeys: missingKeys})
        .forEach(wif => { wifs.push(wif) })
    }

    const sigs = []
    for(const wif of wifs) {
      sigs.push(sign(buf, wif))
    }

    return sigs
  })
}
