/* eslint-env mocha */
const assert = require('assert')
const fs = require('fs')

const Eos = require('.')
const {ecc} = Eos.modules
const {Keystore} = require('eosjs-keygen')

const wif = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'

describe('version', () => {
  it('exposes a version number', () => {
    assert.ok(Eos.version)
  })
})

describe('offline', () => {
  const headers = {
    expiration: new Date().toISOString().split('.')[0],
    region: 0,
    ref_block_num: 1,
    ref_block_prefix: 452435776,
    max_net_usage_words: 0,
    max_kcpu_usage: 0,
    delay_sec: 0,
    context_free_actions: []
  }

  it('transaction', async function() {
    const privateKey = await ecc.unsafeRandomKey()

    const eos = Eos.Localnet({
      keyProvider: privateKey,
      httpEndpoint: 'https://doesnotexist.example.org',
      transactionHeaders: (expireInSeconds, callback) => {
        callback(null/*error*/, headers)
      },
      broadcast: false,
      sign: true
    })

    const memo = ''
    const trx = await eos.transfer('bankers', 'people', '1000000 EOS', memo)

    assert.deepEqual({
      expiration: trx.transaction.transaction.expiration,
      region: 0,
      ref_block_num: trx.transaction.transaction.ref_block_num,
      ref_block_prefix: trx.transaction.transaction.ref_block_prefix,
      max_net_usage_words: 0,
      max_kcpu_usage: 0,
      delay_sec: 0,
      context_free_actions: []
    }, headers)

    assert.equal(trx.transaction.signatures.length, 1, 'expecting 1 signature')
  })
})

