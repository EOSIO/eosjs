const ecc = require('eosjs-ecc')
const json = require('eosjs-json')
const Fcbuffer = require('fcbuffer')
const createHash = require('create-hash')

const {Signature} = ecc

/**
  config.network = Testnet() must be supplied until Mainnet is available..

  @arg {object} [config.network = Mainnet()]
*/
module.exports = (config = {}) => {

  const network = config.network //|| Mainnet()

  fcbuffer = Fcbuffer(json.schema.operations)
  if(!fcbuffer.errors.length === 0) {
    throw new Error(fcbuffer.errors)
  }

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

    network.createTransaction(args.expireInSeconds, checkError(callback, tx => {
      tx.messages = args.messages
      tx.permissions = args.permissions

      const {Transaction} = fcbuffer.structs
      const buf = Fcbuffer.toBuffer(Transaction, tx)
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
            callback({
              error,
              digest: buf.toString('hex')
            })
          }
        })
      }
    }))
  }

  // Non "modules" exports should avoid custom objects as much as possible (for
  // example: wif string instead of a ecc.PrivateKey object)

  return {
    transaction,
    modules: {
      ecc,
      json,
      Fcbuffer,
    }
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
    parentErr(error)
  } else {
    parrentRes(result)
  }
}
