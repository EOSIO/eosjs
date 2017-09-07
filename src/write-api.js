const ecc = require('eosjs-ecc')
const Fcbuffer = require('fcbuffer')
const createHash = require('create-hash')
const {processArgs} = require('eosjs-api')

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

    // Normalize the extra optional options argument
    const optionsFormatter = option => {
      if(typeof option === 'object') {
        return option // {debug, broadcast, scope, etc} (scope, etc my overwrite tx below)
      }
      if(typeof option === 'boolean') {
        // broadcast argument as a true false value, back-end cli will use this shorthand
        return {broadcast: option}
      }
    }

    const {params, options, returnPromise, callback} =
      processArgs(args, Object.keys(definition.fields), type, optionsFormatter)

    const tx = Object.assign({
      messages: [{
        code: 'eos',
        type,
        data: params,
        authorization: []
      }]
    }, options)

    if(!tx.scope) {// FIXME Hack, until an API call is available
      const fields = Object.keys(definition.fields)
      tx.scope = []

      const f1 = fields[0]
      if(definition.fields[f1] === 'AccountName') {
        tx.scope.push(params[f1])
        tx.messages[0].authorization.push({
          account: params[f1],
          permission: 'active'
        })
      }

      if(fields.length > 1 && !/newaccount/.test(type)) {
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
  const {structs} = Structs({defaults: true, network: Network})
  const struct = structs[type]

  if(struct == null) {
    throw TypeError('Unknown type: ' + type)
  }

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

  const argsDefaults = {expireInSeconds: 60, broadcast: true, sign: true}
  args = Object.assign(argsDefaults, args)

  if(args.sign && typeof signProvider !== 'function') {
    throw new TypeError('Expecting signProvider function (disable using {sign: false})')
  }

  network.createTransaction(args.expireInSeconds, checkError(callback, rawTx => {
    rawTx.scope = args.scope
    rawTx.messages = args.messages
    rawTx.readscope = args.readscope || []

    const {Transaction} = structs
    const txObject = Transaction.fromObject(rawTx)// resolve shorthand
    const buf = Fcbuffer.toBuffer(Transaction, txObject)
    // console.log('txObject', JSON.stringify(txObject,null,4))

    // Broadcast what is signed (instead of rawTx)
    const tx = Fcbuffer.fromBuffer(Transaction, buf)

    tx.signatures = []

    if(args.sign) {
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
