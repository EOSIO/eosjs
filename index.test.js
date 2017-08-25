/* eslint-env mocha */
const Eos = require('.')
const callback = done => (err, res) => {if(err) {console.error(err)} else {console.log(res); done()}}
const signProvider = ({sign, buf}) => sign(buf, '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
const promiseSigner = (args) => Promise.resolve(signProvider(args))

if(process.env['NODE_ENV'] === 'development') {// avoid breaking travis-ci

  describe('networks', () => {
    it('testnet', (done) => {
      eos = Eos.Testnet()
      eos.getBlock(1, (err, block) => {
        if(err) {
          throw err
        }
        done()
      })
    })
  })

  describe('transactions', () => {

    it('usage', () => {
      eos = Eos.Testnet({signProvider})
      eos.transfer()
    })

    it('transfer (broadcast)', () => {
      eos = Eos.Testnet({signProvider})
      return eos.transfer('inita', 'initb', 1)
    })

    it('transfer (no broadcast)', () => {
      eos = Eos.Testnet({signProvider})
      return eos.transfer('inita', 'initb', 1, {broadcast: false})
    })

    it('transfer sign promise (no broadcast)', () => {
      eos = Eos.Testnet({signProvider: promiseSigner})
      return eos.transfer('inita', 'initb', 1, false)
    })

    it('custom transfer', () => {
      eos = Eos.Testnet({debug: false, signProvider})
      return eos.transaction({
        scope: ['inita', 'initb'],
        messages: [
          {
            code: 'eos',
            type: 'transfer',
            data: {
              from: 'inita',
              to: 'initb',
              amount: '13'
            },
            authorization: [{
              account: 'inita',
              permission: 'active'
            }]
          }
        ],
        broadcast: false
      })
    })
  })

}
