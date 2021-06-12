There are many ways to retrieve data stored in smart contract tables.  A few are provided below.

## Get Table Rows
In the example shown below, the `eosio.token` smart contract's table `accounts` is queried with the scope `testacc`.  The data is returned as **json**, in-order, and limited to **10 rows**.  The RAM payer for the returned row is also not shown.
```javascript
(async () => {
  await rpc.get_table_rows({
    json: true,               // Get the response as json
    code: 'eosio.token',      // Contract that we target
    scope: 'testacc',         // Account that owns the data
    table: 'accounts',        // Table name
    limit: 10,                // Maximum number of rows that we want to get
    reverse: false,           // Optional: Get reversed data
    show_payer: false          // Optional: Show ram payer
  });
})();
```
Above we console log the response from the EOSIO network.  An example of an expected response is shown below.
```javascript
{
  rows: [ { balance: '68.3081 EOS' }, { balance: '200.0000 JUNGLE' } ],
  more: false
}
```
Note that since `more: false` was returned, if can be inferred that there are only 2 rows with scope `testacc` in the `accounts` table of the `eosio.token` smart contract.

## Get Currency Balance
Rather than using the `get_table_rows` method, a token balance can also be retrieved using the `get_currency_balance` method.  This method takes an `account` which is a smart contract storing the tokens, an `account` who has a balance in the token table of the specified smart contract, and the `symbol` of the token to retrieve the currency balance for.

In the example shown below, the balance of the user `testacc`'s tokens with the symbol `EOS` stored in the `eosio.token` smart contract is retrieved.
```javascript
(async () => {
  console.log(await rpc.get_currency_balance('eosio.token', 'testacc', 'EOS'));
})();
```
Above we console log the response from the EOSIO network.  An example of an expected response is shown below.
```javascript
[ '68.3081 EOS' ]
```

## Query By Index
A `lower_bound` parameter can also be passed to the `get_table_rows` method.  This parameter allows you to query for a particular value of the primary key in the table.  Using this in conjunction with `limit: 1` allows you to query for 1 row of a table.

In the example shown below, the `contract` smart contract's table `profiles` is queried with the scope `contract` for the row with primary key `testacc`.  The `limit` is **1** which implies that only 1 row with value `testacc` will be returned.
```javascript
(async () => {
  console.log(await rpc.get_table_rows({
    json: true,                 // Get the response as json
    code: 'contract',           // Contract that we target
    scope: 'contract',          // Account that owns the data
    table: 'profiles',          // Table name
    lower_bound: 'testacc',     // Table primary key value
    limit: 1,                   // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false,             // Optional: Get reversed data
    show_payer: false,          // Optional: Show ram payer
  }));
})();
```
Above we console log the response from the EOSIO network.  An example of an expected response is shown below.
```javascript
{
  "rows": [{
      "user": "testacc",
      "age": 21,
      "surname": "Martin"
    }
  ],
  "more": false
}
```

## Query By Secondary Index
Finally, the `lower_bound` parameter can be used in conjunction with the `index_position` parameter to query an index different from the primary key.

In the example shown below, the `contract` smart contract's table `profiles` is queried with the scope `contract` for the rows with secondary index `age` equal to **21**.  The `limit` is **1** which implies that only 1 row with the age **21** will be returned.
```javascript
(async () => {
  console.log(await rpc.get_table_rows({
    json: true,                 // Get the response as json
    code: 'contract',           // Contract that we target
    scope: 'contract',          // Account that owns the data
    table: 'profiles',          // Table name
    index_position: 2,          // Table secondary index
    lower_bound: 21,            // Table secondary key value
    limit: 1,                   // Here we limit to 1 to get only row
    reverse: false,             // Optional: Get reversed data
    show_payer: false,          // Optional: Show ram payer
  }));
})();
```

## Query Data using the Key-Value API (KV API) 
The KV API is a new api which allows smart contract developers to create datastore key value tables on-chain. KV tables can have multiple indices, unique indices and non-unique indices. The table must have at least one unique index. If the smart contract uses KV tables use the get_kv_table_rows RPC call to query data.

In the example shown below, the `contract` smart contract's kv table `profiles` is queried via the index named `users` for the row with primary key `testacc`.  The `limit` is **1** which implies that only 1 row with value `testacc` will be returned.
```javascript
(async () => {
  console.log(await rpc.get_kv_table_rows({
    json: false,               	// Get the response as json
    code: 'contract',          	// Contract that we target
    table: 'profiles',         	// Tablename
    indexName: 'users',     	// The name of the index name
    indexValue: 'testacc',     	// Table primary key value
	limit: 1,                  	// Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false,            	// Optional: Get reversed data
    show_payer: false,         	// Optional: Show ram payer
  }));
})();
```
Above we console log the response from the EOSIO network.  An example of an expected response is shown below.
```javascript
{
  "rows": [{
      "user": "testacc",
      "age": 21,
      "surname": "Martin"
    }
  ],
  "more": false
}
```

If the KV table has an additional indexes these can be used to query the data.  The example shown below, is based on the previous example however in this case an index called `ages` is defined. This index is used to query the table for records where the persons age is 17. 
```javascript
(async () => {
  console.log(await rpc.get_kv_table_rows({
    json: false,               	// Get the response as json
    code: 'contract',          	// Contract that we target
    table: 'profiles',         	// Tablename
    indexName: 'ages',     		// The name of the index name
    lowerBound: '17',     		// Table primary key value
    upperBound: '17',     		// Table primary key value
	limit: 1,                  	// Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false,            	// Optional: Get reversed data
    show_payer: false,         	// Optional: Show ram payer
  }));
})();
```
Above we console log the response from the EOSIO network.  An example of an expected response is shown below.
```javascript
{
  "rows": [{
      "user": "otheracc",
      "age": 17,
      "surname": "Dubious"
    }
  ],
  "more": false
}
```
