To create a new account submit three actions to the `eosio` account using the `actions` array as shown in [how-to-submit-a-transaction](01_how-to-submit-a-transaction.md).

## newaccount
The first action is the [`newaccount`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.system/include/eosio.system/native.hpp#L178) action.  In the example shown below `useraaaaaaaa` creates new account `mynewaccount` with owner and active public key `PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu`.  Ideally, these should be different public keys.

```javascript
  {
    account: 'eosio',
    name: 'newaccount',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      creator: 'useraaaaaaaa',
      name: 'mynewaccount',
      owner: {
        threshold: 1,
        keys: [{
          key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
          weight: 1
        }],
        accounts: [],
        waits: []
      },
      active: {
        threshold: 1,
        keys: [{
          key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
          weight: 1
        }],
        accounts: [],
        waits: []
      },
    }
  }
```

## buyrambytes
The second action is the [`buyrambytes`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.system/include/eosio.system/eosio.system.hpp#L1028) action.  In the example shown below `useraaaaaaaa` pays for **8192** bytes of RAM for the account `mynewaccount` created in the [first action](#newaccount).

```javascript
  {
    account: 'eosio',
    name: 'buyrambytes',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      payer: 'useraaaaaaaa',
      receiver: 'mynewaccount',
      bytes: 8192,
    },
  }
```

## delegatebw
The third action is the [`delegatebw`](https://github.com/EOSIO/eosio.contracts/blob/52fbd4ac7e6c38c558302c48d00469a4bed35f7c/contracts/eosio.system/include/eosio.system/eosio.system.hpp#L692) action.  In the example shown below `useraaaaaaaa` delegates **1.0000 SYS** of NET and CPU to the account `mynewaccount` created in the [first action](#newaccount).
```javascript
  {
    account: 'eosio',
    name: 'delegatebw',
    authorization: [{
      actor: 'useraaaaaaaa',
      permission: 'active',
    }],
    data: {
      from: 'useraaaaaaaa',
      receiver: 'mynewaccount',
      stake_net_quantity: '1.0000 SYS',
      stake_cpu_quantity: '1.0000 SYS',
      transfer: false,
    }
  }
```

## Create An Account
Below the three actions are submitted as one transaction using the `Api` object.

```javascript
(async () => {
  await api.transact({
    actions: [{
      account: 'eosio',
      name: 'newaccount',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        creator: 'useraaaaaaaa',
        name: 'mynewaccount',
        owner: {
          threshold: 1,
          keys: [{
            key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: 'PUB_R1_6FPFZqw5ahYrR9jD96yDbbDNTdKtNqRbze6oTDLntrsANgQKZu',
            weight: 1
          }],
          accounts: [],
          waits: []
        },
      },
    },
    {
      account: 'eosio',
      name: 'buyrambytes',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        payer: 'useraaaaaaaa',
        receiver: 'mynewaccount',
        bytes: 8192,
      },
    },
    {
      account: 'eosio',
      name: 'delegatebw',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        from: 'useraaaaaaaa',
        receiver: 'mynewaccount',
        stake_net_quantity: '1.0000 SYS',
        stake_cpu_quantity: '1.0000 SYS',
        transfer: false,
      }
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
```