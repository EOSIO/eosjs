const assert = require('assert')
const ecc = require('eosjs-ecc')
const Fcbuffer = require('fcbuffer')
const createHash = require('create-hash')
const {processArgs} = require('eosjs-api')
const Structs = require('./structs')

module.exports = writeApiGen

const {sign} = ecc

function writeApiGen(Network, network, structs, config) {

  if(typeof config.chainId !== 'string') {
    throw new TypeError('config.chainId is required')
  }

  const writeApi = WriteApi(Network, network, config, structs.transaction)
  const reserveFunctions = new Set(['transaction', 'contract'])
  const merge = {}

  // sends transactions, also a message collecting wrapper functions 
  merge.transaction = writeApi.genTransaction(structs, merge)

  // Immediate send operations automatically calls merge.transaction
  for(let type in Network.schema) {
    if(!/^[a-z]/.test(type)) {
      // Only lower case structs will work in a transaction message
      // See eosjs-json generated.json
      continue
    }
    if(type === 'transaction') {
      continue // https://github.com/EOSIO/eos/issues/730
    }
    if(reserveFunctions.has(type)) {
      throw new TypeError('Conflicting Api function: ' + type)
    }

    const struct = structs[type]
    const definition = Network.schema[type]
    merge[type] = writeApi.genMethod(type, definition, struct, merge.transaction)
  }

  /**
    Immedate send contract actions.

    @example eos.contract('mycontract', [options], [callback])
    @example eos.contract('mycontract').then(mycontract => mycontract.action(...))
  */
  merge.contract = (...args) => {
    const {params, options, returnPromise, callback} =
      processArgs(args, ['code'], 'contract', optionsFormatter)

    const {code} = params

    // sends transactions via its own transaction function
    writeApi.genContractActions(code)
      .then(r => {callback(null, r)})
      .catch(r => {callback(r)})

    return returnPromise
  }

  return merge
}

