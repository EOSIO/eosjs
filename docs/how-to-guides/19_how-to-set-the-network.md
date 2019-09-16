To change the network used by `eosjs`, pass in the URL of a node connected to the network of interest to `JsonRpc`.

In the examples shown in the `basic-usage` section, it was assumed that a local node running on port `8888` was used.
```javascript
const rpc = new JsonRpc('http://127.0.0.1:8888');
```

However, the address and port of any node on any network can be used by passing in the URL of the node as a string to the `JsonRpc` object.  Assuming there is a node running at the IP address `192.168.2.1` listening for requests on port `9999`, we could connect to this node and it's network with the following line of code.
```javascript
const rpc = new JsonRpc('http://192.168.2.1:9999');
```