// even transactions that don't broadcast require Api lookups
//  no testnet yet, avoid breaking travis-ci
if(process.env['NODE_ENV'] === 'development') {

  describe('networks', () => {
    it('testnet', (done) => {
      const eos = Eos.Localnet()
      eos.getBlock(1, (err, block) => {
        if(err) {
          throw err
        }
        done()
      })
    })
  })

  describe('Contracts', () => {
    it('Messages do not sort', async function() {
      const local = Eos.Localnet()
      const opts = {sign: false, broadcast: false}
      const tx = await local.transaction(['currency', 'eosio'], ({currency, eosio}) => {
        eosio.transfer('inita', 'initd', '1 EOS', '') // make sure {account: 'eosio', ..} remains first
        currency.transfer('inita', 'initd', '1 CUR', '') // {account: 'currency', ..} remains second
      }, opts)
      assert.equal(tx.transaction.transaction.actions[0].account, 'eosio')
      assert.equal(tx.transaction.transaction.actions[1].account, 'currency')
    })

    function deploy(name) {
      it(`Deploy ${name}`, async function() {
        this.timeout(4000)
        const config = {binaryen: require("binaryen"), keyProvider: wif}
        const eos = Eos.Localnet(config)

        // When this test is ran multiple times, avoids same contract
        // version re-deploy error.  TODO: undeploy contract instead
        // const tmpWast = fs.readFileSync(`docker/contracts/proxy/proxy.wast`)
        // await eos.setcode('inita', 0, 0, tmpWast)

        const wast = fs.readFileSync(`docker/contracts/${name}/${name}.wast`)
        const abi = fs.readFileSync(`docker/contracts/${name}/${name}.abi`)
        await eos.setcode('inita', 0, 0, wast)
        await eos.setabi('inita', JSON.parse(abi))
      })
    }
    deploy('eosio.token')
    deploy('eosio.bios')
    // deploy('exchange') // exceeds: max_transaction_net_usage

  })

  describe('transactions', () => {
    const signProvider = ({sign, buf}) => sign(buf, wif)
    const promiseSigner = (args) => Promise.resolve(signProvider(args))

    it('usage', () => {
      const eos = Eos.Localnet({signProvider})
      eos.transfer()
    })

    // A keyProvider can return private keys directly..
    it('keyProvider private key', () => {

      // keyProvider should return an array of keys
      const keyProvider = () => {
        return [wif]
      }

      const eos = Eos.Localnet({keyProvider})

      return eos.transfer('inita', 'initb', '1 EOS', '', false).then(tr => {
        assert.equal(tr.transaction.signatures.length, 1)
        assert.equal(typeof tr.transaction.signatures[0], 'string')
      })
    })

    it('keyProvider multiple private keys (get_required_keys)', () => {

      // keyProvider should return an array of keys
      const keyProvider = () => {
        return [
          '5K84n2nzRpHMBdJf95mKnPrsqhZq7bhUvrzHyvoGwceBHq8FEPZ',
          wif
        ]
      }

      const eos = Eos.Localnet({keyProvider})

      return eos.transfer('inita', 'initb', '1.274 EOS', '', false).then(tr => {
        assert.equal(tr.transaction.signatures.length, 1)
        assert.equal(typeof tr.transaction.signatures[0], 'string')
      })
    })

    // If a keystore is used, the keyProvider should return available
    // public keys first then respond with private keys next.
    it('keyProvider public keys then private key', () => {
      const pubkey = ecc.privateToPublic(wif)

      // keyProvider should return a string or array of keys.
      const keyProvider = ({transaction, pubkeys}) => {
        if(!pubkeys) {
          assert.equal(transaction.actions[0].name, 'transfer')
          return [pubkey]
        }

        if(pubkeys) {
          assert.deepEqual(pubkeys, [pubkey])
          return [wif]
        }
        assert(false, 'unexpected keyProvider callback')
      }

      const eos = Eos.Localnet({keyProvider})

      return eos.transfer('inita', 'initb', '9 EOS', '', false).then(tr => {
        assert.equal(tr.transaction.signatures.length, 1)
        assert.equal(typeof tr.transaction.signatures[0], 'string')
      })
    })

    it('keyProvider from eosjs-keygen', () => {
      const keystore = Keystore('uid')
      keystore.deriveKeys({parent: wif})
      const eos = Eos.Localnet({keyProvider: keystore.keyProvider})
      return eos.transfer('inita', 'initb', '12 EOS', '', true)
    })

    it('signProvider', () => {
      const customSignProvider = ({buf, sign, transaction}) => {

        // All potential keys (EOS6MRy.. is the pubkey for 'wif')
        const pubkeys = ['EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV']

        return eos.getRequiredKeys(transaction, pubkeys).then(res => {
          // Just the required_keys need to sign
          assert.deepEqual(res.required_keys, pubkeys)
          return sign(buf, wif) // return hex string signature or array of signatures
        })
      }
      const eos = Eos.Localnet({signProvider: customSignProvider})
      return eos.transfer('inita', 'initb', '2 EOS', '', false)
    })

    it('newaccount (broadcast)', () => {
      const eos = Eos.Localnet({signProvider})
      const pubkey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
      // const auth = {threshold: 1, keys: [{key: pubkey, weight: 1}], accounts: []}
      const name = randomName()

      return eos.newaccount({
        creator: 'inita',
        name,
        owner: pubkey,
        active: pubkey,
        recovery: 'inita'
      })
    })

    it('mockTransactions pass', () => {
      const eos = Eos.Localnet({signProvider, mockTransactions: 'pass'})
      return eos.transfer('inita', 'initb', '1 EOS', '').then(transfer => {
        assert(transfer.mockTransaction, 'transfer.mockTransaction')
      })
    })

    it('mockTransactions fail', () => {
      const eos = Eos.Localnet({signProvider, mockTransactions: 'fail'})
      return eos.transfer('inita', 'initb', '1 EOS', '').catch(error => {
        assert(error.indexOf('fake error') !== -1, 'expecting: fake error')
      })
    })

    it('transfer (broadcast)', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transfer('inita', 'initb', '1 EOS', '')
    })

    it('transfer custom authorization (broadcast)', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transfer('inita', 'initb', '1 EOS', '', {authorization: 'inita@owner'})
    })

    it('transfer custom authorization sorting (no broadcast)', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transfer('inita', 'initb', '1 EOS', '',
        {authorization: ['initb@owner', 'inita@owner'], broadcast: false}
      ).then(({transaction}) => {
        const ans = [
          {actor: 'inita', permission: 'owner'},
          {actor: 'initb', permission: 'owner'}
        ]
        assert.deepEqual(transaction.transaction.actions[0].authorization, ans)
      })
    })

    it('transfer (no broadcast)', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transfer('inita', 'initb', '1 EOS', '', {broadcast: false})
    })

    it('transfer (no broadcast, no sign)', () => {
      const eos = Eos.Localnet({signProvider})
      const opts = {broadcast: false, sign: false}
      return eos.transfer('inita', 'initb', '1 EOS', '', opts).then(tr =>
        assert.deepEqual(tr.transaction.signatures, [])
      )
    })

    it('transfer sign promise (no broadcast)', () => {
      const eos = Eos.Localnet({signProvider: promiseSigner})
      return eos.transfer('inita', 'initb', '1 EOS', '', false)
    })

    it('action to unknown contract', () => {
      const name = 'acdef513521'
      return Eos.Localnet({signProvider}).contract(name)
      .then(() => {throw 'expecting error'})
      .catch(error => {
        assert(/unknown key/.test(error.toString()),
          'expecting "unknown key" error action, instead got: ' + error)
      })
    })

    it('action to contract', () => {
      // initaPrivate = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
      // eos is a bad test case, but it was the only native contract
      const name = 'currency'
      return Eos.Localnet({signProvider}).contract(name).then(contract => {
        return contract.transfer('inita', 'initb', '1 CUR', '')
          // transaction sent on each command
          .then(tr => {
            assert.equal(1, tr.transaction.transaction.actions.length)

            return contract.transfer('initb', 'inita', '1 CUR', '')
              .then(tr => {assert.equal(1, tr.transaction.transaction.actions.length)})
          })
      }).then(r => {assert(r == undefined)})
    })

    it('action to contract atomic', async function() {
      let amt = 1 // for unique transactions
      const testnet = Eos.Localnet({signProvider})

      const trTest = currency => {
        assert(currency.transfer('inita', 'initb', amt + ' CUR', '') == null)
        assert(currency.transfer('initb', 'inita', (amt++) + ' CUR', '') == null)
      }

      const assertTr = tr =>{
        assert.equal(2, tr.transaction.transaction.actions.length)
      }

      //  contracts can be a string or array
      await assertTr(await testnet.transaction(['currency'], ({currency}) => trTest(currency)))
      await assertTr(await testnet.transaction('currency', currency => trTest(currency)))
    })

    it('action to contract (contract tr nesting)', function () {
      this.timeout(4000)
      const tn = Eos.Localnet({signProvider})
      return tn.contract('currency').then(currency => {
        return currency.transaction(tr => {
          tr.transfer('inita', 'initb', '1 CUR', '')
          tr.transfer('inita', 'initc', '2 CUR', '')
        }).then(() => {
          return currency.transfer('inita', 'initb', '3 CUR', '')
        })
      })
    })

    it('multi-action transaction (broadcast)', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transaction(tr => {
        assert(tr.transfer('inita', 'initb', '1 EOS', '') == null)
        assert(tr.transfer({from: 'inita', to: 'initc', quantity: '1 EOS', memo: ''}) == null)
      }).then(tr => {
        assert.equal(2, tr.transaction.transaction.actions.length)
      })
    })

    it('multi-action transaction no inner callback', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transaction(tr => {
        tr.transfer('inita', 'inita', '1 EOS', '', cb => {})
      })
      .then(() => {throw 'expecting rollback'})
      .catch(error => {
        assert(/Callback during a transaction/.test(error), error)
      })
    })

    it('multi-action transaction error rollback', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transaction(tr => {throw 'rollback'})
      .then(() => {throw 'expecting rollback'})
      .catch(error => {
        assert(/rollback/.test(error), error)
      })
    })

    it('multi-action transaction Promise.reject rollback', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transaction(tr => Promise.reject('rollback'))
      .then(() => {throw 'expecting rollback'})
      .catch(error => {
        assert(/rollback/.test(error), error)
      })
    })

    it('custom transfer', () => {
      const eos = Eos.Localnet({signProvider})
      return eos.transaction(
        {
          actions: [
            {
              account: 'eosio',
              name: 'transfer',
              data: {
                from: 'inita',
                to: 'initb',
                quantity: '13 EOS',
                memo: '爱'
              },
              authorization: [{
                actor: 'inita',
                permission: 'active'
              }]
            }
          ]
        },
        {broadcast: false}
      )
    })
  })

  // ./eosioc set contract currency build/contracts/currency/currency.wast build/contracts/currency/currency.abi
  it('Transaction ABI lookup', async function() {
    const eos = Eos.Localnet()
    const tx = await eos.transaction(
      {
        actions: [
          {
            account: 'currency',
            name: 'transfer',
            data: {
              from: 'inita',
              to: 'initb',
              quantity: '13 CUR',
              memo: ''
            },
            authorization: [{
              actor: 'inita',
              permission: 'active'
            }]
          }
        ]
      },
      {sign: false, broadcast: false}
    )
    assert.equal(tx.transaction.transaction.actions[0].account, 'currency')
  })

} // if development

const randomName = () => 'a' +
  String(Math.round(Math.random() * 1000000000)).replace(/[0,6-9]/g, '')
