/* eslint-env mocha */
const Eos = require('.')

if(process.env['NODE_ENV'] === 'dev') {
  describe('networks', () => {
    it('testnet', (done) => {
      testnet = Eos.Testnet()
      testnet.getBlock(1, (err, block) => {
        if(err) {
          throw err
        }
        done()
      })
    })
  })
}

if(process.env['NODE_ENV'] === 'dev') {
  describe('transaction', () => {
    it('transfer', (done) => {
      testnet = Eos.Testnet({debug: true})
      callback = (err, res) => {err ? console.error(err) : console.log(res)}
      testnet.transaction({
        scope: ['eos', 'inita'],
        messages: [
          {
            code: 'eos',
            type: 'transfer',
            data: {
              from: 'eos',
              to: 'inita',
              amount: '13'
            }
          }
        ],
        authorizations: [{
          account: 'eos',
          permission: 'active'
        }],
        sign: ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3']
      }, (err, result) => {
        if(err) {
          done(JSON.stringify(err, null, 4))
          return
        }
        console.log('success', result)
        done()
      })
    })

  })
}
