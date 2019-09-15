To get a specific account's information call `get_account` on the rpc object passing in the account name as a function argument.
```javascript
(async () => {
  await rpc.get_account('alice') //get alice's account info.  This assumes the account 'alice' has been created on the chain specified in the rpc object.
})();
```

The account info is returned as JSON.
```json
{ "account_name": "testacc",
  "head_block_num": 1079,
  "head_block_time": "2018-11-10T00:45:53.500",
  "privileged": false,
  "last_code_update": "1970-01-01T00:00:00.000",
  "created": "2018-11-10T00:37:05.000",
  "ram_quota": -1,
  "net_weight": -1,
  "cpu_weight": -1,
  "net_limit": { "used": -1, "available": -1, "max": -1 },
  "cpu_limit": { "used": -1, "available": -1, "max": -1 },
  "ram_usage": 2724,
  "permissions":
   [ { "perm_name": "active", "parent": "owner", "required_auth": [] },
     { "perm_name": "owner", "parent": "", "required_auth": [] } ],
  "total_resources": null,
  "self_delegated_bandwidth": null,
  "refund_request": null,
  "voter_info": null }
```