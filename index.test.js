/* eslint-env mocha */
const Eos = require('.')
const callback = (err, res) => {err ? console.error(err) : console.log(res)}
const signProvider = ({sign, buf}) => sign(buf, '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
const promiseSigner = (args) => Promise.resolve(signProvider(args))

describe('transaction no broadcast', () => {
  it('transfer', () => {
    eos = Eos.Testnet({debug: false, signProvider})
    return eos.transfer('inita', 'initb', 1, false)
  })
})

if(process.env['NODE_ENV'] === 'development') {
  describe('networks', () => {
    it('eos', (done) => {
      eos = Eos.Testnet()
      eos.getBlock(1, (err, block) => {
        if(err) {
          throw err
        }
        done()
      })
    })
  })
}

// const cb = done => (err, result) => {
//   if(err) {
//     done(JSON.stringify(err, null, 4))
//     return
//   }
//   console.log('success', result)
//   done()
// }

if(process.env['NODE_ENV'] === 'development') {

  describe('transaction', () => {
    it('transfer', () => {
      eos = Eos.Testnet({debug: false, signProvider})
      return eos.transfer('inita', 'initb', 1)
    })

    it('transfer callback', () => {
      eos = Eos.Testnet({debug: false, signProvider})
      return eos.transfer('inita', 'initb', 1, callback)
    })

    it('transfer sign promise', () => {
      eos = Eos.Testnet({debug: false, signProvider: promiseSigner})
      return eos.transfer('inita', 'initb', 1)
    })

    it('custom transfer', () => {
      eos = Eos.Testnet({debug: false, signProvider})
      return eos.transaction({
        scope: ['inita', 'inita'],
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
        ]
      })

    })

  // it(..

  })

}
