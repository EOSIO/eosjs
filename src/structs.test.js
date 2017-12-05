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

  it('public_key', () => {
    const eos = Eos.Localnet()
    const {structs, types} = eos.fc
    const PublicKeyType = types.public_key()
    const pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    // 02c0ded2bc1f1305fb0faac5e6c03ee3a1924234985427b6167ca569d13df435cf
    assertSerializer(PublicKeyType, pubkey)
  })

  it('asset_symbol', () => {
    const eos = Eos.Localnet()
    const {types} = eos.fc
    const AssetSymbolType = types.asset_symbol()

    assertSerializer(AssetSymbolType, 'EOS')

    const obj = AssetSymbolType.fromObject('EOS')
    const buf = Fcbuffer.toBuffer(AssetSymbolType, obj)
    assert.equal(buf.toString('hex'), '04454f5300000000')
  })

})

describe('Message.data', () => {
  it('json', () => {
    const eos = Eos.Localnet({forceMessageDataHex: false})
    const {structs, types} = eos.fc
    const value = {
      code: 'eos',
      type: 'transfer',
      data: {
        from: 'inita',
        to: 'initb',
        amount: '1',
        memo: ''
      },
      authorization: []
    }
    assertSerializer(structs.message, value)
  })

  it('hex', () => {
    const eos = Eos.Localnet({forceMessageDataHex: false, debug: false})
    const {structs, types} = eos.fc

    const tr = {from: 'inita', to: 'initb', amount: '1', memo: ''}
    const hex = Fcbuffer.toBuffer(structs.transfer, tr).toString('hex')
    // const lenPrefixHex = Number(hex.length / 2).toString(16) + hex.toString('hex')

    const value = {
      code: 'eos',
      type: 'transfer',
      data: hex,
      authorization: []
    }
    
    const type = structs.message
    const obj = type.fromObject(value) // tests fromObject
    const buf = Fcbuffer.toBuffer(type, obj) // tests appendByteBuffer
    const obj2 = Fcbuffer.fromBuffer(type, buf) // tests fromByteBuffer
    const obj3 = type.toObject(obj) // tests toObject

    assert.deepEqual(Object.assign({}, value, {data: tr}), obj3, 'serialize object')
    assert.deepEqual(obj3, obj2, 'serialize buffer')
  })

  it('force hex', () => {
    const eos = Eos.Localnet({forceMessageDataHex: true})
    const {structs, types} = eos.fc
    const value = {
      code: 'eos',
      type: 'transfer',
      data: {
        from: 'inita',
        to: 'initb',
        amount: '1',
        memo: ''
      },
      authorization: []
    }
    const type = structs.message
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
    const eos = Eos.Localnet({forceMessageDataHex: false})
    const {structs, types} = eos.fc
    const value = {
      code: 'eos',
      type: 'mytype',
      data: '030a0b0c',
      authorization: []
    }
    assertSerializer(structs.message, value)
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
