<h1 class="contract">activate</h1>

---
spec_version: "0.2.0"
title: Activate Protocol Feature
summary: 'Activate protocol feature {{nowrap feature_digest}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/admin.png#9bf1cec664863bd6aaac0f814b235f8799fb02c850e9aa5da34e8a004bd6518e
---

{{$action.account}} activates the protocol feature with a digest of {{feature_digest}}.

<h1 class="contract">canceldelay</h1>

---
spec_version: "0.2.0"
title: Cancel Delayed Transaction
summary: '{{nowrap canceling_auth.actor}} cancels a delayed transaction'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

{{canceling_auth.actor}} cancels the delayed transaction with id {{trx_id}}.

<h1 class="contract">deleteauth</h1>

---
spec_version: "0.2.0"
title: Delete Account Permission
summary: 'Delete the {{nowrap permission}} permission of {{nowrap account}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

Delete the {{permission}} permission of {{account}}.

<h1 class="contract">linkauth</h1>

---
spec_version: "0.2.0"
title: Link Action to Permission
summary: '{{nowrap account}} sets the minimum required permission for the {{#if type}}{{nowrap type}} action of the{{/if}} {{nowrap code}} contract to {{nowrap requirement}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

{{account}} sets the minimum required permission for the {{#if type}}{{type}} action of the{{/if}} {{code}} contract to {{requirement}}.

{{#if type}}{{else}}Any links explicitly associated to specific actions of {{code}} will take precedence.{{/if}}

<h1 class="contract">newaccount</h1>

---
spec_version: "0.2.0"
title: Create New Account
summary: '{{nowrap creator}} creates a new account with the name {{nowrap name}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

{{creator}} creates a new account with the name {{name}} and the following permissions:

owner permission with authority:
{{to_json owner}}

active permission with authority:
{{to_json active}}

<h1 class="contract">reqactivated</h1>

---
spec_version: "0.2.0"
title: Assert Protocol Feature Activation
summary: 'Assert that protocol feature {{nowrap feature_digest}} has been activated'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/admin.png#9bf1cec664863bd6aaac0f814b235f8799fb02c850e9aa5da34e8a004bd6518e
---

Assert that the protocol feature with a digest of {{feature_digest}} has been activated.

<h1 class="contract">reqauth</h1>

---
spec_version: "0.2.0"
title: Assert Authorization
summary: 'Assert that authorization by {{nowrap from}} is provided'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

Assert that authorization by {{from}} is provided.

<h1 class="contract">setabi</h1>

---
spec_version: "0.2.0"
title: Deploy Contract ABI
summary: 'Deploy contract ABI on account {{nowrap account}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

Deploy the ABI file associated with the contract on account {{account}}.

<h1 class="contract">setalimits</h1>

---
spec_version: "0.2.0"
title: Adjust Resource Limits of Account
summary: 'Adjust resource limits of account {{nowrap account}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/admin.png#9bf1cec664863bd6aaac0f814b235f8799fb02c850e9aa5da34e8a004bd6518e
---

{{$action.account}} updates {{account}}’s resource limits to have a RAM quota of {{ram_bytes}} bytes, a NET bandwidth quota of {{net_weight}} and a CPU bandwidth quota of {{cpu_weight}}.

<h1 class="contract">setcode</h1>

---
spec_version: "0.2.0"
title: Deploy Contract Code
summary: 'Deploy contract code on account {{nowrap account}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

Deploy compiled contract code to the account {{account}}.

<h1 class="contract">setparams</h1>

---
spec_version: "0.2.0"
title: Set System Parameters
summary: 'Set system parameters'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/admin.png#9bf1cec664863bd6aaac0f814b235f8799fb02c850e9aa5da34e8a004bd6518e
---

{{$action.account}} sets system parameters to:
{{to_json params}}

<h1 class="contract">setpriv</h1>

---
spec_version: "0.2.0"
title: Make an Account Privileged or Unprivileged
summary: '{{#if is_priv}}Make {{nowrap account}} privileged{{else}}Remove privileged status of {{nowrap account}}{{/if}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/admin.png#9bf1cec664863bd6aaac0f814b235f8799fb02c850e9aa5da34e8a004bd6518e
---

{{#if is_priv}}
{{$action.account}} makes {{account}} privileged.
{{else}}
{{$action.account}} removes privileged status of {{account}}.
{{/if}}

<h1 class="contract">setprods</h1>

---
spec_version: "0.2.0"
title: Set Block Producers
summary: 'Set block producer schedule'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/admin.png#9bf1cec664863bd6aaac0f814b235f8799fb02c850e9aa5da34e8a004bd6518e
---

{{$action.account}} proposes a block producer schedule of:
{{#each schedule}}
  1. {{this.producer_name}} with a block signing key of {{this.block_signing_key}}
{{/each}}

<h1 class="contract">unlinkauth</h1>

---
spec_version: "0.2.0"
title: Unlink Action from Permission
summary: '{{nowrap account}} unsets the minimum required permission for the {{#if type}}{{nowrap type}} action of the{{/if}} {{nowrap code}} contract'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

{{account}} removes the association between the {{#if type}}{{type}} action of the{{/if}} {{code}} contract and its minimum required permission.

{{#if type}}{{else}}This will not remove any links explicitly associated to specific actions of {{code}}.{{/if}}

<h1 class="contract">updateauth</h1>

---
spec_version: "0.2.0"
title: Modify Account Permission
summary: 'Add or update the {{nowrap permission}} permission of {{nowrap account}}'
icon: http://127.0.0.1/ricardian_assets/eosio.contracts/icons/account.png#3d55a2fc3a5c20b456f5657faf666bc25ffd06f4836c5e8256f741149b0b294f
---

Modify, and create if necessary, the {{permission}} permission of {{account}} to have a parent permission of {{parent}} and the following authority:
{{to_json auth}}
