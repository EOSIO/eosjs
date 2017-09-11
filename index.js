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

Eos.Testnet = config => mergeWriteFunctions(config, Testnet)
// Eos.Mainnet = config => mergeWriteFunctions(config, Mainnet(config))

Eos.modules = {
  json,
  ecc,
  api,
  Fcbuffer
}


function throwOnDuplicate(o1, o2, msg) {
  for(const key in o1) {
    if(o2[key]) {
      throw new TypeError(msg + ': ' + key)
    }
  }
}

/**
  @arg {object} network - all read-only api calls
  @return {object} - read-only api calls and write method calls (create and sign transactions)
  @throw {TypeError} if a funciton name conflicts
*/
function mergeWriteFunctions(config = {}, Network) {
  config = Object.assign({}, config)

  if(!config.chainId) {
    config.chainId = '00'.repeat(32)
  }

  const signProvider = config.signProvider ? config.signProvider : ({sign, buf}) => {
    if(!config.privateKey) {
      throw new TypeError('This transaction requires signing.  Provide a config.privateKey string (wif) or config.signProvider function')
    }
    return sign(buf, config.privateKey)
  }
  delete config.signProvider

  const network = Network(config)
  config = Object.assign(config, {network})

  const eos = Eos(config)
  let merge = Object.assign({}, eos)

  throwOnDuplicate(merge, network, 'Conflicting methods in Eos and Network Api')
  merge = Object.assign(merge, network)

  const writeApi = writeApiGen(Network, network, eos.structs, signProvider, config.chainId)
  throwOnDuplicate(merge, writeApi, 'Conflicting methods in Eos and Transaction Api')
  merge = Object.assign(merge, writeApi)

  return merge
}
