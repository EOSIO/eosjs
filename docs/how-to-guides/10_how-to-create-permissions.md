To create new permissions, [submit a transaction](01_how-to-submit-a-transaction.md) to the [`updateauth`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.bios/include/eosio.bios/eosio.bios.hpp#L205) action of the `eosio` account.

In the example shown below `useraaaaaaaa` creates a new permission called `my_new_permission` on the account `useraaaaaaaa`, with the public key `PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu`.
```javascript
const authorization_object = { 
  threshold: 1, 
  accounts: [{
    permission: {
      actor: "useraaaaaaaa", 
      permission: "active"
    }, 
    weight: 1 
  }], 
  keys: [{ 
    key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu', 
    weight: 1 
  }],
  waits: []
};

const updateauth_input = {
  account: 'useraaaaaaaa',
  permission: 'my_new_permission',
  parent: 'active',
  auth: authorization_object
};

(async () => {
  await api.transact({
    actions: [
    {
      account: 'eosio',
      name: 'updateauth',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: updateauth_input,
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
```
You can check that the new permission exists on the account using [`get_account`](07_how-to-get-account-information.md)