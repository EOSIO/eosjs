const assert = require('assert')
const Structs = require('./structs')

module.exports = AssetCache

function AssetCache(network) {
  const cache = {
    'EOS@eosio': {precision: 4},
    'EOS@eosio.token': {precision: 4},
    'CUR@currency': {precision: 4},
    'EOS@currency': {precision: 4},
    'PHI@eosio.token': {precision: 3}
  }

  /** @return {Promise} {precision} */
  function lookupAsync(symbol, account) {
    assert(symbol, 'required symbol')
    assert(account, 'required account')
    const extendedAsset = `${symbol}@${account}`

    if(cache[extendedAsset] != null) {
      return Promise.resolve(cache[extendedAsset])
    }

    const statsPromise = network.getCurrencyStats(account, symbol).then(result => {
      const stats = result[symbol]
      assert(stats, `Missing currency stats for asset: ${extendedAsset}`)

      const {max_supply} = stats

      assert.equal(typeof max_supply, 'string',
        `Expecting max_supply string in currency stats: ${result}`)

      assert(new RegExp(`^[0-9]+(\.[0-9]+)? ${symbol}$`).test(max_supply),
        `Expecting max_supply string like 10000.0000 SYM, instead got: ${max_supply}`)

      const [supply] = max_supply.split(' ')
      const [, decimalstr = ''] = supply.split('.')
      const precision = decimalstr.length

      assert(precision >= 0 && precision <= 18,
        'unable to determine precision from string: ' + max_supply)

      return cache[extendedAsset] = {precision}
    })
    return cache[extendedAsset] = statsPromise
  }

  function lookup(symbol, account) {
    assert(symbol, 'required symbol')
    assert(account, 'required account')
    const extendedAsset = `${symbol}@${account}`

    const c = cache[extendedAsset]
    if(c != null) {
      return c
    }
    if(c instanceof Promise) {
      return undefined
    }
    return null
  }

  return {
    lookupAsync,
    lookup
  }
}
