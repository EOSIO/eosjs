/* eslint-env mocha */
const assert = require('assert')
const Fcbuffer = require('fcbuffer')
const ByteBuffer = require('bytebuffer')

const Eos = require('.')

describe('shorthand', () => {

  it('authority', async () => {
    const eos = Eos({keyPrefix: 'PUB'})
    const eosio = await eos.contract('eosio')
    const {authority} = eosio.fc.structs

    const pubkey = 'PUB6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    const auth = {threshold: 1, keys: [{key: pubkey, weight: 1}]}

    assert.deepEqual(authority.fromObject(pubkey), auth)
    assert.deepEqual(
      authority.fromObject(auth),
      Object.assign({}, auth, {accounts: [], waits: []})
    )
  })

  it('PublicKey sorting', async () => {
    const eos = Eos()
    const eosio = await eos.contract('eosio')
    const {authority} = eosio.fc.structs

    const pubkeys = [
      'EOS7wBGPvBgRVa4wQN2zm5CjgBF6S7tP7R3JavtSa2unHUoVQGhey',
      'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    ]

    const authSorted = {threshold: 1, keys: [
      {key: pubkeys[1], weight: 1},
      {key: pubkeys[0], weight: 1}
    ], accounts: [], waits: []}

    const authUnsorted = {threshold: 1, keys: [
      {key: pubkeys[0], weight: 1},
      {key: pubkeys[1], weight: 1}
    ], accounts: [], waits: []}

    // assert.deepEqual(authority.fromObject(pubkey), auth)
    assert.deepEqual(authority.fromObject(authUnsorted), authSorted)
  })

  it('public_key', () => {
    const eos = Eos({keyPrefix: 'PUB'})
    const {structs, types} = eos.fc
    const PublicKeyType = types.public_key()
    const pubkey = 'PUB6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    // 02c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cf
    assertSerializer(PublicKeyType, pubkey)
  })

  it('symbol', () => {
    const eos = Eos()
    const {types} = eos.fc
    const Symbol = types.symbol()
    assertSerializer(Symbol, '4,SYS', '4,SYS', 'SYS')
  })

  it('symbol_code', () => {
    const eos = Eos({defaults: true})
    const {types} = eos.fc
    const SymbolCode = types.symbol_code()
    assertSerializer(SymbolCode, SymbolCode.toObject())
  })

  it('extended_symbol', () => {
    const eos = Eos({defaults: true})
    const esType = eos.fc.types.extended_symbol()
    // const esString = esType.toObject()
    assertSerializer(esType, '4,SYS@contract')
  })

  it('asset', () => {
    const eos = Eos()
    const {types} = eos.fc
    const aType = types.asset()
    assertSerializer(aType, '1.0001 SYS')
  })

  it('extended_asset', () => {
    const eos = Eos({defaults: true})
    const eaType = eos.fc.types.extended_asset()
    assertSerializer(eaType, eaType.toObject())
  })

  it('signature', () => {
    const eos = Eos()
    const {types} = eos.fc
    const SignatureType = types.signature()
    const signatureString = 'SIG_K1_JwxtqesXpPdaZB9fdoVyzmbWkd8tuX742EQfnQNexTBfqryt2nn9PomT5xwsVnUB4m7KqTgTBQKYf2FTYbhkB5c7Kk9EsH'
    //const signatureString = 'SIG_K1_Jzdpi5RCzHLGsQbpGhndXBzcFs8vT5LHAtWLMxPzBdwRHSmJkcCdVu6oqPUQn1hbGUdErHvxtdSTS1YA73BThQFwV1v4G5'
    assertSerializer(SignatureType, signatureString)
  })

})

describe('Eosio Abi', () => {

  function checkContract(name) {
    it(`${name} contract parses`, (done) => {
      const eos = Eos()

      eos.contract('eosio.token', (error, eosio_token) => {
        assert(!error, error)
        assert(eosio_token.transfer, 'eosio.token contract')
        assert(eosio_token.issue, 'eosio.token contract')
        done()
      })
    })
  }
  checkContract('eosio')
  checkContract('eosio.token')

  it('abi', async () => {
    const eos = Eos({defaults: true, broadcast: false, sign: false})

    const {abi_def} = eos.fc.structs

    async function setabi(abi) {
      await eos.setabi('inita', abi) // See README
      const buf = eos.fc.toBuffer('abi_def', abi)
      await eos.setabi('inita', buf) // v1/chain/abi_json_to_bin
      await eos.setabi('inita', buf.toString('hex')) // v1/chain/abi_json_to_bin
    }

    const obj = abi_def.toObject()
    const json = JSON.stringify(obj)

    await setabi(obj)
    await setabi(abi_def.fromObject(obj))
    await setabi(abi_def.fromObject(json))
    await setabi(abi_def.fromObject(Buffer.from(json).toString('hex')))
    await setabi(abi_def.fromObject(Buffer.from(json)))
  })
})

describe('Action.data', () => {
  it('json', () => {
    const eos = Eos({forceActionDataHex: false})
    const {structs, types} = eos.fc
    const value = {
      account: 'eosio.token',
      name: 'transfer',
      data: {
        from: 'inita',
        to: 'initb',
        quantity: '1.0000 SYS',
        memo: ''
      },
      authorization: []
    }
    assertSerializer(structs.action, value)
  })

  it('force hex', () => {
    const eos = Eos({forceActionDataHex: true})
    const {structs, types} = eos.fc
    const value = {
      account: 'eosio.token',
      name: 'transfer',
      data: {
        from: 'inita',
        to: 'initb',
        quantity: '1.0000 SYS',
        memo: ''
      },
      authorization: []
    }
    assertSerializer(structs.action, value, value)
  })

  it('unknown action', () => {
    const eos = Eos({forceActionDataHex: false})
    const {structs, types} = eos.fc
    const value = {
      account: 'eosio.token',
      name: 'mytype',
      data: '030a0b0c',
      authorization: []
    }
    assert.throws(
      () => assertSerializer(structs.action, value),
      /Missing ABI action/
    )
  })
})

function assertSerializer (type, value, fromObjectResult = null, toObjectResult = fromObjectResult) {
  const obj = type.fromObject(value) // tests fromObject
  const buf = Fcbuffer.toBuffer(type, value) // tests appendByteBuffer
  const obj2 = Fcbuffer.fromBuffer(type, buf) // tests fromByteBuffer
  const obj3 = type.toObject(obj) // tests toObject

  if(!fromObjectResult && !toObjectResult) {
    assert.deepEqual(value, obj3, 'serialize object')
    assert.deepEqual(obj3, obj2, 'serialize buffer')
    return
  }

  if(fromObjectResult) {
    assert(fromObjectResult, obj, 'fromObjectResult')
    assert(fromObjectResult, obj2, 'fromObjectResult')
  }

  if(toObjectResult) {
    assert(toObjectResult, obj3, 'toObjectResult')
  }
}
