While troubleshooting network connectivity it is advisable to issue a `rpc.get_info()` request to rule out the possibility of `Api` object misconfiguration or authorization related problems.  Given the `JsonRpc` object only requires a node URL, this approach isolates problems to simple node connectivity problems.

Below are a number of ways a `rpc.get_info()` request can fail and what they could potentially mean.

## invalid json response body
```javascript
(node:66636) UnhandledPromiseRejectionWarning: FetchError: invalid json response body at http://www.some-node-url.com/v1/chain/get_info reason: Unexpected token < in JSON at position 0
```

This typically means you have connected to a computer that is not running EOSIO software.  For example, if you instantiate a `JsonRpc` object as follows:

```javascript
const rpc = new JsonRpc('http://some-node-url.com', { fetch });
```

You would see the exception above when issuing a `rpc.get_info()` request since the computer at `http://some-node-url.com` is not running EOSIO software.

## ETIMEDOUT
```javascript
(node:68313) UnhandledPromiseRejectionWarning: FetchError: request to http://some-node-url.com:8000/v1/chain/get_info failed, reason: connect ETIMEDOUT 53.140.50.180:8000
```

This typically implies you have connected to a node that *is* running EOSIO software, but have entered the incorrect port, or left off the port number altogether.

## Indefinite Hanging
If the `rpc.get_info()` request never returns, but also never throws an exception, it is likely that you've connected to a node running EOSIO software, but have misconfigured the protocol (http/https).

## Only absolute URLs are supported
```javascript
(node:72394) UnhandledPromiseRejectionWarning: TypeError: Only absolute URLs are supported
```

This typically implies you've entered an empty string as the first argument to `JsonRpc` as shown below.

```javascript
const rpc = new JsonRpc('', { fetch });
```

## Only HTTP(S) protocols are supported
```javascript
(node:72612) UnhandledPromiseRejectionWarning: TypeError: Only HTTP(S) protocols are supported
```
This typically implies you've left off the protocol from the absolute URL string (i.e. `127.0.0.1:8888` rather than `http://127.0.0.1:8888`).


## ENOTFOUND
```javascript
(node:72822) UnhandledPromiseRejectionWarning: FetchError: request to http://www.some-node-url.com:8888/v1/chain/get_info failed, reason: getaddrinfo ENOTFOUND www.some-node-url.com
```
This typically implies you've misconfigured the domain name of the absolute URL in some way.  Adding `www.` erroneously or removing `.com` at the end of the domain name could be possible mistakes.

## f is not a function
```javascript
(node:74052) UnhandledPromiseRejectionWarning: TypeError: f is not a function
```
This typically implies the absolute URL string of the node was not passed to the `JsonRpc` object as show below

```javascript
const rpc = new JsonRpc({ fetch });
```
