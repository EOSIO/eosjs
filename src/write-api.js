const ecc = require('eosjs-ecc')
const Fcbuffer = require('fcbuffer')
const createHash = require('create-hash')

module.exports = writeApiGen

const {Signature} = ecc

function writeApiGen(Network, network, structs, signProvider) {

  let merge = {}

  merge.transaction = (args, callback) =>
    transaction(args, network, structs, signProvider, callback)

  for(let type in Network.schema) {
    if(!/^[a-z]/.test(type)) {
      // Only lower case structs will work in a transaction message
      // See eosjs-json generated.json
      continue
    }

    if(type === 'transaction') {
      new TypeError('Conflicting Api function: transaction')
    }

    const struct = structs[type]
    const definition = Network.schema[type]
    merge[type] = genMethod(type, definition, struct, merge.transaction, Network)
  }

  return merge
}

function genMethod(type, definition, struct, transactionArg, Network) {
  return function (...args) {
    if (args.length === 0) {
      console.error(usage(type, definition, Network))
      return
    }

    const {returnPromise, callParams, callback} = processArgs(args)
    const params = genParams(callParams, definition.fields, type)

    const tx = {
      scope: [],
      messages: [{
        code: 'eos',
        type,
        data: params,
        authorization: []
      }],
      broadcast: params.broadcast != null ? params.broadcast : true
    }

    {// FIXME Hack, until an API call is available
      const fields = Object.keys(definition.fields)

      const f1 = fields[0]
      if(definition.fields[f1] === 'AccountName') {
        tx.scope.push(params[f1])
        tx.messages[0].authorization.push({
          account: params[f1],
          permission: 'active'
        })
      }

      if(fields.length > 1) {
        const f2 = fields[1]
        if(definition.fields[f2] === 'AccountName') {
          tx.scope.push(params[f2])
        }
      }
    }

    transactionArg(tx, callback)
    return returnPromise
  }
}
const Structs = require('./structs')

function usage (type, definition, Network) {
  const structs = Structs({defaults: true, network: Network})
  const struct = structs[type]

  let usage = ''
  const out = (str = '') => {
    usage += str + '\n'
  }
  out(`${type}`)
  out()

  out(`USAGE`)
  out(`${JSON.stringify(definition, null, 4)}`)
  out()

  out(`EXAMPLE`)
  out(`${JSON.stringify(struct.toObject(), null, 4)}`)

  return usage
}

function processArgs(args) {
  let returnPromise
  let callParams = args.slice(0, args.length - 1)
  let callback = args[args.length - 1]
  if (typeof callback !== 'function') {
    returnPromise = new Promise((resolve, reject) => {
      callback = function(err, result) {
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    })
    callParams = args
  } else {
    callParams = args.slice(0, args.length - 1)
  }
  return {returnPromise, callParams, callback}
}

function genParams (callParams, defParams, methodName) {
  let apiParams
  // Parameteters can be: object by name or a positional array
  if (callParams.length === 1 && typeof callParams[0] === 'object') {
    apiParams = callParams[0]
  } else {
    // positional array
    const defLen = defParams ? Object.keys(defParams).length : 0
    apiParams = {}
    if (callParams.length > defLen) {
      // console.log('typeof defParams[defLen]', callParams)
      if(callParams.length === defLen + 1 && typeof callParams[defLen] === 'boolean') {
        apiParams.broadcast = callParams[defLen]
      } else {
        throw new TypeError(`${methodName} is expecting ${defLen === 0 ? 'no' : defLen} parameters but ${callParams.length} where provided`)
      }
    }

    if (defParams) {
      let pos = 0
      for (const defParam in defParams) {
        if (callParams.length === pos) {
          break
        }
        apiParams[defParam] = callParams[pos]
        pos++
      }
    }
  }
  return apiParams
}

/**
  @args {object} args - {
    scope: [],
    messages: [{}, ..],
    sign: [wif_string],
    [expireInSeconds = 60],
    [broadcast = true]
  }
*/
function transaction(args, network, structs, signProvider, callback) {
  if(typeof args !== 'object') {
    throw new TypeError('Expecting args object')
  }

  let returnPromise
  if(typeof callback !== 'function') {
    returnPromise = new Promise((resolve, reject) => {
      callback = (err, result) => {
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    })
  }

  if(!Array.isArray(args.scope)) {
    throw new TypeError('Expecting args.scope array')
  }
  if(!Array.isArray(args.messages)) {
    throw new TypeError('Expecting args.messages array')
  }

  args.messages.forEach(message => {
    if(!Array.isArray(message.authorization)) {
      throw new TypeError('Expecting message.authorization array in ' + message)
    }
  })

  if(typeof signProvider !== 'function') {
    throw new TypeError('Expecting signProvider function')
  }

  const argsDefaults = {expireInSeconds: 60, broadcast: true}
  args = Object.assign(argsDefaults, args)

  network.createTransaction(args.expireInSeconds, checkError(callback, rawTx => {
    rawTx.scope = args.scope
    rawTx.messages = args.messages
    rawTx.authorization = args.authorization

    const {Transaction} = structs
    const buf = Fcbuffer.toBuffer(Transaction, rawTx)

    // Broadcast what is signed (instead of rawTx)
    const tx = Fcbuffer.fromBuffer(Transaction, buf)

    tx.signatures = []

    for(const message of args.messages) {
      for(const authorization of message.authorization) {
        const sig = signProvider({authorization, tx, message, buf, sign})
        if(typeof sig !== 'string' &&
          (typeof sig !== 'object' || typeof sig.then !== 'function')
        ) {
          throw new Error('signProvider should return a Promise or signature hex')
        }
        tx.signatures.push(sig)
      }
    }

    // tx.signatures can be just strings or Promises
    Promise.all(tx.signatures).then(sigs => {
      tx.signatures = sigs
      if(!args.broadcast) {
        callback(null, tx)
      } else {
        network.pushTransaction(tx, error => {
          if(!error) {
            callback(null, tx)
          } else {
            let sbuf = buf
            // try {
            //   // FIXME - Error: Required UInt64 transfer.amount Message.data Transaction.messages
            //   sbuf = Fcbuffer.toBuffer(structs.SignedTransaction, tx)
            // } catch(error) {
            //   console.log(error)
            // }
            console.error(`[eosjs] transaction error '${error.message}', digest '${sbuf.toString('hex')}'`)
            callback(error.message)
          }
        })
      }
    }).catch(error => {callback(error)})
  }))
  return returnPromise
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
