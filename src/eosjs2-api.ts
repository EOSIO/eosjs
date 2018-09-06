// copyright defined in eosjs2/LICENSE.txt

"use strict";

import { Abi, GetInfoResult, JsonRpc, PushTransactionArgs } from "./eosjs2-jsonrpc";
import { base64ToBinary } from "./eosjs2-numeric";
import * as ser from "./eosjs2-serialize";

// tslint:disable-next-line
const abiAbi = require('../src/abi.abi.json');
// tslint:disable-next-line
const transactionAbi = require('../src/transaction.abi.json');

/** Reexport `eosjs2-serialize` */
export const serialize = ser;

/** Arguments to `getRequiredKeys` */
export interface AuthorityProviderArgs {
  /** Transaction that needs to be signed */
  transaction: any;

  /** Public keys associated with the private keys that the `SignatureProvider` holds */
  availableKeys: string[];
}

/** Get subset of `availableKeys` needed to meet authorities in `transaction` */
export interface AuthorityProvider {
  /** Get subset of `availableKeys` needed to meet authorities in `transaction` */
  getRequiredKeys: (args: AuthorityProviderArgs) => Promise<string[]>;
}

export interface BinaryAbi {
  account_name: string;
  abi: Uint8Array;
}

/** Arguments to `sign` */
export interface SignatureProviderArgs {
  /** Chain transaction is for */
  chainId: string;

  /** Public keys associated with the private keys needed to sign the transaction */
  requiredKeys: string[];

  /** Transaction to sign */
  serializedTransaction: Uint8Array;

  /** ABIs for all contracts with actions included in `serializedTransaction` */
  abis: BinaryAbi[];
}

/** Signs transactions */
export interface SignatureProvider {
  /** Public keys associated with the private keys that the `SignatureProvider` holds */
  getAvailableKeys: () => Promise<string[]>;

  /** Sign a transaction */
  sign: (args: SignatureProviderArgs) => Promise<string[]>;
}

/** Holds a fetched abi */
export interface CachedAbi {
  /** abi in binary form */
  rawAbi: Uint8Array;

  /** abi in structured form */
  abi: Abi;
}

export class Api {
  /** Issues RPC calls */
  public rpc: JsonRpc;

  /** Get subset of `availableKeys` needed to meet authorities in a `transaction` */
  public authorityProvider: AuthorityProvider;

  /** Signs transactions */
  public signatureProvider: SignatureProvider;

  /** Identifies chain */
  public chainId: string;

  public textEncoder: TextEncoder;
  public textDecoder: TextDecoder;

  /** Converts abi files between binary and structured form (`abi.abi.json`) */
  public abiTypes: Map<string, ser.Type>;

  /** Converts transactions between binary and structured form (`transaction.abi.json`) */
  public transactionTypes: Map<string, ser.Type>;

  /** Holds information needed to serialize contract actions */
  public contracts = new Map<string, ser.Contract>();

  /** Fetched abis */
  public cachedAbis = new Map<string, CachedAbi>();

