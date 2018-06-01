const assert = require('assert')
const ecc = require('eosjs-ecc')
const Fcbuffer = require('fcbuffer')
const createHash = require('create-hash')
const {processArgs} = require('eosjs-api')
const Structs = require('./structs')
const AssetCache = require('./asset-cache')

module.exports = writeApiGen

const {sign} = ecc

function writeApiGen(Network, network, structs, config, schemaDef) {
  if(typeof config.chainId !== 'string') {
    throw new TypeError('config.chainId is required')
  }

  const writeApi = WriteApi(Network, network, config, structs.transaction)
  const reserveFunctions = new Set(['transaction', 'contract'])
  const merge = {}

  // sends transactions, also a action collecting wrapper functions
  merge.transaction = writeApi.genTransaction(structs, merge)

  // Immediate send operations automatically calls merge.transaction
  for(let type in schemaDef) {
    const schema = schemaDef[type]
    if(schema.action == null) {
      continue
    }
    const actionName = schema.action.name
    if(reserveFunctions.has(actionName)) {
      throw new TypeError('Conflicting Api function: ' + type)
    }

    const struct = structs[type]
    if(struct == null) {
      continue
    }
    const definition = schemaFields(schemaDef, type)
    merge[actionName] = writeApi.genMethod(type, definition, merge.transaction, schema.action.account)
  }

  /**
    Immedate send contract actions.

    @example eos.contract('mycontract', [options], [callback])
    @example eos.contract('mycontract').then(mycontract => mycontract.action(...))
  */
  merge.contract = (...args) => {
    const {params, options, returnPromise, callback} =
      processArgs(args, ['account'], 'contract', optionsFormatter)

    const {account} = params

    // sends transactions via its own transaction function
    writeApi.genContractActions(account)
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
  const genTransaction = (structs, merge) => async function(...args) {
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
    } else if(typeof args[0] === 'object' && typeof Array.isArray(args[0].actions)) {
      // full transaction, lookup ABIs used by each action
      const accounts = new Set() // make a unique list
      for(const action of args[0].actions) {
        accounts.add(action.account)
      }

      const abiPromises = []
      // Eos contract operations are cached (efficient and offline transactions)
      const cachedCode = new Set(['eosio', 'eosio.token'])
      accounts.forEach(account => {
        if(!cachedCode.has(account)) {
          abiPromises.push(config.abiCache.abiAsync(account))
        }
      })
      await Promise.all(abiPromises)
    }

    if(args.length > 1 && typeof args[args.length - 1] === 'function') {
      callback = args.pop()
    }

    if(args.length > 1 && typeof args[args.length - 1] === 'object') {
      options = args.pop()
    }

    assert.equal(args.length, 1, 'transaction args: contracts<string|array>, transaction<callback|object>, [options], [callback]')
    const arg = args[0]

    if(contracts) {
      assert(!callback, 'callback with contracts are not supported')
      assert.equal('function', typeof arg, 'provide function callback following contracts array parameter')

      const contractPromises = []
      for(const account of contracts) {
        // setup wrapper functions to collect contract api calls
        contractPromises.push(genContractActions(account, merge.transaction))
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

  function genContractActions(account, transaction = null) {
    return config.abiCache.abiAsync(account).then(cache => {
      assert(Array.isArray(cache.abi.actions) && cache.abi.actions.length, 'No actions')

      const contractMerge = {}
      contractMerge.transaction = transaction ? transaction :
        genTransaction(cache.structs, contractMerge)

      cache.abi.actions.forEach(({name, type}) => {
        const definition = schemaFields(cache.schema, type)
        contractMerge[name] = genMethod(type, definition, contractMerge.transaction, account, name)
      })

      contractMerge.fc = cache

      return contractMerge
    })
  }

  function genMethod(type, definition, transactionArg, account = 'eosio.token', name = type) {
    return function (...args) {
      if (args.length === 0) {
        console.error(usage(type, definition, Network, account, config))
        return
      }

      // Special case like multi-action transactions where this lib needs
      // to be sure the broadcast is off.
      const optionOverrides = {}
      const lastArg = args[args.length - 1]
      if(typeof lastArg === 'object' && typeof lastArg.__optionOverrides === 'object') {
        // pop() fixes the args.length
        Object.assign(optionOverrides, args.pop().__optionOverrides)
      }

      const processedArgs = processArgs(args, Object.keys(definition), type, optionsFormatter)

      let {options} = processedArgs
      const {params, returnPromise, callback} = processedArgs

      const optionDefaults = { // From config and configDefaults
        broadcast: config.broadcast,
        sign: config.sign
      }

      // internal options (ex: multi-action transaction)
      options = Object.assign({}, optionDefaults, options, optionOverrides)
      if(optionOverrides.noCallback && !returnPromise) {
        throw new Error('Callback during a transaction are not supported')
      }

      const addDefaultAuths = options.authorization == null

      const authorization = []
      if(options.authorization) {
        if(typeof options.authorization === 'string') {
          options.authorization = [options.authorization]
        }
        options.authorization.forEach(auth => {
          if(typeof auth === 'string') {
            const [actor, permission = 'active'] = auth.split('@')
            authorization.push({actor, permission})
          } else if(typeof auth === 'object') {
            authorization.push(auth)
          }
        })
        assert.equal(authorization.length, options.authorization.length,
          'invalid authorization in: ' + JSON.stringify(options.authorization))
      }

      const tr = {
        actions: [{
          account,
          name,
          authorization,
          data: params
        }]
      }

      if(addDefaultAuths) {
        const fieldKeys = Object.keys(definition)
        const f1 = fieldKeys[0]

        if(definition[f1] === 'account_name') {
          // Default authorization (since user did not provide one)
          tr.actions[0].authorization.push({
            actor: params[f1],
            permission: 'active'
          })
        }
      }

      tr.actions[0].authorization.sort((a, b) =>
        a.actor > b.actor ? 1 : a.actor < b.actor ? -1 : 0)

      // multi-action transaction support
      if(!optionOverrides.messageOnly) {
        transactionArg(tr, options, callback)
      } else {
        callback(null, tr)
      }

      return returnPromise
    }
  }

  /**
    Transaction Message Collector

    Wrap merge.functions adding optionOverrides that will suspend
    transaction broadcast.
  */
  function trMessageCollector(trCallback, options = {}, merges) {
    assert.equal('function', typeof trCallback, 'trCallback')
    assert.equal('object', typeof options, 'options')
    assert.equal('object', typeof merges, 'merges')
    assert(!Array.isArray(merges), 'merges should not be an array')
    assert.equal('function', typeof transaction, 'transaction')

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
        throw new Error('Callbacks can not be used when creating a multi-action transaction')
      }
      messageList.push(ret)
    }

    // merges can be an object of functions (as in the main eos contract)
    // or an object of contract names with functions under those
    for(const key in merges) {
      const value = merges[key]
      const variableName = key.replace(/\./, '_')
      if(typeof value === 'function') {
        // Native operations (eos contract for example)
        messageCollector[variableName] = wrap(value)

      } else if(typeof value === 'object') {
        // other contract(s) (currency contract for example)
        if(messageCollector[variableName] == null) {
          messageCollector[variableName] = {}
        }
        for(const key2 in value) {
          if(key2 === 'transaction') {
            continue
          }
          messageCollector[variableName][key2] = wrap(value[key2])
        }
      }
    }

    let promiseCollector
    try {
      // caller will load this up with actions
      promiseCollector = trCallback(messageCollector)
    } catch(error) {
      promiseCollector = Promise.reject(error)
    }

    return Promise.resolve(promiseCollector).then(() =>
      Promise.all(messageList).then(resolvedMessageList => {
        const actions = []
        for(let m of resolvedMessageList) {
          const {actions: [action]} = m
          actions.push(action)
        }
        const trObject = {}
        trObject.actions = actions
        return transaction(trObject, options)
      })
    )
  }

  function transaction(arg, options, callback) {
    const defaultExpiration = config.expireInSeconds ? config.expireInSeconds : 60
    const optionDefault = {expireInSeconds: defaultExpiration, broadcast: true, sign: true}
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

    if(!Array.isArray(arg.actions)) {
      throw new TypeError('Expecting actions array')
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

    arg.actions.forEach(action => {
      if(!Array.isArray(action.authorization)) {
        throw new TypeError('Expecting action.authorization array', action)
      }
    })

    if(options.sign && typeof config.signProvider !== 'function') {
      throw new TypeError('Expecting config.signProvider function (disable using {sign: false})')
    }

    const headers = config.transactionHeaders ?
      config.transactionHeaders :
      network.createTransaction

    headers(options.expireInSeconds, checkError(callback, async function(rawTx) {
      // console.log('rawTx', rawTx)
      assert.equal(typeof rawTx, 'object', 'expecting transaction header object')
      assert.equal(typeof rawTx.expiration, 'string', 'expecting expiration: iso date time string')
      assert.equal(typeof rawTx.ref_block_num, 'number', 'expecting ref_block_num number')
      assert.equal(typeof rawTx.ref_block_prefix, 'number', 'expecting ref_block_prefix number')

      rawTx = Object.assign({}, rawTx)

      rawTx.actions = arg.actions

      // Resolve shorthand, queue requests
      let txObject = Transaction.fromObject(rawTx)

      // After fromObject ensure any async actions are finished
      if(AssetCache.pending()) {
        await AssetCache.resolve()

        // Create the object again with resolved data
        txObject = Transaction.fromObject(rawTx)
      }

      const buf = Fcbuffer.toBuffer(Transaction, txObject)
      const tr = Transaction.toObject(txObject)

      const transactionId  = createHash('sha256').update(buf).digest().toString('hex')

      let sigs = []
      if(options.sign){
        const chainIdBuf = new Buffer(config.chainId, 'hex')
        const signBuf = Buffer.concat([chainIdBuf, buf, new Buffer(new Uint8Array(32))])
        sigs = config.signProvider({transaction: tr, buf: signBuf, sign})
        if(!Array.isArray(sigs)) {
          sigs = [sigs]
        }
      }

      // sigs can be strings or Promises
      Promise.all(sigs).then(sigs => {
        sigs = [].concat.apply([], sigs) // flatten arrays in array

        for(let i = 0; i < sigs.length; i++) {
          const sig = sigs[i]
          // normalize (hex to base58 format for example)
          if(typeof sig === 'string' && sig.length === 130) {
            sigs[i] = ecc.Signature.from(sig).toString()
          }
        }

        const packedTr = {
          compression: 'none',
          transaction: tr,
          signatures: sigs
        }

        const mock = config.mockTransactions ? config.mockTransactions() : null
        if(mock != null) {
          assert(/pass|fail/.test(mock), 'mockTransactions should return a string: pass or fail')
          if(mock === 'pass') {
            callback(null, {
              transaction_id: transactionId,
              mockTransaction: true,
              broadcast: false,
              transaction: packedTr
            })
          }
          if(mock === 'fail') {
            console.error(`[push_transaction mock error] 'fake error', digest '${buf.toString('hex')}'`)
            callback('fake error')
          }
          return
        }

        if(!options.broadcast) {
          callback(null, {
            transaction_id: transactionId,
            broadcast: false,
            transaction: packedTr
          })
        } else {
          network.pushTransaction(packedTr, error => {
            if(!error) {
              callback(null, {
                transaction_id: transactionId,
                broadcast: true,
                transaction: packedTr
              })
            } else {
              console.error(`[push_transaction error] '${error.message}', transaction '${buf.toString('hex')}'`)
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
    return option // {debug, broadcast, etc} (etc my overwrite tr below)
  }
  if(typeof option === 'boolean') {
    // broadcast argument as a true false value, back-end cli will use this shorthand
    return {broadcast: option}
  }
}

function usage (type, definition, Network, account, config) {
  let usage = ''
  const out = (str = '') => {
    usage += str + '\n'
  }
  out('CONTRACT')
  out(account)
  out()

  out('FUNCTION')
  out(type)
  out()

  let struct
  if(account === 'eosio' || account === 'eosio.token') {
    const {structs} = Structs(
      Object.assign(
        {defaults: true, network: Network},
        config
      )
    )
    struct = structs[type]

    out('PARAMETERS')
    out(JSON.stringify(definition, null, 4))
    out()

    out('EXAMPLE')
    out(JSON.stringify(struct.toObject(), null, 4))

  } else {
    const cache = config.abiCache.abi(account)
    out('PARAMETERS')
    out(JSON.stringify(schemaFields(cache.schema, type), null, 4))
    out()

    struct = cache.structs[type]
    out('EXAMPLE')
    out(JSON.stringify(struct.toObject(), null, 4))
  }
  if(struct == null) {
    throw TypeError('Unknown type: ' + type)
  }
  return usage
}

const checkError = (parentErr, parrentRes) => (error, result) => {
  if (error) {
    console.log('error', error)
    parentErr(error)
  } else {
    Promise.resolve(parrentRes(result)).catch(error => {
      parentErr(error)
    })
  }
}

function schemaFields(schema, type) {
  const {base, fields} = schema[type]
  const def = {}
  if(base && base !== '') {
    Object.assign(def, schemaFields(schema, base))
  }
  Object.assign(def, fields)
  return def
}
