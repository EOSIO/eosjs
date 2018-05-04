/* eslint-env mocha */
const assert = require('assert')
const Fcbuffer = require('fcbuffer')

const Eos = require('.')

describe('shorthand', () => {

  it('asset', () => {
    const eos = Eos.Localnet()
    const {types} = eos.fc
    const AssetType = types.asset()

    assertSerializer(AssetType, '1.0000 EOS')

    const obj = AssetType.fromObject('1 EOS')
    assert.equal(obj, '1.0000 EOS')

    const obj2 = AssetType.fromObject({amount: 10000, symbol: 'EOS'})
    assert.equal(obj, '1.0000 EOS')
  })

  it('authority', () => {
    const eos = Eos.Localnet()
    const {authority} = eos.fc.structs

    const pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    const auth = {threshold: 1, keys: [{key: pubkey, weight: 1}], accounts: []}

    assert.deepEqual(authority.fromObject(pubkey), auth)
    assert.deepEqual(authority.fromObject(auth), auth)
  })

  it('PublicKey sorting', () => {
    const eos = Eos.Localnet()
    const {authority} = eos.fc.structs

    const pubkeys = [
      'EOS7wBGPvBgRVa4wQN2zm5CjgBF6S7tP7R3JavtSa2unHUoVQGhey',
      'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    ]

    const authSorted = {threshold: 1, keys: [
      {key: pubkeys[1], weight: 1},
      {key: pubkeys[0], weight: 1}
    ], accounts: []}

    const authUnsorted = {threshold: 1, keys: [
      {key: pubkeys[0], weight: 1},
      {key: pubkeys[1], weight: 1}
    ], accounts: []}

    // assert.deepEqual(authority.fromObject(pubkey), auth)
    assert.deepEqual(authority.fromObject(authUnsorted), authSorted)
  })

  it('public_key', () => {
    const eos = Eos.Localnet()
    const {structs, types} = eos.fc
    const PublicKeyType = types.public_key()
    const pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    // 02c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cf
    assertSerializer(PublicKeyType, pubkey)
  })

  it('extended_asset', () => {
    const eos = Eos.Localnet({defaults: true})
    const eaType = eos.fc.types.extended_asset()
    const eaString = eaType.toObject()
    assertSerializer(eaType, eaString)
    assert.equal(eaType.toObject('1 SBL'), '1.0000 SBL@eosio')
  })

  it('symbol', () => {
    const eos = Eos.Localnet()
    const {types} = eos.fc
    const AssetSymbolType = types.symbol()

    assertSerializer(AssetSymbolType, 'EOS')

    const obj = AssetSymbolType.fromObject('EOS')
    const buf = Fcbuffer.toBuffer(AssetSymbolType, obj)
    assert.equal(buf.toString('hex'), '04454f5300000000')
  })

  it('signature', () => {
    const eos = Eos.Localnet()
    const {types} = eos.fc
    const SignatureType = types.signature()
    const signatureString = 'SIG_K1_Jzdpi5RCzHLGsQbpGhndXBzcFs8vT5LHAtWLMxPzBdwRHSmJkcCdVu6oqPUQn1hbGUdErHvxtdSTS1YA73BThQFwV1v4G5'
    assertSerializer(SignatureType, signatureString)
  })

})

if(process.env['NODE_ENV'] === 'development') {

  describe('Eosio Abi', () => {

    it('Eosio contract parses', (done) => {
      const eos = Eos.Localnet()

      eos.contract('eosio', (error, eosio) => {
        assert(!error, error)
        assert(eosio.transfer, 'eosio contract')
        assert(eosio.issue, 'eosio contract')
        done()
      })
    })

  })
}

describe('Message.data', () => {
  it('json', () => {
    const eos = Eos.Localnet({forceActionDataHex: false})
    const {structs, types} = eos.fc
    const value = {
      account: 'eosio',
      name: 'transfer',
      data: {
        from: 'inita',
        to: 'initb',
        quantity: '1.0000 EOS',
        memo: ''
      },
      authorization: []
    }
    assertSerializer(structs.action, value)
  })

  it('hex', () => {
    const eos = Eos.Localnet({forceActionDataHex: false, debug: false})
    const {structs, types} = eos.fc

    const tr = {from: 'inita', to: 'initb', quantity: '1.0000 EOS', memo: ''}
    const hex = Fcbuffer.toBuffer(structs.transfer, tr).toString('hex')
    // const lenPrefixHex = Number(hex.length / 2).toString(16) + hex.toString('hex')

    const value = {
      account: 'eosio',
      name: 'transfer',
      data: hex,
      authorization: []
    }

    const type = structs.action
    const obj = type.fromObject(value) // tests fromObject
    const buf = Fcbuffer.toBuffer(type, obj) // tests appendByteBuffer
    const obj2 = Fcbuffer.fromBuffer(type, buf) // tests fromByteBuffer
    const obj3 = type.toObject(obj) // tests toObject

    assert.deepEqual(Object.assign({}, value, {data: tr}), obj3, 'serialize object')
    assert.deepEqual(obj3, obj2, 'serialize buffer')
  })

  it('force hex', () => {
    const eos = Eos.Localnet({forceActionDataHex: true})
    const {structs, types} = eos.fc
    const value = {
      account: 'eosio',
      name: 'transfer',
      data: {
        from: 'inita',
        to: 'initb',
        quantity: '1 EOS',
        memo: ''
      },
      authorization: []
    }
    const type = structs.action
    const obj = type.fromObject(value) // tests fromObject
    const buf = Fcbuffer.toBuffer(type, obj) // tests appendByteBuffer
    const obj2 = Fcbuffer.fromBuffer(type, buf) // tests fromByteBuffer
    const obj3 = type.toObject(obj) // tests toObject

    const data = Fcbuffer.toBuffer(structs.transfer, value.data)
    const dataHex = //Number(data.length).toString(16) +
      data.toString('hex')

    assert.deepEqual(Object.assign({}, value, {data: dataHex}), obj3, 'serialize object')
    assert.deepEqual(obj3, obj2, 'serialize buffer')
  })

  it('unknown type', () => {
    const eos = Eos.Localnet({forceActionDataHex: false})
    const {structs, types} = eos.fc
    const value = {
      account: 'eosio',
      name: 'mytype',
      data: '030a0b0c',
      authorization: []
    }
    assertSerializer(structs.action, value)
  })
})

function assertSerializer (type, value) {
  const obj = type.fromObject(value) // tests fromObject
  const buf = Fcbuffer.toBuffer(type, obj) // tests appendByteBuffer
  const obj2 = Fcbuffer.fromBuffer(type, buf) // tests fromByteBuffer
  const obj3 = type.toObject(obj) // tests toObject

  assert.deepEqual(value, obj3, 'serialize object')
  assert.deepEqual(obj3, obj2, 'serialize buffer')
}
