const ecc = require('eosjs-ecc')
const Fcbuffer = require('fcbuffer')
const EosApi = require('eosjs-api')
const assert = require('assert')

const Structs = require('./structs')
const AbiCache = require('./abi-cache')
const writeApiGen = require('./write-api')
const format = require('./format')
const schema = require('./schema')

const token = require('./schema/eosio.token.abi.json')
const system = require('./schema/eosio.system.abi.json')
const eosio_null = require('./schema/eosio.null.abi.json')

const Eos = (config = {}) => {
  const configDefaults = {
    httpEndpoint: 'http://127.0.0.1:8888',
    debug: false,
    verbose: false,
    broadcast: true,
    logger: {
      log: (...args) => config.verbose ? console.log(...args) : null,
      error: (...args) => config.verbose ? console.error(...args) : null
    },
    sign: true
  }

  function applyDefaults(target, defaults) {
    Object.keys(defaults).forEach(key => {
      if(target[key] === undefined) {
        target[key] = defaults[key]
      }
    })
  }

  applyDefaults(config, configDefaults)
  applyDefaults(config.logger, configDefaults.logger)
  return createEos(config)
}

module.exports = Eos

Object.assign(
  Eos,
  {
    version: '16.0.0',
    modules: {
      format,
      api: EosApi,
      ecc,
      json: {
        api: EosApi.api,
        schema
      },
      Fcbuffer
    },

    /** @deprecated */
    Testnet: function (config) {
      console.error('deprecated, change Eos.Testnet(..) to just Eos(..)')
      return Eos(config)
    },

    /** @deprecated */
    Localnet: function (config) {
      console.error('deprecated, change Eos.Localnet(..) to just Eos(..)')
      return Eos(config)
    }
  }
)

function createEos(config) {
  const network = config.httpEndpoint != null ? EosApi(config) : null
  config.network = network

  const abis = []
  const abiCache = AbiCache(network, config)
  abis.push(abiCache.abi('eosio.null', eosio_null))
  abis.push(abiCache.abi('eosio.token', token))
  abis.push(abiCache.abi('eosio', system))

  if(!config.chainId) {
    config.chainId = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  }

  if(network) {
    checkChainId(network, config.chainId, config.logger)
  }

  if(config.mockTransactions != null) {
    if(typeof config.mockTransactions === 'string') {
      const mock = config.mockTransactions
      config.mockTransactions = () => mock
    }
    assert.equal(typeof config.mockTransactions, 'function', 'config.mockTransactions')
  }
  const {structs, types, fromBuffer, toBuffer} = Structs(config)
  const eos = mergeWriteFunctions(config, EosApi, structs, abis)

  Object.assign(eos, {
    config: safeConfig(config),
    fc: {
      structs,
      types,
      fromBuffer,
      toBuffer,
      abiCache
    },
    // Repeat of static Eos.modules, help apps that use dependency injection
    modules: {
      format
    }
  })

  if(!config.signProvider) {
    config.signProvider = defaultSignProvider(eos, config)
  }

  return eos
}

/**
  Set each property as read-only, read-write, no-access.  This is shallow
  in that it applies only to the root object and does not limit access
  to properties under a given object.
*/
function safeConfig(config) {
  // access control is shallow references only
  const readOnly = new Set(['httpEndpoint', 'abiCache', 'chainId', 'expireInSeconds'])
  const readWrite = new Set(['verbose', 'debug', 'broadcast', 'logger', 'sign'])
  const protectedConfig = {}

  Object.keys(config).forEach(key => {
    Object.defineProperty(protectedConfig, key, {
      set: function(value) {
        if(readWrite.has(key)) {
          config[key] = value
          return
        }
        throw new Error('Access denied')
      },

      get: function() {
        if(readOnly.has(key) || readWrite.has(key)) {
          return config[key]
        }
        throw new Error('Access denied')
      }
    })
  })
  return protectedConfig
}

