Below are a number of ways authorization related requests can fail and what the failure could potentially mean.

## transaction declares authority but does not have signatures for it.
```javascript
(node:99019) UnhandledPromiseRejectionWarning: Error: transaction declares authority '{"actor":"useraaaaaaaa","permission":"active"}', but does not have signatures for it.
```

This exception can occur for a number of different reasons.

It could be that the private key supplied to the signature provider is incorrect for the actor in which the transaction is being signed for.  It could also be that the `actor` field of the `authorization` object is incorrect.  Finally, it could be that the `permission` specified is incorrect or does not exist for the specified actor.

## Invalid checksum
```javascript
Error: Invalid checksum, 01b93f != 5df6e0e2
```

This typically implies the private key supplied to the `JsSignatureProvider` object is malformed or invalid.

## Cannot read property 'length' of undefined
```javascript
(node:97736) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'length' of undefined
```

This typically implies you have not supplied an `authorization` field in the `action` supplied to the `transact` method of the `api` object.

For example, the below request would cause the above exception, since the `authorization` field is not present.
```javascript
(async () => {
  await api.transact({
   actions: [{
     account: 'eosio',
     name: 'buyrambytes',
     data: {
       payer: 'useraaaaaaaa',
       receiver: 'useraaaaaaaa',
       bytes: 8192,
     },
   }]
  }, {
   blocksBehind: 3,
   expireSeconds: 30,
  });
})();
```

## missing permission_level
```javascript
(node:472) UnhandledPromiseRejectionWarning: Error: missing permission_level.permission (type=name)
```

This means that you have left either the `actor` or `permission` field off of the `authorization` object of an action.

