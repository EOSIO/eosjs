The `eosjs` package provides two objects: an `Api` object and a `JsonRpc` object.  An explanation of their expected parameters and usage is provided below.

## JsonRpc
The `JsonRpc` object takes the node you wish to connect to in the form of a string as a required constructor argument, as well as an optional `fetch` object (see [CommonJS](01_commonjs.md) for an example).  

Note that reading blockchain state requires only an instance of `JsonRpc` connected to a node and not the `Api` object.

## Api
To send transactions and trigger actions on the blockchain, you must have an instance of `Api`. This `Api` instance is required to receive a SignatureProvider object in it's constructor.

The SignatureProvider object must contain the private keys corresponding to the actors and permission requirements of the actions being executed.

## JsSignatureProvider
The Api constructor requires a SignatureProvider. SignatureProviders implement the `dist/eosjs-api-interfaces.SignatureProvider` interface. For development purpose only, a `JsSignatureProvider` object is also provided via the `dist/eosjs-jssig` import to stand-in for an easy option for a signature provider during development, but should only be used in development, as it is not secure.

In production code, it is recommended that you use a secure vault outside of the context of the webpage (which will also implement the `eosjs-api-interfaces.SignatureProvider` interface) to ensure security when signing transactions.

## WebCryptoSignatureProvider
Additionally, `WebCryptoSignatureProvider` is available in `eosjs` as a more secure built-in `SignatureProvider` than `JsSignatureProvider`.  Utilizing the [SubtleCrypto interface of the Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto), the `WebCryptoSignatureProvider` provides functionality for signing transactions utilizing CryptoKeys created by Web Crypto.  There are several methods available as well to convert extractable CryptoKeys into PrivateKey/PublicKey `eosjs` formats, which can then be converted into string or `elliptic` keypairs.  The method `generateWebCryptoKeyPair` is also available to create a CryptoKeyPair where the private CryptoKey is non-extractable and the public CryptoKey is extractable.  This is intentional as an extractable private key is more insecure than a non-extractable private key.  There are several more security concerns that you will need to address when it comes to utilizing the Web Crypto API, such as secure key management, so only utilize the `WebCryptoSignatureProvider` if you are aware of these security requirements and the risks involved in insecure environments.