/**
  Merge in write functions (operations).  Tested against existing methods for
  name conflicts.

  @arg {object} config.network - read-only api calls
  @arg {object} EosApi - api[EosApi] read-only api calls
  @return {object} - read and write method calls (create and sign transactions)
  @throw {TypeError} if a funciton name conflicts
*/
function mergeWriteFunctions(config, EosApi, structs, abis) {
  const {network} = config

  const merge = Object.assign({}, network)

  const writeApi = writeApiGen(EosApi, network, structs, config, abis)
  throwOnDuplicate(merge, writeApi, 'Conflicting methods in EosApi and Transaction Api')
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
const defaultSignProvider = (eos, config) => async function({
  sign, buf, transaction, optionsKeyProvider
}) {
  // optionsKeyProvider is a per-action key: await eos.someAction('user2' .., {keyProvider: privateKey2})
  const keyProvider = optionsKeyProvider ? optionsKeyProvider : config.keyProvider

  if(!keyProvider) {
    throw new TypeError('This transaction requires a keyProvider for signing')
  }

  let keys = keyProvider
  if(typeof keyProvider === 'function') {
    keys = keyProvider({transaction})
  }

  // keyProvider may return keys or Promise<keys>
  keys = await Promise.resolve(keys)

  if(!Array.isArray(keys)) {
    keys = [keys]
  }

  keys = keys.map(key => {
    try {
      // normalize format (WIF => PVT_K1_base58privateKey)
      return {private: ecc.PrivateKey(key).toString()}
    } catch(e) {
      // normalize format (EOSKey => PUB_K1_base58publicKey)
      return {public: ecc.PublicKey(key).toString()}
    }
    assert(false, 'expecting public or private keys from keyProvider')
  })

  if(!keys.length) {
    throw new Error('missing key, check your keyProvider')
  }

  // simplify default signing #17
  if(keys.length === 1 && keys[0].private) {
    const pvt = keys[0].private
    return sign(buf, pvt)
  }

  // offline signing assumes all keys provided need to sign
  if(config.httpEndpoint == null) {
    const sigs = []
    for(const key of keys) {
      sigs.push(sign(buf, key.private))
    }
    return sigs
  }

  const keyMap = new Map()

  // keys are either public or private keys
  for(const key of keys) {
    const isPrivate = key.private != null
    const isPublic = key.public != null

    if(isPrivate) {
      keyMap.set(ecc.privateToPublic(key.private), key.private)
    } else {
      keyMap.set(key.public, null)
    }
  }

  const pubkeys = Array.from(keyMap.keys())

  return eos.getRequiredKeys(transaction, pubkeys).then(({required_keys}) => {
    if(!required_keys.length) {
      throw new Error('missing required keys for ' + JSON.stringify(transaction))
    }

    const pvts = [], missingKeys = []

    for(let requiredKey of required_keys) {
      // normalize (EOSKey.. => PUB_K1_Key..)
      requiredKey = ecc.PublicKey(requiredKey).toString()

      const wif = keyMap.get(requiredKey)
      if(wif) {
        pvts.push(wif)
      } else {
        missingKeys.push(requiredKey)
      }
    }

    if(missingKeys.length !== 0) {
      assert(typeof keyProvider === 'function',
        'keyProvider function is needed for private key lookup')

      // const pubkeys = missingKeys.map(key => ecc.PublicKey(key).toStringLegacy())
      keyProvider({pubkeys: missingKeys})
        .forEach(pvt => { pvts.push(pvt) })
    }

    const sigs = []
    for(const pvt of pvts) {
      sigs.push(sign(buf, pvt))
    }

    return sigs
  })
}

function checkChainId(network, chainId, logger) {
  network.getInfo({}).then(info => {
    if(info.chain_id !== chainId) {
      if(logger.log) {
        logger.log(
          'chainId mismatch, signatures will not match transaction authority. ' +
          `expected ${chainId} !== actual ${info.chain_id}`
        )
      }
    }
  }).catch(error => {
    if(logger.error) {
      logger.error('Warning, unable to validate chainId: ' + error.message)
    }
  })
}
