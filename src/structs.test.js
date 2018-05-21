/* eslint-env mocha */
const assert = require('assert')
const Fcbuffer = require('fcbuffer')
const ByteBuffer = require('bytebuffer')

const Eos = require('.')

describe('shorthand', () => {

  it('authority', () => {
    const eos = Eos.Localnet()
    const {authority} = eos.fc.structs

    const pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    const auth = {threshold: 1, keys: [{key: pubkey, weight: 1}]}

    assert.deepEqual(authority.fromObject(pubkey), auth)
    assert.deepEqual(
      authority.fromObject(auth),
      Object.assign({}, auth, {accounts: [], waits: []})
    )
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
    ], accounts: [], waits: []}

    const authUnsorted = {threshold: 1, keys: [
      {key: pubkeys[0], weight: 1},
      {key: pubkeys[1], weight: 1}
    ], accounts: [], waits: []}

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

  it('symbol', () => {
    const eos = Eos.Localnet()
    const {types} = eos.fc
    const Symbol = types.symbol()

    assertSerializer(Symbol, '4,SYS', '4,SYS', 'SYS')
  })

  it('asset', () => {
    const eos = Eos.Localnet()
    const {types} = eos.fc
    const AssetType = types.asset()

    assertSerializer(AssetType, '1.1 4,SYS@eosio.token', '1.1000 4,SYS@eosio.token', '1.1000 SYS')
  })

  it('extended_asset', () => {
    const eos = Eos.Localnet({defaults: true})
    const eaType = eos.fc.types.extended_asset()
    const eaString = eaType.toObject()
    assertSerializer(eaType, eaString)
  })

  it('signature', () => {
    const eos = Eos.Localnet()
    const {types} = eos.fc
    const SignatureType = types.signature()
    const signatureString = 'SIG_K1_JwxtqesXpPdaZB9fdoVyzmbWkd8tuX742EQfnQNexTBfqryt2nn9PomT5xwsVnUB4m7KqTgTBQKYf2FTYbhkB5c7Kk9EsH'
    //const signatureString = 'SIG_K1_Jzdpi5RCzHLGsQbpGhndXBzcFs8vT5LHAtWLMxPzBdwRHSmJkcCdVu6oqPUQn1hbGUdErHvxtdSTS1YA73BThQFwV1v4G5'
    assertSerializer(SignatureType, signatureString)
  })

})

if(process.env['NODE_ENV'] === 'development') {

  describe('Eosio Abi', () => {

    it('Eosio token contract parses', (done) => {
      const eos = Eos.Localnet()

      eos.contract('eosio.token', (error, eosio_token) => {
        assert(!error, error)
        assert(eosio_token.transfer, 'eosio.token contract')
        assert(eosio_token.issue, 'eosio.token contract')
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

  it('hex', () => {
    const eos = Eos.Localnet({forceActionDataHex: false, debug: false})
    const {structs, types} = eos.fc

    const tr = {from: 'inita', to: 'initb', quantity: '1.0000 4,SYS@eosio.token', memo: ''}
    const hex = Fcbuffer.toBuffer(structs.transfer, tr).toString('hex')

    const value = {
      account: 'eosio.token',
      name: 'transfer',
      data: hex,
      authorization: []
    }

    const {action} = structs
    const obj = action.fromObject(value) // tests fromObject
    const buf = Fcbuffer.toBuffer(action, obj) // tests appendByteBuffer

    // Note, Fcbuffer.fromBuffer calls toObject (that would remove the precision again)
    const b = ByteBuffer.fromBinary(buf, ByteBuffer.LITTLE_ENDIAN)
    const obj2 = action.fromByteBuffer(b)
    assert.equal('1.0000 4,SYS@eosio.token', obj2.data.quantity)

    const obj3 = action.toObject(obj) // tests toObject
    assert.equal('1.0000 SYS', obj3.data.quantity) // blockchain compatible format
    obj3.data.quantity = '1.0000 4,SYS@eosio.token' //convert back to internal format (for asserts below)

    assert.deepEqual(Object.assign({}, value, {data: tr}), obj3, 'serialize object')
    assert.deepEqual(obj3, obj2, 'serialize buffer')
  })

  it('force hex', () => {
    const eos = Eos.Localnet({forceActionDataHex: true})
    const {structs, types} = eos.fc
    const value = {
      account: 'eosio.token',
      name: 'transfer',
      data: {
        from: 'inita',
        to: 'initb',
        quantity: '1 SYS',
        memo: ''
      },
      authorization: []
    }
    const type = structs.action
    const obj = type.fromObject(value) // tests fromObject
    const buf = Fcbuffer.toBuffer(type, obj) // tests appendByteBuffer
    const obj2 = Fcbuffer.fromBuffer(type, buf) // tests fromByteBuffer
    const obj3 = type.toObject(obj) // tests toObject

    const data = Fcbuffer.toBuffer(structs.transfer, obj.data)
    const dataHex = data.toString('hex')

    assert.deepEqual(Object.assign({}, value, {data: dataHex}), obj3, 'serialize object')
    assert.deepEqual(obj3, obj2, 'serialize buffer')
  })

  it('unknown type', () => {
    const eos = Eos.Localnet({forceActionDataHex: false})
    const {structs, types} = eos.fc
    const value = {
      account: 'eosio.token',
      name: 'mytype',
      data: '030a0b0c',
      authorization: []
    }
    assertSerializer(structs.action, value)
  })
})

function assertSerializer (type, value, fromObjectResult = null, toObjectResult = fromObjectResult) {
  const obj = type.fromObject(value) // tests fromObject
  const buf = Fcbuffer.toBuffer(type, obj) // tests appendByteBuffer
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
