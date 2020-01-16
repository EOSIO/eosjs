In order to deploy a smart contract using `eosjs`, call the [`setcode`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.system/include/eosio.system/native.hpp#L294) followed by the [`setabi`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.system/include/eosio.system/native.hpp#L281) actions of the `eosio` account.

## setcode
`setcode` takes the name of the account where the smart contract will be deployed to and the smart contract **.wasm** file.  The smart contract **.wasm** file should be a hex string.  Assuming that a valid **.wasm** file is located at `/mypath/my_smart_contract.wasm`, converting a smart contract to a hex string can be accomplished using the code below.
```javascript
const fs = require('fs')
const wasmFilePath = '/mypath/my_smart_contract.wasm'
const wasmHexString = fs.readFileSync(wasmFilePath).toString('hex')
```

In the example shown below `useraaaaaaaa` sets the account `useraaaaaaaa`'s code to the smart contract located at `/mypath/my_smart_contract.wasm`'s hex string representation. 
```javascript
        {
          account: 'eosio',
          name: 'setcode',
          authorization: [
            {
              actor: 'useraaaaaaaa',
              permission: 'active',
            },
          ],
          data: {
            account: 'useraaaaaaaa',
            code: wasmHexString,
          },
        }
```

## setabi
`setabi` takes the name of the account where the smart contract will be deployed to and the serialized **.abi** file corresponding to the **.wasm** used in the [`setcode`](#setcode) action corresponding to this `setabi` action.  The following code is provided to serialize **.abi** files.

```javascript
const fs = require('fs')

const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
})

const abiFilePath = '/mypath/my_smart_contract.abi'
let abiJSON = JSON.parse(fs.readFileSync(abiFilePath, 'utf8'))
const abiDefinitions = api.abiTypes.get('abi_def')

abiJSON = abiDefinitions.fields.reduce(
    (acc, { name: fieldName }) =>
        Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
        abiJSON
    )
abiDefinitions.serialize(buffer, abiJSON)
serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString('hex')
```
Note that the `api` object from [initialization](../basic-usage/01_commonjs.md) is used for it's `textEncoder`and `textDecoder` objects, as well as it's [`abiTypes`](https://github.com/EOSIO/eosjs/blob/849c03992e6ce3cb4b6a11bf18ab17b62136e5c9/src/eosjs-api.ts#L72) map.

This line in particular:
```javascript
abiJSON = abiDefinitions.fields.reduce(
    (acc, { name: fieldName }) =>
        Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
        abiJSON
    )
```
ensures that the **.abi** file contains [the fields that an **.abi** file is expected to contain](https://github.com/EOSIO/eosjs/blob/849c03992e6ce3cb4b6a11bf18ab17b62136e5c9/src/abi.abi.json#L151).  Note that if an expected field is missing, the call to `serialize` will [throw an exception](https://github.com/EOSIO/eosjs/blob/849c03992e6ce3cb4b6a11bf18ab17b62136e5c9/src/eosjs-serialize.ts#L644) indicating the missing field.

## Deploying a Smart Contract
Below the two actions are submitted as one transaction using the `Api` object.
```javascript
(async () => {
  await api.transact({
      actions: [
        {
          account: 'eosio',
          name: 'setcode',
          authorization: [
            {
              actor: 'useraaaaaaaa',
              permission: 'active',
            },
          ],
          data: {
            account: 'useraaaaaaaa',
            code: wasmHexString,
          },
        },
        {
          account: 'eosio',
          name: 'setabi',
          authorization: [
            {
              actor: 'useraaaaaaaa',
              permission: 'active',
            },
          ],
          data: {
            account: 'useraaaaaaaa',
            abi: serializedAbiHexString,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    });
})();
```

The entire code is provided below for reference.
```javascript
const wasmFilePath = '/mypath/my_smart_contract.wasm'
const abiFilePath = '/mypath/my_smart_contract.abi'

const wasmHexString = fs.readFileSync(wasmFilePath).toString('hex')

const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
})

let abiJSON = JSON.parse(fs.readFileSync(abiFilePath, 'utf8'))
const abiDefinitions = api.abiTypes.get('abi_def')
abiJSON = abiDefinitions.fields.reduce(
    (acc, { name: fieldName }) =>
        Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
        abiJSON
    )
abiDefinitions.serialize(buffer, abiJSON)
serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString('hex')

await api.transact(
    {
      actions: [
        {
          account: 'eosio',
          name: 'setcode',
          authorization: [
            {
              actor: 'useraaaaaaaa',
              permission: 'active',
            },
          ],
          data: {
            account: 'useraaaaaaaa',
            code: wasmHexString,
          },
        },
        {
          account: 'eosio',
          name: 'setabi',
          authorization: [
            {
              actor: 'useraaaaaaaa',
              permission: 'active',
            },
          ],
          data: {
            account: 'useraaaaaaaa',
            abi: serializedAbiHexString,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  )
```