  /**
   * @param args
   *    * `rpc`: Issues RPC calls
   *    * `authorityProvider`: Get public keys needed to meet authorities in a transaction
   *    * `signatureProvider`: Signs transactions
   *    * `chainId`: Identifies chain
   *    * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
   *    * `textDecoder`: `TextDecider` instance to use. Pass in `null` if running in a browser
   */
  constructor(args: {
    rpc: JsonRpc,
    authorityProvider?: AuthorityProvider,
    signatureProvider: SignatureProvider,
    chainId: string,
    textEncoder?: TextEncoder,
    textDecoder?: TextDecoder,
  }) {
    this.rpc = args.rpc;
    this.authorityProvider = args.authorityProvider || args.rpc;
    this.signatureProvider = args.signatureProvider;
    this.chainId = args.chainId;
    this.textEncoder = args.textEncoder;
    this.textDecoder = args.textDecoder;

    this.abiTypes = ser.getTypesFromAbi(ser.createInitialTypes(), abiAbi);
    this.transactionTypes = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);
  }

  /** Get abi in both binary and structured forms. Fetch when needed. */
  public async getCachedAbi(accountName: string, reload = false): Promise<CachedAbi> {
    if (!reload && this.cachedAbis.get(accountName)) {
      return this.cachedAbis.get(accountName);
    }
    let cachedAbi: CachedAbi;
    try {
      // todo: use get_raw_abi when it becomes available
      const rawAbi = base64ToBinary((await this.rpc.get_raw_code_and_abi(accountName)).abi);
      const buffer = new ser.SerialBuffer({
        textEncoder: this.textEncoder,
        textDecoder: this.textDecoder,
        array: rawAbi,
      });
      const abi = this.abiTypes.get("abi_def").deserialize(buffer);
      cachedAbi = { rawAbi, abi };
    } catch (e) {
      e.message = `fetching abi for ${accountName}: ${e.message}`;
      throw e;
    }
    if (!cachedAbi) {
      throw new Error(`Missing abi for ${accountName}`);
    }
    this.cachedAbis.set(accountName, cachedAbi);
    return cachedAbi;
  }

  /** Get abi in structured form. Fetch when needed. */
  public async getAbi(accountName: string, reload = false): Promise<Abi> {
    return (await this.getCachedAbi(accountName, reload)).abi;
  }

  /** Get abis needed by a transaction */
  public async getTransactionAbis(transaction: any, reload = false): Promise<BinaryAbi[]> {
    const accounts: string[] = transaction.actions.map((action: ser.Action): string => action.account);
    const uniqueAccounts: Set<string> = new Set(accounts);
    const actionPromises: Array<Promise<BinaryAbi>> = [...uniqueAccounts].map(
      async (account: string): Promise<BinaryAbi> => ({
        account_name: account, abi: (await this.getCachedAbi(account, reload)).rawAbi,
      }));
    return Promise.all(actionPromises);
  }

  /** Get data needed to serialize actions in a contract */
  public async getContract(accountName: string, reload = false): Promise<ser.Contract> {
    if (!reload && this.contracts.get(accountName)) {
      return this.contracts.get(accountName);
    }
    const abi = await this.getAbi(accountName, reload);
    const types = ser.getTypesFromAbi(ser.createInitialTypes(), abi);
    const actions = new Map<string, ser.Type>();
    for (const { name, type } of abi.actions) {
      actions.set(name, ser.getType(types, type));
    }
    const result = { types, actions };
    this.contracts.set(accountName, result);
    return result;
  }

  /** Convert `value` to binary form. `type` must be a built-in abi type or in `transaction.abi.json`. */
  public serialize(buffer: ser.SerialBuffer, type: string, value: any): void {
    this.transactionTypes.get(type).serialize(buffer, value);
  }

  /** Convert data in `buffer` to structured form. `type` must be a built-in abi type or in `transaction.abi.json`. */
  public deserialize(buffer: ser.SerialBuffer, type: string): any {
    return this.transactionTypes.get(type).deserialize(buffer);
  }

  /** Convert a transaction to binary */
  public serializeTransaction(transaction: any): Uint8Array {
    const buffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
    this.serialize(buffer, "transaction", {
      max_net_usage_words: 0,
      max_cpu_usage_ms: 0,
      delay_sec: 0,
      context_free_actions: [],
      actions: [],
      transaction_extensions: [],
      ...transaction,
    });
    return buffer.asUint8Array();
  }

  /** Convert a transaction from binary. Leaves actions in hex. */
  public deserializeTransaction(transaction: Uint8Array): any {
    const buffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
    buffer.pushArray(transaction);
    return this.deserialize(buffer, "transaction");
  }

  /** Convert actions to hex */
  public async serializeActions(actions: ser.Action[]): Promise<ser.SerializedAction[]> {
    return await Promise.all(actions.map(async ({ account, name, authorization, data }) => {
      const contract = await this.getContract(account);
      return ser.serializeAction(contract, account, name, authorization, data, this.textEncoder, this.textDecoder);
    }));
  }

  /** Convert actions from hex */
  public async deserializeActions(actions: ser.Action[]): Promise<ser.Action[]> {
    return await Promise.all(actions.map(async ({ account, name, authorization, data }) => {
      const contract = await this.getContract(account);
      return ser.deserializeAction(contract, account, name, authorization, data, this.textEncoder, this.textDecoder);
    }));
  }

  /** Convert a transaction from binary. Also deserializes actions. */
  public async deserializeTransactionWithActions(transaction: Uint8Array | string): Promise<any> {
    if (typeof transaction === "string") {
      transaction = ser.hexToUint8Array(transaction);
    }
    const deserializedTransaction = this.deserializeTransaction(transaction);
    const deserializedActions = await this.deserializeActions(deserializedTransaction.actions);
    return { ...deserializedTransaction, actions: deserializedActions };
  }

  /**
   * Create and optionally broadcast a transaction.
   *
   * Named Parameters:
   *    * `broadcast`: broadcast this transaction?
   *    * If both `blocksBehind` and `expireSeconds` are present,
   *      then fetch the block which is `blocksBehind` behind head block,
   *      use it as a reference for TAPoS, and expire the transaction `expireSeconds` after that block's time.
   * @returns node response if `broadcast`, `{signatures, serializedTransaction}` if `!broadcast`
   */
  public async transact(transaction: any, { broadcast = true, blocksBehind, expireSeconds }:
      { broadcast?: boolean; blocksBehind?: number; expireSeconds?: number; } = {}): Promise<any> {
    let info: GetInfoResult;

    if (!this.chainId) {
      info = await this.rpc.get_info();
      this.chainId = info.chain_id;
    }

    if (typeof blocksBehind === "number" && expireSeconds) { // use config fields to generate TAPOS if they exist
      if (!info) {
        info = await this.rpc.get_info();
      }
      const refBlock = await this.rpc.get_block(info.head_block_num - blocksBehind);
      transaction = { ...ser.transactionHeader(refBlock, expireSeconds), ...transaction };
    }

    if (!this.hasRequiredTaposFields(transaction)) {
      throw new Error("Required configuration or TAPOS fields are not present");
    }

    const abis: BinaryAbi[] = await this.getTransactionAbis(transaction);
    transaction = { ...transaction, actions: await this.serializeActions(transaction.actions) };
    const serializedTransaction = this.serializeTransaction(transaction);
    const availableKeys = await this.signatureProvider.getAvailableKeys();
    const requiredKeys = await this.authorityProvider.getRequiredKeys({ transaction, availableKeys });
    const signatures = await this.signatureProvider.sign({
      chainId: this.chainId,
      requiredKeys,
      serializedTransaction,
      abis,
    });
    const pushTransactionArgs = { signatures, serializedTransaction };
    if (broadcast) {
      return this.pushSignedTransaction(pushTransactionArgs);
    }
    return pushTransactionArgs;
  }

  /** Broadcast a signed transaction */
  public async pushSignedTransaction({ signatures, serializedTransaction }: PushTransactionArgs): Promise<any> {
    return this.rpc.push_transaction({
      signatures,
      serializedTransaction,
    });
  }

  // eventually break out into TransactionValidator class
  private hasRequiredTaposFields({ expiration, ref_block_num, ref_block_prefix, ...transaction }: any): boolean {
    return !!(expiration && ref_block_num && ref_block_prefix);
  }

} // Api
