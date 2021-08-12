import type { CachedAbi } from "../eosjs-api-interfaces";

export const accountName = "eosio.null";
export const value: CachedAbi = {
  rawAbi: new Uint8Array(),
  abi: {
    version: "eosio::abi/1.0",
    types: [],
    structs: [
      {
        name: "nonce",
        base: "",
        fields: [{ name: "value", type: "string" }],
      },
    ],
    actions: [
      {
        name: "nonce",
        type: "nonce",
        ricardian_contract: "",
      },
    ],
    tables: [],
    ricardian_clauses: [],
    abi_extensions: [],
    error_messages: [],
  },
};
export const abi = [accountName, value] as const;
