const ecc = require('eosjs-ecc')
const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')
const createHash = require('create-hash')
const Testnet = require('eosjs-api/testnet')
const api = require('eosjs-api')

const Structs = require('./src/structs')

const {Signature} = ecc

/**
  config.network = Testnet() must be supplied until Mainnet is available..

  @arg {object} [config.network = Mainnet()]
*/
const Eos = (config = {}) => {
  const network = config.network //|| Mainnet()

  const structs = Structs(config)

  /**
    @args {object} args - {
      messages: [{}, ..],
      sign: [wif_string]
      [expireInSeconds = 60],
      [broadcast = true]
    }
  */
  function transaction(args, callback) {
    if(typeof args !== 'object') {
      throw new TypeError('Expecting args object')
    }
    if(typeof callback !== 'function') {
      throw new TypeError('Expecting callback function as last argument')
    }
    if(!Array.isArray(args.messages)) {
      throw new TypeError('Expecting args.messages array')
    }
    if(!Array.isArray(args.sign)) {
      throw new TypeError('Expecting args.sign array')
    }

    const argsDefaults = {expireInSeconds: 60, broadcast: true}
    args = Object.assign(argsDefaults, args)

    network.createTransaction(args.expireInSeconds, checkError(callback, rawTx => {
      rawTx.scope = args.scope
      rawTx.messages = args.messages
      rawTx.authorizations = args.authorizations

      const {Transaction} = structs
      const buf = Fcbuffer.toBuffer(Transaction, rawTx)

      // Broadcast what is signed (instead of rawTx)
      const tx = Fcbuffer.fromBuffer(Transaction, buf)

      tx.signatures = []
      for(const key of args.sign) {
        tx.signatures.push(sign(buf, key))
      }

      if(!args.broadcast) {
        callback(null, tx)
      } else {
        network.pushTransaction(tx, error => {
          if(!error) {
            callback(null, tx)
          } else {
            let sbuf = buf
            try {
              sbuf = Fcbuffer.toBuffer(structs.SignedTransaction, tx)
            } catch(error) {
              console.log(error)
            }
            console.error(`[eosjs] transaction error '${error.message}', digest '${sbuf.toString('hex')}'`)
            callback(error.message)
          }
        })
      }
    }))
  }

  // Non "modules" exports should avoid custom objects as much as possible (for
  // example: wif string instead of a ecc.PrivateKey object)

  return {
    transaction,
    structs
  }
}

/**
  The transaction function signs already.  This is for signing other types
  of data.

  @arg {string|Buffer} data - Never sign anything without 100% validation or
    unless prefixing with a string constant.

  @arg {string|ecc.PrivateKey} key - string must be a valid WIF format

  @return {string} hex signature
*/
function sign(data, key) {
  const privateKey = key.d ? key : ecc.PrivateKey.fromWif(key)
  const h = createHash('sha256').update(data).digest();
  const sig = Signature.signBufferSha256(h, privateKey)
  return sig.toHex()
}

const checkError = (parentErr, parrentRes) => (error, result) => {
  if (error) {
    console.log('error', error)
    parentErr(error)
  } else {
    parrentRes(result)
  }
}

function throwOnDup(o1, o2, msg) {
  for(const key in o1) {
    if(o2[key]) {
      throw new TypeError(msg + ': ' + key)
    }
  }
}

Eos.Testnet = (config = {}) => {
  const testnet = Testnet(config)
  config = Object.assign(config, {network: testnet})
  const eos = Eos(config)
  throwOnDup(eos, testnet, 'Conflicting methods in Eos and Testnet')
  return Object.assign(testnet, eos)
}

Eos.modules = {
  json,
  ecc,
  api,
  Fcbuffer
}

module.exports = Eos
