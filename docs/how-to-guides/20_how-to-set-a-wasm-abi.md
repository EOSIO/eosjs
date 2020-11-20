WASM Abis are a new format for smart contract Abis.  Previously, `eosjs` used a JSON Abi to serialize the data by using the types specified by the JSON Abi.  Some data types were unable to be serialized this way so one of the features of WASM Abis is the ability to expose the actions as functions and serialize/deserialize the data set within the WASM module.  JSON Abis are still fully supported but WASM Abis help to allow more data types to interact with.  First you need to add a `WasmAbiProvider` to your `Api`:

```javascript
import { Api } from 'eosjs';
import { WasmAbiProvider } from 'eosjs/dist/eosjs-wasmabi';

const wasmAbiProvider = new WasmAbiProvider();
const api = new Api({
  rpc,
  signatureProvider,
  wasmAbiProvider,
  chainId,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});
```

After setting the `WasmAbiProvider`, you can add a list of `WasmAbi` objects to be initialized by the `WasmAbiProvider`. You will need to host/store the wasm abi file generated with the smart contract where `eosjs` can access it.  Additionally, the `memoryThreshold` argument is for garbage collection.  When the buffer of the Wasm Abi object exceeds that amount in bytes, the next action will reset the Wasm Abi object and garbage collect the buffer.

```javascript
// Node.js Example
(async () => {
  await api.wasmAbiProvider.setWasmAbis([
    new WasmAbi({
      account: 'useraaaaaaaa',
      mod: new global.WebAssembly.Module(fs.readFileSync(path.join(__dirname + '/useraaaaaaaa_abi.wasm'))),
      memoryThreshold: 32000,
      textEncoder: api.textEncoder,
      textDecoder: api.textDecoder,
      print(x) { process.stdout.write(x); },
    })
  ]);
})();

// Browser Example
(async () => {
  const response = await fetch('useraaaaaaaa_abi.wasm');
  const buffer = await response.arrayBuffer();
  module = await WebAssembly.compile(buffer);

  await wasmAbiProvider.setWasmAbis([
    new eosjs_wasmabi.WasmAbi({
      account: 'useraaaaaaaa',
      mod: module,
      memoryThreshold: 32000,
      textEncoder: new TextEncoder(),
      textDecoder: new TextDecoder('utf-8', { fatal: true }),
      print: (x) => console.info(x),
    })
  ]);
})();
```

Utilizing the Wasm Abi object and the exposed action interfaces requires the concise structure mentioned in [How to Submit a Transaction](01_how-to-submit-a-transaction.md)
