const assert = require('assert')
const Structs = require('./structs')

module.exports = AssetCache

function AssetCache(network) {
  const cache = {
    'SYS@eosio.token': {precision: 4},
    'EOS@eosio.token': {precision: 4}
  }

  /**
    @return {Promise} {precision}
    @throws AssertionError
  */
  function lookupAsync(symbol, contract) {
    assert(symbol, 'required symbol')
    assert(contract, 'required contract')

    if(contract === 'eosio') {
      contract = 'eosio.token'
    }

    const extendedAsset = `${symbol}@${contract}`

    if(cache[extendedAsset] != null) {
      return Promise.resolve(cache[extendedAsset])
    }

    const statsPromise = network.getCurrencyStats(contract, symbol).then(result => {
      const stats = result[symbol]
      if(!stats) {
        cache[extendedAsset] = null // retry (null means no asset was observed)
        // console.log(`Missing currency stats for asset: ${extendedAsset}`)
        return
      }

      const {max_supply} = stats

      assert.equal(typeof max_supply, 'string',
        `Expecting max_supply string in currency stats: ${result}`)

      assert(new RegExp(`^[0-9]+(\.[0-9]+)? ${symbol}$`).test(max_supply),
        `Expecting max_supply string like 10000.0000 SYS, instead got: ${max_supply}`)

      const [supply] = max_supply.split(' ')
      const [, decimalstr = ''] = supply.split('.')
      const precision = decimalstr.length

      assert(precision >= 0 && precision <= 18,
        'unable to determine precision from string: ' + max_supply)

      return cache[extendedAsset] = {precision}
    })

    promises.push(statsPromise)

    return cache[extendedAsset] = statsPromise
  }

  /**
    @return {Object} {precision}, or null asset did not exist,
      or undefined = unknown if asset exists (call lookupAsync)
  */
  function lookup(symbol, contract) {
    assert(symbol, 'required symbol')
    assert(contract, 'required contract')

    if(contract === 'eosio') {
      contract = 'eosio.token'
    }

    const extendedAsset = `${symbol}@${contract}`

    const c = cache[extendedAsset]

    if(c instanceof Promise) {
      return undefined // pending
    }

    return c
  }

  return {
    lookupAsync,
    lookup
  }
}

let promises = []

AssetCache.resolve = async function() {
  await Promise.all(promises)
  promises = []
}

AssetCache.pending = function() {
  return promises.length !== 0
}
