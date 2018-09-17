import "babel-polyfill";
import { Api } from "./eosjs2-api";
import * as Rpc from "./eosjs2-jsonrpc";
import SignatureProvider from "./eosjs2-jssig";
import * as Serialize from "./eosjs2-serialize";

export { Api, SignatureProvider, Rpc, Serialize };
export default { Api, SignatureProvider, Rpc, Serialize };
