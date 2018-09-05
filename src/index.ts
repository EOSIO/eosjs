import "babel-polyfill";
import { Api } from "./eosjs2-api";
import * as Rpc from "./eosjs2-jsonrpc";
import SignatureProvider from "./eosjs2-jssig";

export { Api, SignatureProvider, Rpc };
export default { Api, SignatureProvider, Rpc };
