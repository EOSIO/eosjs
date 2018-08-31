import { JsonRpc, RpcError } from "./eosjs2-jsonrpc"

describe("JSON RPC", () => {
  const endpoint = "http://localhost"
  let jsonRpc

  beforeEach(() => {
    fetch.resetMocks()
    jsonRpc = new JsonRpc(endpoint)
  })

  it("throws error bad status", async () => {
    let actMessage = ''
    const expMessage = "Not Found"
    const account_name = "myaccountaaa"
    const expReturn = { data: "12345", message: expMessage }

    fetch.once(JSON.stringify(expReturn), { status: 404 })

    // async / await don't play well with expect().toThrow()
    try {
      await jsonRpc.get_abi(account_name)
    } catch(e) {
      expect(e).toBeInstanceOf(RpcError)
      actMessage = e.message
    }

    expect(actMessage).toEqual(expMessage)
  })

  it("throws error unprocessed", async () => {
    let actMessage = ''
    const expMessage = "Not Processed"
    const account_name = "myaccountaaa"
    const expReturn = { 
      data: "12345", 
      processed: {
        except: {
          message: expMessage
        }
      }
    }

    fetch.once(JSON.stringify(expReturn))

    // async / await don't play well with expect().toThrow()
    try {
      await jsonRpc.get_abi(account_name)
    } catch(e) {
      expect(e).toBeInstanceOf(RpcError)
      actMessage = e.message
    }

    expect(actMessage).toEqual(expMessage)
  })

  it("calls provided fetch instead of default", async () => {
    const expPath = "/v1/chain/get_abi"
    const account_name = "myaccountaaa"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        account_name
      }),
      method: "POST"
    }

    const mockResp = {
      json() {
        return expReturn
      },
      ok: true
    }
    const myFetch = jest.fn()
    myFetch.mockReturnValue(mockResp)
    jsonRpc = new JsonRpc(endpoint, { fetch: myFetch })

    await jsonRpc.get_abi(account_name)

    expect(myFetch).toBeCalledWith(endpoint + expPath, expParams)

  })


  it("calls get_abi", async () => {
    const expPath = "/v1/chain/get_abi"
    const account_name = "myaccountaaa"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        account_name
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_abi(account_name)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_account", async () => {
    const expPath = "/v1/chain/get_account"
    const account_name = "myaccountaaa"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        account_name
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_account(account_name)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_block_header_state", async () => {
    const expPath = "/v1/chain/get_block_header_state"
    const block_num_or_id = 1234
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        block_num_or_id
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_block_header_state(block_num_or_id)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_block", async () => {
    const expPath = "/v1/chain/get_block"
    const block_num_or_id = 1234
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        block_num_or_id
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_block(block_num_or_id)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_code", async () => {
    const expPath = "/v1/chain/get_code"
    const account_name = "myaccountaaa"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        account_name
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_code(account_name)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_currency_balance with all params", async () => {
    const expPath = "/v1/chain/get_currency_balance"
    const code = "morse"
    const account = "myaccountaaa"
    const symbol = "EOS"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        code,
        account,
        symbol
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_currency_balance(code, account, symbol)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_currency_balance with default params", async () => {
    const expPath = "/v1/chain/get_currency_balance"
    const code = "morse"
    const account = "myaccountaaa"
    const symbol = null
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        code,
        account,
        symbol
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_currency_balance(code, account)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_currency_stats with all params", async () => {
    const expPath = "/v1/chain/get_currency_stats"
    const code = "morse"
    const symbol = "EOS"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        code,
        symbol
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_currency_stats(code, symbol)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_info", async () => {
    const expPath = "/v1/chain/get_info"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({}),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_info()

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_producer_schedule", async () => {
    const expPath = "/v1/chain/get_producer_schedule"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({}),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_producer_schedule()

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_producers with all params", async () => {
    const expPath = "/v1/chain/get_producers"
    const json = false
    const lower_bound = "zero"
    const limit = 10
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        json,
        lower_bound,
        limit
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_producers(json, lower_bound, limit)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_producers with default params", async () => {
    const expPath = "/v1/chain/get_producers"
    const json = true
    const lower_bound = ""
    const limit = 50
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        json,
        lower_bound,
        limit
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_producers()

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_raw_code_and_abi", async () => {
    const expPath = "/v1/chain/get_raw_code_and_abi"
    const account_name = "myaccountaaa"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        account_name
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_raw_code_and_abi(account_name)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_table_rows with all params", async () => {
    const expPath = "/v1/chain/get_table_rows"
    const json = false
    const code = "morse"
    const scope = "minty"
    const table = "coffee"
    const table_key = "front_door"
    const lower_bound = "zero"
    const upper_bound = "five"
    const limit = 20
    const expReturn = { data: "12345" }
    const callParams = {
      json,
      code,
      scope,
      table,
      table_key,
      lower_bound,
      upper_bound,
      limit
    }
    const expParams = {
      body: JSON.stringify(callParams),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_table_rows(callParams)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls get_table_rows with default params", async () => {
    const expPath = "/v1/chain/get_table_rows"
    const json = true
    const code = "morse"
    const scope = "minty"
    const table = "coffee"
    const table_key = ""
    const lower_bound = ""
    const upper_bound = ""
    const limit = 10
    const expReturn = { data: "12345" }
    const callParams = {
      code,
      scope,
      table,
    }
    const expParams = {
      body: JSON.stringify({
        json,
        code,
        scope,
        table,
        table_key,
        lower_bound,
        upper_bound,
        limit
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.get_table_rows(callParams)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls getRequiredKeys", async () => {
    const expPath = "/v1/chain/get_required_keys"
    const keys = [ "key1", "key2", "key3"]
    const expReturn = { required_keys: keys }
    const callParams = {
      transaction: "mytxn",
      availableKeys: keys
    }
    const expParams = {
      body: JSON.stringify({
        transaction: callParams.transaction,
        available_keys: callParams.availableKeys
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.getRequiredKeys(callParams)

    expect(response).toEqual(expReturn.required_keys)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls push_transaction", async () => {
    const expPath = "/v1/chain/push_transaction"
    const signatures = [
      "George Washington",
      "John Hancock",
      "Abraham Lincoln"
    ]
    const serializedTransaction = [
      0, 16, 32, 128, 255
    ]
    const limit = 50
    const expReturn = { data: "12345" }
    const callParams = {
      signatures,
      serializedTransaction
    }
    const expParams = {
      body: JSON.stringify({
        signatures,
        compression: 0,
        packed_context_free_data: "",
        packed_trx: "00102080ff"
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.push_transaction(callParams)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls db_size_get", async () => {
    const expPath = "/v1/db_size/get"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({}),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.db_size_get()

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls history_get_actions with all params", async () => {
    const expPath = "/v1/history/get_actions"
    const account_name = "myaccountaaa"
    const pos = 5
    const offset = 10
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        account_name,
        pos,
        offset
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.history_get_actions(account_name, pos, offset)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls history_get_actions with default params", async () => {
    const expPath = "/v1/history/get_actions"
    const account_name = "myaccountaaa"
    const pos = null
    const offset = null
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        account_name,
        pos,
        offset
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.history_get_actions(account_name)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls history_get_transaction with all params", async () => {
    const expPath = "/v1/history/get_transaction"
    const id = "myaccountaaa"
    const block_num_hint = 20
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        id,
        block_num_hint
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.history_get_transaction(id, block_num_hint)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls history_get_transaction with default params", async () => {
    const expPath = "/v1/history/get_transaction"
    const id = "myaccountaaa"
    const block_num_hint = null
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        id,
        block_num_hint
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.history_get_transaction(id)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls history_get_key_accounts", async () => {
    const expPath = "/v1/history/get_key_accounts"
    const public_key = "key12345"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        public_key
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.history_get_key_accounts(public_key)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

  it("calls history_get_controlled_accounts", async () => {
    const expPath = "/v1/history/get_controlled_accounts"
    const controlling_account = "key12345"
    const expReturn = { data: "12345" }
    const expParams = {
      body: JSON.stringify({
        controlling_account
      }),
      method: "POST"
    }

    fetch.once(JSON.stringify(expReturn))

    const response = await jsonRpc.history_get_controlled_accounts(controlling_account)

    expect(response).toEqual(expReturn)
    expect(fetch).toBeCalledWith(endpoint + expPath, expParams)
  })

})
