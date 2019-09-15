To change the network used by `eosjs`, pass in the URL of a node connected to the network of interest.

In the examples shown in the `basic-usage` section, it was assumed that a local node running on port `8888` was used.
```javascript
const rpc = new JsonRpc('http://127.0.0.1:8888');
```

However, the address and port of any node on any network can be used by passing in the URL of the node as a string to the `JsonRpc` object.
```javascript
const rpc = new JsonRpc('<ANY_NODE_URL>');
```