const assert = require('assert')
const Structs = require('./structs')

module.exports = AssetCache

function AssetCache(network, config) {
  const cache = {}

  /** @return {Promise} {precision} */
  function lookupAsync(symbol, account) {
    assert(symbol, 'required symbol')
    assert(account, 'required account')
    const extendedAsset = `${symbol}@${account}`

    if(cache[extendedAsset] != null) {
      return Promise.resolve(cache[extendedAsset])
    }

    return network.getCurrencyStats(account, symbol).then(result => {
      const stats = result[symbol]
      assert(stats, `Missing currency stats for asset: ${extendedAsset}`)

      const {max_supply} = stats

      assert.equal(typeof max_supply, 'string',
        `Expecting max_supply string in currency stats: ${result}`)

      assert(new RegExp(`^[0-9]+\.[0-9]+ ${symbol}$`).test(max_supply),
        `Expecting max_supply string like 10000.0000 SYM, instead got: ${max_supply}`)

      const [supply] = max_supply.split(' ')
      const [, decimalstr] = supply.split('.')
      const precision = decimalstr.length

      return cache[extendedAsset] = {precision}
    })
  }

  function lookup(symbol, account) {
    assert(symbol, 'required symbol')
    assert(account, 'required account')
    const extendedAsset = `${symbol}@${account}`

    const c = cache[extendedAsset]
    if(c == null) {
      throw new Error(`Asset '${extendedAsset}' is not cached, call assetAsync('${account}, ${symbol}')`)
    }
    return c
  }

  return {
    lookupAsync,
    lookup
  }
}