function WriteApi(Network, network, config, Transaction) {
  /**
    @arg {array} [args.contracts]
    @arg {callback|object} args.transaction tr => {tr.transfer .. }
    @arg {object} [args.options]
    @arg {function} [args.callback]
  */
  const genTransaction = (structs, merge) => (...args) => {
    let contracts, options, callback

    if(args[args.length - 1] == null) {
      // callback may be undefined
      args = args.slice(0, args.length - 1)
    }

    const isContractArray = isStringArray(args[0])
    if(isContractArray) {
      contracts = args[0]
      args = args.slice(1)
    } else if(typeof args[0] === 'string') {
      contracts = [args[0]]
      args = args.slice(1)
    }

    if(args.length > 1 && typeof args[args.length - 1] === 'function') {
      callback = args.pop()
    }

    if(args.length > 1 && typeof args[args.length - 1] === 'object') {
      options = args.pop()
    }

    assert.equal(args.length, 1, 'transaction args: [contracts], transaction<callback|object>, [options], [callback]')
    const arg = args[0]

    if(contracts) {
      assert(!callback, 'callback with contracts are not supported')
      assert.equal('function', typeof arg, 'provide function callback following contracts array parameter')

      const contractPromises = []
      for(const code of contracts) {
        // setup wrapper functions to collect contract api calls
        contractPromises.push(genContractActions(code, merge.transaction))
      }

      return Promise.all(contractPromises).then(actions => {
        const merges = {}
        actions.forEach((m, i) => {merges[contracts[i]] = m})
        const param = isContractArray ? merges : merges[contracts[0]]
        // collect and invoke api calls
        return trMessageCollector(arg, options, param)
      })
    }

    if(typeof arg === 'function') {
      return trMessageCollector(arg, options, merge)
    }

    if(typeof arg === 'object') {
      return transaction(arg, options, callback)
    }

    throw new Error('first transaction argument unrecognized', arg)
  }

  function genContractActions(code, transaction = null) {
    return config.abiCache.abiAsync(code).then(cache => {
      assert(Array.isArray(cache.abi.actions) && cache.abi.actions.length, 'No actions')

      const contractMerge = {}
      contractMerge.transaction = transaction ? transaction :
        genTransaction(cache.structs, contractMerge)

      cache.abi.actions.forEach(({action_name, type}) => {
        const definition = cache.schema[type]
        const struct = cache.structs[type]
        contractMerge[action_name] = genMethod(type, definition, struct, contractMerge.transaction, code)
      })

      return contractMerge
    })
  }

  function genMethod(type, definition, struct, transactionArg, code = 'eos') {
    return function (...args) {
      if (args.length === 0) {
        console.error(usage(type, definition, Network))
        return
      }

      // Special case like multi-message transactions where this lib needs
      // to be sure the broadcast is off.
      const optionOverrides = {}
      const lastArg = args[args.length - 1]
      if(typeof lastArg === 'object' && typeof lastArg.__optionOverrides === 'object') {
        // pop() fixes the args.length
        Object.assign(optionOverrides, args.pop().__optionOverrides)
      }

      const {params, options, returnPromise, callback} =
        processArgs(args, Object.keys(definition.fields), type, optionsFormatter)

      // internal options (ex: multi-message transaction)
      Object.assign(options, optionOverrides)

      if(optionOverrides.noCallback && !returnPromise) {
        throw new Error('Callback during a transaction are not supported')
      }

      const addDefaultScope = options.scope == null
      const addDefaultAuths = options.authorization == null

      if(typeof options.scope === 'string') {
        options.scope = [options.scope]
      }

      const authorization = []
      if(options.authorization) {
        if(typeof options.authorization === 'string') {
          options.authorization = [options.authorization]
        }
        options.authorization.forEach(auth => {
          if(typeof auth === 'string') {
            const [account, permission = 'active'] = auth.split('@')
            authorization.push({account, permission})
          } else if(typeof auth === 'object') {
            authorization.push(auth)
          }
        })
        assert.equal(authorization.length, options.authorization.length,
          'invalid authorization in: ' + JSON.stringify(options.authorization))
      }

      const tr = {
        scope: options.scope || [],
        messages: [{
          code,
          type,
          data: params,
          authorization
        }]
      }

      if(addDefaultScope || addDefaultAuths) {
        const fields = Object.keys(definition.fields)
        const f1 = fields[0]

        if(definition.fields[f1] === 'account_name') {
          if(addDefaultScope) {
            // Make a simple guess based on ABI conventions.
            tr.scope.push(params[f1])
          }
          if(addDefaultAuths) {
            // Default authorization (since user did not provide one)
            tr.messages[0].authorization.push({
              account: params[f1],
              permission: 'active'
            })
          }
        }

        if(addDefaultScope) {
          if(fields.length > 1 && !/newaccount/.test(type)) {
            const f2 = fields[1]
            if(definition.fields[f2] === 'account_name') {
              tr.scope.push(params[f2])
            }
          }
        }
      }

      tr.scope = tr.scope.sort()
      tr.messages[0].authorization.sort((a, b) =>
        a.account > b.account ? 1 : a.account < b.account ? -1 : 0)

      // multi-message transaction support
      if(!optionOverrides.messageOnly) {
        transactionArg(tr, options, callback)
      } else {
        callback(null, tr)
      }

      return returnPromise
    }
  }

  /**
    Wrap merge.functions adding optionOverrides that will suspend
    transaction broadcast.
  */
  function trMessageCollector(trCallback, options = {}, merges) {
    assert.equal('function', typeof trCallback, 'trCallback')
    assert.equal('object', typeof options, 'options')
    assert.equal('object', typeof merges, 'merges')
    assert(!Array.isArray(merges), 'merges should not be an array')
    assert.equal('function', typeof transaction, 'transaction')

    const scope = {}
    const messageList = []
    const messageCollector = {}

    const wrap = opFunction => (...args) => {
      // call the original function but force-disable a lot of stuff
      const ret = opFunction(...args, {
        __optionOverrides: {
          broadcast: false,
          messageOnly: true,
          noCallback: true
        }
      })      
      if(ret == null) {
        // double-check (code can change)
        throw new Error('Callbacks can not be used when creating a multi-message transaction')
      }
      messageList.push(ret)
    }

    // merges can be an object of functions (as in the main eos contract)
    // or an object of contract names with functions under those
    for(const key in merges) {
      const value = merges[key]
      if(typeof value === 'function') {
        // Native operations (eos contract for example)
        messageCollector[key] = wrap(value)

      } else if(typeof value === 'object') {
        // other contract(s) (currency contract for example)
        if(messageCollector[key] == null) {
          messageCollector[key] = {}
        }
        for(const key2 in value) {
          if(key2 === 'transaction') {
            continue
          }
          messageCollector[key][key2] = wrap(value[key2])
        }
      }
    }

    let promiseCollector
    try {
      // caller will load this up with messages
      promiseCollector = trCallback(messageCollector)
    } catch(error) {
      promiseCollector = Promise.reject(error)
    }

    return Promise.resolve(promiseCollector).then(() =>
      Promise.all(messageList).then(resolvedMessageList => {
        const scopes = new Set()
        const messages = []
        for(let m of resolvedMessageList) {
          const {scope, messages: [message]} = m
          scope.forEach(s => {scopes.add(s)})
          messages.push(message)
        }
        const trObject = {}
        trObject.scope = Array.from(scopes).sort()
        trObject.messages = messages
        return transaction(trObject, options)
      })
    )
  }

  function transaction(arg, options, callback) {
    const optionDefault = {expireInSeconds: 60, broadcast: true, sign: true}
    options = Object.assign({}/*clone*/, optionDefault, options)

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

    if(typeof arg !== 'object') {
      throw new TypeError('First transaction argument should be an object or function')
    }

    if(!Array.isArray(arg.scope)) {
      throw new TypeError('Expecting scope array')
    }
    if(!Array.isArray(arg.messages)) {
      throw new TypeError('Expecting messages array')
    }

    if(config.transactionLog) {
      // wrap the callback with the logger
      const superCallback = callback
      callback = (error, tr) => {
        if(error) {
          config.transactionLog(error)
        } else {
          config.transactionLog(null, tr)
        }
        superCallback(error, tr)
      }
    }

    arg.messages.forEach(message => {
      if(!Array.isArray(message.authorization)) {
        throw new TypeError('Expecting message.authorization array', message)
      }
    })

    if(options.sign && typeof config.signProvider !== 'function') {
      throw new TypeError('Expecting config.signProvider function (disable using {sign: false})')
    }

    network.createTransaction(options.expireInSeconds, checkError(callback, rawTx => {
      rawTx.scope = arg.scope
      rawTx.messages = arg.messages
      // rawTx.read_scope = arg.read_scope || []

      // console.log('rawTx', JSON.stringify(rawTx,null,4))

      // resolve shorthand
      // const txObject = Transaction.toObject(Transaction.fromObject(rawTx))
      const txObject = Transaction.fromObject(rawTx)

      // console.log('txObject', JSON.stringify(txObject,null,4))

      // Broadcast what is signed (instead of rawTx)
      const buf = Fcbuffer.toBuffer(Transaction, txObject)
      const tr = Fcbuffer.fromBuffer(Transaction, buf)

      const transactionId  = createHash('sha256').update(buf).digest().toString('hex')

      let sigs = []
      if(options.sign){
        const chainIdBuf = new Buffer(config.chainId, 'hex')
        const signBuf = Buffer.concat([chainIdBuf, buf])
        sigs = config.signProvider({transaction: tr, buf: signBuf, sign})
        if(!Array.isArray(sigs)) {
          sigs = [sigs]
        }
      }

      // sigs can be strings or Promises
      Promise.all(sigs).then(sigs => {
        sigs = [].concat.apply([], sigs) //flatten arrays in array
        tr.signatures = sigs

        if(!options.broadcast) {
          callback(null, {
            transaction_id: transactionId,
            broadcast: false,
            transaction: tr
          })
        } else {
          network.pushTransaction(tr, error => {
            if(!error) {
              callback(null, {
                transaction_id: transactionId,
                broadcast: true,
                transaction: tr
              })
            } else {
              console.error(`[push_transaction error] '${error.message}', digest '${buf.toString('hex')}'`)
              callback(error.message)
            }
          })
        }
      }).catch(error => {
        console.error(error)
        callback(error)
      })
    }))
    return returnPromise
  }

  // return WriteApi
  return {
    genTransaction,
    genContractActions,
    genMethod
  }
}

const isStringArray = o => Array.isArray(o) && o.length > 0 &&
  o.findIndex(o => typeof o !== 'string') === -1

// Normalize the extra optional options argument
const optionsFormatter = option => {
  if(typeof option === 'object') {
    return option // {debug, broadcast, scope, etc} (scope, etc my overwrite tr below)
  }
  if(typeof option === 'boolean') {
    // broadcast argument as a true false value, back-end cli will use this shorthand
    return {broadcast: option}
  }
}

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

  out(`EXAMPLE STRUCTURE`)
  out(`${JSON.stringify(struct.toObject(), null, 4)}`)

  return usage
}

const checkError = (parentErr, parrentRes) => (error, result) => {
  if (error) {
    console.log('error', error)
    parentErr(error)
  } else {
    parrentRes(result)
  }
}
