var eosjs =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/eosjs-api.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/abi.abi.json":
/*!**************************!*\
  !*** ./src/abi.abi.json ***!
  \**************************/
/*! exports provided: version, structs, default */
/***/ (function(module) {

module.exports = {"version":"eosio::abi/1.1","structs":[{"name":"extensions_entry","base":"","fields":[{"name":"tag","type":"uint16"},{"name":"value","type":"bytes"}]},{"name":"type_def","base":"","fields":[{"name":"new_type_name","type":"string"},{"name":"type","type":"string"}]},{"name":"field_def","base":"","fields":[{"name":"name","type":"string"},{"name":"type","type":"string"}]},{"name":"struct_def","base":"","fields":[{"name":"name","type":"string"},{"name":"base","type":"string"},{"name":"fields","type":"field_def[]"}]},{"name":"action_def","base":"","fields":[{"name":"name","type":"name"},{"name":"type","type":"string"},{"name":"ricardian_contract","type":"string"}]},{"name":"table_def","base":"","fields":[{"name":"name","type":"name"},{"name":"index_type","type":"string"},{"name":"key_names","type":"string[]"},{"name":"key_types","type":"string[]"},{"name":"type","type":"string"}]},{"name":"clause_pair","base":"","fields":[{"name":"id","type":"string"},{"name":"body","type":"string"}]},{"name":"error_message","base":"","fields":[{"name":"error_code","type":"uint64"},{"name":"error_msg","type":"string"}]},{"name":"variant_def","base":"","fields":[{"name":"name","type":"string"},{"name":"types","type":"string[]"}]},{"name":"abi_def","base":"","fields":[{"name":"version","type":"string"},{"name":"types","type":"type_def[]"},{"name":"structs","type":"struct_def[]"},{"name":"actions","type":"action_def[]"},{"name":"tables","type":"table_def[]"},{"name":"ricardian_clauses","type":"clause_pair[]"},{"name":"error_messages","type":"error_message[]"},{"name":"abi_extensions","type":"extensions_entry[]"},{"name":"variants","type":"variant_def[]$"}]}]};

/***/ }),

/***/ "./src/eosjs-api.ts":
/*!**************************!*\
  !*** ./src/eosjs-api.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module API
 */
// copyright defined in eosjs/LICENSE.txt

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eosjs_numeric_1 = __webpack_require__(/*! ./eosjs-numeric */ "./src/eosjs-numeric.ts");
var ser = __webpack_require__(/*! ./eosjs-serialize */ "./src/eosjs-serialize.ts");
// tslint:disable-next-line
var abiAbi = __webpack_require__(/*! ../src/abi.abi.json */ "./src/abi.abi.json");
// tslint:disable-next-line
var transactionAbi = __webpack_require__(/*! ../src/transaction.abi.json */ "./src/transaction.abi.json");
/** Reexport `eosjs-serialize` */
exports.serialize = ser;
var Api = /** @class */ (function () {
    /**
     * @param args
     *    * `rpc`: Issues RPC calls
     *    * `authorityProvider`: Get public keys needed to meet authorities in a transaction
     *    * `signatureProvider`: Signs transactions
     *    * `chainId`: Identifies chain
     *    * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     *    * `textDecoder`: `TextDecider` instance to use. Pass in `null` if running in a browser
     */
    function Api(args) {
        /** Holds information needed to serialize contract actions */
        this.contracts = new Map();
        /** Fetched abis */
        this.cachedAbis = new Map();
        this.rpc = args.rpc;
        this.authorityProvider = args.authorityProvider || args.rpc;
        this.signatureProvider = args.signatureProvider;
        this.chainId = args.chainId;
        this.textEncoder = args.textEncoder;
        this.textDecoder = args.textDecoder;
        this.abiTypes = ser.getTypesFromAbi(ser.createInitialTypes(), abiAbi);
        this.transactionTypes = ser.getTypesFromAbi(ser.createInitialTypes(), transactionAbi);
    }
    /** Decodes an abi as Uint8Array into json. */
    Api.prototype.rawAbiToJson = function (rawAbi) {
        var buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
            array: rawAbi,
        });
        if (!ser.supportedAbiVersion(buffer.getString())) {
            throw new Error("Unsupported abi version");
        }
        buffer.restartRead();
        return this.abiTypes.get("abi_def").deserialize(buffer);
    };
    /** Get abi in both binary and structured forms. Fetch when needed. */
    Api.prototype.getCachedAbi = function (accountName, reload) {
        if (reload === void 0) { reload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var cachedAbi, rawAbi, _a, abi, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!reload && this.cachedAbis.get(accountName)) {
                            return [2 /*return*/, this.cachedAbis.get(accountName)];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = eosjs_numeric_1.base64ToBinary;
                        return [4 /*yield*/, this.rpc.get_raw_code_and_abi(accountName)];
                    case 2:
                        rawAbi = _a.apply(void 0, [(_b.sent()).abi]);
                        abi = this.rawAbiToJson(rawAbi);
                        cachedAbi = { rawAbi: rawAbi, abi: abi };
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        e_1.message = "fetching abi for " + accountName + ": " + e_1.message;
                        throw e_1;
                    case 4:
                        if (!cachedAbi) {
                            throw new Error("Missing abi for " + accountName);
                        }
                        this.cachedAbis.set(accountName, cachedAbi);
                        return [2 /*return*/, cachedAbi];
                }
            });
        });
    };
    /** Get abi in structured form. Fetch when needed. */
    Api.prototype.getAbi = function (accountName, reload) {
        if (reload === void 0) { reload = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCachedAbi(accountName, reload)];
                    case 1: return [2 /*return*/, (_a.sent()).abi];
                }
            });
        });
    };
    /** Get abis needed by a transaction */
    Api.prototype.getTransactionAbis = function (transaction, reload) {
        if (reload === void 0) { reload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var accounts, uniqueAccounts, actionPromises;
            var _this = this;
            return __generator(this, function (_a) {
                accounts = transaction.actions.map(function (action) { return action.account; });
                uniqueAccounts = new Set(accounts);
                actionPromises = __spread(uniqueAccounts).map(function (account) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = {
                                    account_name: account
                                };
                                return [4 /*yield*/, this.getCachedAbi(account, reload)];
                            case 1: return [2 /*return*/, (_a.abi = (_b.sent()).rawAbi,
                                    _a)];
                        }
                    });
                }); });
                return [2 /*return*/, Promise.all(actionPromises)];
            });
        });
    };
    /** Get data needed to serialize actions in a contract */
    Api.prototype.getContract = function (accountName, reload) {
        if (reload === void 0) { reload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var e_2, _a, abi, types, actions, _b, _c, _d, name_1, type, result;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!reload && this.contracts.get(accountName)) {
                            return [2 /*return*/, this.contracts.get(accountName)];
                        }
                        return [4 /*yield*/, this.getAbi(accountName, reload)];
                    case 1:
                        abi = _e.sent();
                        types = ser.getTypesFromAbi(ser.createInitialTypes(), abi);
                        actions = new Map();
                        try {
                            for (_b = __values(abi.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
                                _d = _c.value, name_1 = _d.name, type = _d.type;
                                actions.set(name_1, ser.getType(types, type));
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        result = { types: types, actions: actions };
                        this.contracts.set(accountName, result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /** Convert `value` to binary form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    Api.prototype.serialize = function (buffer, type, value) {
        this.transactionTypes.get(type).serialize(buffer, value);
    };
    /** Convert data in `buffer` to structured form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    Api.prototype.deserialize = function (buffer, type) {
        return this.transactionTypes.get(type).deserialize(buffer);
    };
    /** Convert a transaction to binary */
    Api.prototype.serializeTransaction = function (transaction) {
        var buffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
        this.serialize(buffer, "transaction", __assign({ max_net_usage_words: 0, max_cpu_usage_ms: 0, delay_sec: 0, context_free_actions: [], actions: [], transaction_extensions: [] }, transaction));
        return buffer.asUint8Array();
    };
    /** Convert a transaction from binary. Leaves actions in hex. */
    Api.prototype.deserializeTransaction = function (transaction) {
        var buffer = new ser.SerialBuffer({ textEncoder: this.textEncoder, textDecoder: this.textDecoder });
        buffer.pushArray(transaction);
        return this.deserialize(buffer, "transaction");
    };
    /** Convert actions to hex */
    Api.prototype.serializeActions = function (actions) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(actions.map(function (_a) {
                            var account = _a.account, name = _a.name, authorization = _a.authorization, data = _a.data;
                            return __awaiter(_this, void 0, void 0, function () {
                                var contract;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.getContract(account)];
                                        case 1:
                                            contract = _b.sent();
                                            return [2 /*return*/, ser.serializeAction(contract, account, name, authorization, data, this.textEncoder, this.textDecoder)];
                                    }
                                });
                            });
                        }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /** Convert actions from hex */
    Api.prototype.deserializeActions = function (actions) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(actions.map(function (_a) {
                            var account = _a.account, name = _a.name, authorization = _a.authorization, data = _a.data;
                            return __awaiter(_this, void 0, void 0, function () {
                                var contract;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.getContract(account)];
                                        case 1:
                                            contract = _b.sent();
                                            return [2 /*return*/, ser.deserializeAction(contract, account, name, authorization, data, this.textEncoder, this.textDecoder)];
                                    }
                                });
                            });
                        }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /** Convert a transaction from binary. Also deserializes actions. */
    Api.prototype.deserializeTransactionWithActions = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var deserializedTransaction, deserializedActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof transaction === "string") {
                            transaction = ser.hexToUint8Array(transaction);
                        }
                        deserializedTransaction = this.deserializeTransaction(transaction);
                        return [4 /*yield*/, this.deserializeActions(deserializedTransaction.actions)];
                    case 1:
                        deserializedActions = _a.sent();
                        return [2 /*return*/, __assign({}, deserializedTransaction, { actions: deserializedActions })];
                }
            });
        });
    };
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
    Api.prototype.transact = function (transaction, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.broadcast, broadcast = _c === void 0 ? true : _c, blocksBehind = _b.blocksBehind, expireSeconds = _b.expireSeconds;
        return __awaiter(this, void 0, void 0, function () {
            var info, refBlock, abis, _d, _e, serializedTransaction, availableKeys, requiredKeys, signatures, pushTransactionArgs;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!!this.chainId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.rpc.get_info()];
                    case 1:
                        info = _f.sent();
                        this.chainId = info.chain_id;
                        _f.label = 2;
                    case 2:
                        if (!(typeof blocksBehind === "number" && expireSeconds)) return [3 /*break*/, 6];
                        if (!!info) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.rpc.get_info()];
                    case 3:
                        info = _f.sent();
                        _f.label = 4;
                    case 4: return [4 /*yield*/, this.rpc.get_block(info.head_block_num - blocksBehind)];
                    case 5:
                        refBlock = _f.sent();
                        transaction = __assign({}, ser.transactionHeader(refBlock, expireSeconds), transaction);
                        _f.label = 6;
                    case 6:
                        if (!this.hasRequiredTaposFields(transaction)) {
                            throw new Error("Required configuration or TAPOS fields are not present");
                        }
                        return [4 /*yield*/, this.getTransactionAbis(transaction)];
                    case 7:
                        abis = _f.sent();
                        _d = [{}, transaction];
                        _e = {};
                        return [4 /*yield*/, this.serializeActions(transaction.actions)];
                    case 8:
                        transaction = __assign.apply(void 0, _d.concat([(_e.actions = _f.sent(), _e)]));
                        serializedTransaction = this.serializeTransaction(transaction);
                        return [4 /*yield*/, this.signatureProvider.getAvailableKeys()];
                    case 9:
                        availableKeys = _f.sent();
                        return [4 /*yield*/, this.authorityProvider.getRequiredKeys({ transaction: transaction, availableKeys: availableKeys })];
                    case 10:
                        requiredKeys = _f.sent();
                        return [4 /*yield*/, this.signatureProvider.sign({
                                chainId: this.chainId,
                                requiredKeys: requiredKeys,
                                serializedTransaction: serializedTransaction,
                                abis: abis,
                            })];
                    case 11:
                        signatures = _f.sent();
                        pushTransactionArgs = { signatures: signatures, serializedTransaction: serializedTransaction };
                        if (broadcast) {
                            return [2 /*return*/, this.pushSignedTransaction(pushTransactionArgs)];
                        }
                        return [2 /*return*/, pushTransactionArgs];
                }
            });
        });
    };
    /** Broadcast a signed transaction */
    Api.prototype.pushSignedTransaction = function (_a) {
        var signatures = _a.signatures, serializedTransaction = _a.serializedTransaction;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.rpc.push_transaction({
                        signatures: signatures,
                        serializedTransaction: serializedTransaction,
                    })];
            });
        });
    };
    // eventually break out into TransactionValidator class
    Api.prototype.hasRequiredTaposFields = function (_a) {
        var expiration = _a.expiration, ref_block_num = _a.ref_block_num, ref_block_prefix = _a.ref_block_prefix, transaction = __rest(_a, ["expiration", "ref_block_num", "ref_block_prefix"]);
        return !!(expiration && ref_block_num && ref_block_prefix);
    };
    return Api;
}()); // Api
exports.Api = Api;


/***/ }),

/***/ "./src/eosjs-numeric.ts":
/*!******************************!*\
  !*** ./src/eosjs-numeric.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module Numeric
 */
// copyright defined in eosjs/LICENSE.txt

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
var ripemd160 = __webpack_require__(/*! ./ripemd */ "./src/ripemd.js").RIPEMD160.hash;
var base58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function create_base58_map() {
    var base58M = Array(256).fill(-1);
    for (var i = 0; i < base58Chars.length; ++i) {
        base58M[base58Chars.charCodeAt(i)] = i;
    }
    return base58M;
}
var base58Map = create_base58_map();
function create_base64_map() {
    var base64M = Array(256).fill(-1);
    for (var i = 0; i < base64Chars.length; ++i) {
        base64M[base64Chars.charCodeAt(i)] = i;
    }
    base64M["=".charCodeAt(0)] = 0;
    return base64M;
}
var base64Map = create_base64_map();
/** Is `bignum` a negative number? */
function isNegative(bignum) {
    return (bignum[bignum.length - 1] & 0x80) !== 0;
}
exports.isNegative = isNegative;
/** Negate `bignum` */
function negate(bignum) {
    var carry = 1;
    for (var i = 0; i < bignum.length; ++i) {
        var x = (~bignum[i] & 0xff) + carry;
        bignum[i] = x;
        carry = x >> 8;
    }
}
exports.negate = negate;
/**
 * Convert an unsigned decimal number in `s` to a bignum
 * @param size bignum size (bytes)
 */
function decimalToBinary(size, s) {
    var result = new Uint8Array(size);
    for (var i = 0; i < s.length; ++i) {
        var srcDigit = s.charCodeAt(i);
        if (srcDigit < "0".charCodeAt(0) || srcDigit > "9".charCodeAt(0)) {
            throw new Error("invalid number");
        }
        var carry = srcDigit - "0".charCodeAt(0);
        for (var j = 0; j < size; ++j) {
            var x = result[j] * 10 + carry;
            result[j] = x;
            carry = x >> 8;
        }
        if (carry) {
            throw new Error("number is out of range");
        }
    }
    return result;
}
exports.decimalToBinary = decimalToBinary;
/**
 * Convert a signed decimal number in `s` to a bignum
 * @param size bignum size (bytes)
 */
function signedDecimalToBinary(size, s) {
    var negative = s[0] === "-";
    if (negative) {
        s = s.substr(1);
    }
    var result = decimalToBinary(size, s);
    if (negative) {
        negate(result);
        if (!isNegative(result)) {
            throw new Error("number is out of range");
        }
    }
    else if (isNegative(result)) {
        throw new Error("number is out of range");
    }
    return result;
}
exports.signedDecimalToBinary = signedDecimalToBinary;
/**
 * Convert `bignum` to an unsigned decimal number
 * @param minDigits 0-pad result to this many digits
 */
function binaryToDecimal(bignum, minDigits) {
    if (minDigits === void 0) { minDigits = 1; }
    var result = Array(minDigits).fill("0".charCodeAt(0));
    for (var i = bignum.length - 1; i >= 0; --i) {
        var carry = bignum[i];
        for (var j = 0; j < result.length; ++j) {
            var x = ((result[j] - "0".charCodeAt(0)) << 8) + carry;
            result[j] = "0".charCodeAt(0) + x % 10;
            carry = (x / 10) | 0;
        }
        while (carry) {
            result.push("0".charCodeAt(0) + carry % 10);
            carry = (carry / 10) | 0;
        }
    }
    result.reverse();
    return String.fromCharCode.apply(String, __spread(result));
}
exports.binaryToDecimal = binaryToDecimal;
/**
 * Convert `bignum` to a signed decimal number
 * @param minDigits 0-pad result to this many digits
 */
function signedBinaryToDecimal(bignum, minDigits) {
    if (minDigits === void 0) { minDigits = 1; }
    if (isNegative(bignum)) {
        var x = bignum.slice();
        negate(x);
        return "-" + binaryToDecimal(x, minDigits);
    }
    return binaryToDecimal(bignum, minDigits);
}
exports.signedBinaryToDecimal = signedBinaryToDecimal;
/**
 * Convert an unsigned base-58 number in `s` to a bignum
 * @param size bignum size (bytes)
 */
function base58ToBinary(size, s) {
    var result = new Uint8Array(size);
    for (var i = 0; i < s.length; ++i) {
        var carry = base58Map[s.charCodeAt(i)];
        if (carry < 0) {
            throw new Error("invalid base-58 value");
        }
        for (var j = 0; j < size; ++j) {
            var x = result[j] * 58 + carry;
            result[j] = x;
            carry = x >> 8;
        }
        if (carry) {
            throw new Error("base-58 value is out of range");
        }
    }
    result.reverse();
    return result;
}
exports.base58ToBinary = base58ToBinary;
/**
 * Convert `bignum` to a base-58 number
 * @param minDigits 0-pad result to this many digits
 */
function binaryToBase58(bignum, minDigits) {
    if (minDigits === void 0) { minDigits = 1; }
    var e_1, _a, e_2, _b;
    var result = [];
    try {
        for (var bignum_1 = __values(bignum), bignum_1_1 = bignum_1.next(); !bignum_1_1.done; bignum_1_1 = bignum_1.next()) {
            var byte = bignum_1_1.value;
            var carry = byte;
            for (var j = 0; j < result.length; ++j) {
                var x = (base58Map[result[j]] << 8) + carry;
                result[j] = base58Chars.charCodeAt(x % 58);
                carry = (x / 58) | 0;
            }
            while (carry) {
                result.push(base58Chars.charCodeAt(carry % 58));
                carry = (carry / 58) | 0;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (bignum_1_1 && !bignum_1_1.done && (_a = bignum_1.return)) _a.call(bignum_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var bignum_2 = __values(bignum), bignum_2_1 = bignum_2.next(); !bignum_2_1.done; bignum_2_1 = bignum_2.next()) {
            var byte = bignum_2_1.value;
            if (byte) {
                break;
            }
            else {
                result.push("1".charCodeAt(0));
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (bignum_2_1 && !bignum_2_1.done && (_b = bignum_2.return)) _b.call(bignum_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    result.reverse();
    return String.fromCharCode.apply(String, __spread(result));
}
exports.binaryToBase58 = binaryToBase58;
/** Convert an unsigned base-64 number in `s` to a bignum */
function base64ToBinary(s) {
    var len = s.length;
    if ((len & 3) === 1 && s[len - 1] === "=") {
        len -= 1;
    } // fc appends an extra '='
    if ((len & 3) !== 0) {
        throw new Error("base-64 value is not padded correctly");
    }
    var groups = len >> 2;
    var bytes = groups * 3;
    if (len > 0 && s[len - 1] === "=") {
        if (s[len - 2] === "=") {
            bytes -= 2;
        }
        else {
            bytes -= 1;
        }
    }
    var result = new Uint8Array(bytes);
    for (var group = 0; group < groups; ++group) {
        var digit0 = base64Map[s.charCodeAt(group * 4 + 0)];
        var digit1 = base64Map[s.charCodeAt(group * 4 + 1)];
        var digit2 = base64Map[s.charCodeAt(group * 4 + 2)];
        var digit3 = base64Map[s.charCodeAt(group * 4 + 3)];
        result[group * 3 + 0] = (digit0 << 2) | (digit1 >> 4);
        if (group * 3 + 1 < bytes) {
            result[group * 3 + 1] = ((digit1 & 15) << 4) | (digit2 >> 2);
        }
        if (group * 3 + 2 < bytes) {
            result[group * 3 + 2] = ((digit2 & 3) << 6) | digit3;
        }
    }
    return result;
}
exports.base64ToBinary = base64ToBinary;
/** Public key data size, excluding type field */
exports.publicKeyDataSize = 33;
/** Private key data size, excluding type field */
exports.privateKeyDataSize = 32;
/** Signature data size, excluding type field */
exports.signatureDataSize = 65;
function digestSuffixRipemd160(data, suffix) {
    var d = new Uint8Array(data.length + suffix.length);
    for (var i = 0; i < data.length; ++i) {
        d[i] = data[i];
    }
    for (var i = 0; i < suffix.length; ++i) {
        d[data.length + i] = suffix.charCodeAt(i);
    }
    return ripemd160(d);
}
function stringToKey(s, type, size, suffix) {
    var whole = base58ToBinary(size + 4, s);
    var result = { type: type, data: new Uint8Array(whole.buffer, 0, size) };
    var digest = new Uint8Array(digestSuffixRipemd160(result.data, suffix));
    if (digest[0] !== whole[size + 0] || digest[1] !== whole[size + 1]
        || digest[2] !== whole[size + 2] || digest[3] !== whole[size + 3]) {
        throw new Error("checksum doesn't match");
    }
    return result;
}
function keyToString(key, suffix, prefix) {
    var digest = new Uint8Array(digestSuffixRipemd160(key.data, suffix));
    var whole = new Uint8Array(key.data.length + 4);
    for (var i = 0; i < key.data.length; ++i) {
        whole[i] = key.data[i];
    }
    for (var i = 0; i < 4; ++i) {
        whole[i + key.data.length] = digest[i];
    }
    return prefix + binaryToBase58(whole);
}
/** Convert key in `s` to binary form */
function stringToPublicKey(s) {
    if (typeof s !== "string") {
        throw new Error("expected string containing public key");
    }
    if (s.substr(0, 3) === "EOS") {
        var whole = base58ToBinary(exports.publicKeyDataSize + 4, s.substr(3));
        var key = { type: 0 /* k1 */, data: new Uint8Array(exports.publicKeyDataSize) };
        for (var i = 0; i < exports.publicKeyDataSize; ++i) {
            key.data[i] = whole[i];
        }
        var digest = new Uint8Array(ripemd160(key.data));
        if (digest[0] !== whole[exports.publicKeyDataSize] || digest[1] !== whole[34]
            || digest[2] !== whole[35] || digest[3] !== whole[36]) {
            throw new Error("checksum doesn't match");
        }
        return key;
    }
    else if (s.substr(0, 7) === "PUB_K1_") {
        return stringToKey(s.substr(7), 0 /* k1 */, exports.publicKeyDataSize, "K1");
    }
    else if (s.substr(0, 7) === "PUB_R1_") {
        return stringToKey(s.substr(7), 1 /* r1 */, exports.publicKeyDataSize, "R1");
    }
    else {
        throw new Error("unrecognized public key format");
    }
}
exports.stringToPublicKey = stringToPublicKey;
/** Convert `key` to string (base-58) form */
function publicKeyToString(key) {
    if (key.type === 0 /* k1 */ && key.data.length === exports.publicKeyDataSize) {
        return keyToString(key, "K1", "PUB_K1_");
    }
    else if (key.type === 1 /* r1 */ && key.data.length === exports.publicKeyDataSize) {
        return keyToString(key, "R1", "PUB_R1_");
    }
    else {
        throw new Error("unrecognized public key format");
    }
}
exports.publicKeyToString = publicKeyToString;
/** If a key is in the legacy format (`EOS` prefix), then convert it to the new format (`PUB_K1_`).
 * Leaves other formats untouched
 */
function convertLegacyPublicKey(s) {
    if (s.substr(0, 3) === "EOS") {
        return publicKeyToString(stringToPublicKey(s));
    }
    return s;
}
exports.convertLegacyPublicKey = convertLegacyPublicKey;
/** If a key is in the legacy format (`EOS` prefix), then convert it to the new format (`PUB_K1_`).
 * Leaves other formats untouched
 */
function convertLegacyPublicKeys(keys) {
    return keys.map(convertLegacyPublicKey);
}
exports.convertLegacyPublicKeys = convertLegacyPublicKeys;
/** Convert key in `s` to binary form */
function stringToPrivateKey(s) {
    if (typeof s !== "string") {
        throw new Error("expected string containing private key");
    }
    if (s.substr(0, 7) === "PVT_R1_") {
        return stringToKey(s.substr(7), 1 /* r1 */, exports.privateKeyDataSize, "R1");
    }
    else {
        throw new Error("unrecognized private key format");
    }
}
exports.stringToPrivateKey = stringToPrivateKey;
/** Convert `key` to string (base-58) form */
function privateKeyToString(key) {
    if (key.type === 1 /* r1 */) {
        return keyToString(key, "R1", "PVT_R1_");
    }
    else {
        throw new Error("unrecognized private key format");
    }
}
exports.privateKeyToString = privateKeyToString;
/** Convert key in `s` to binary form */
function stringToSignature(s) {
    if (typeof s !== "string") {
        throw new Error("expected string containing signature");
    }
    if (s.substr(0, 7) === "SIG_K1_") {
        return stringToKey(s.substr(7), 0 /* k1 */, exports.signatureDataSize, "K1");
    }
    else if (s.substr(0, 7) === "SIG_R1_") {
        return stringToKey(s.substr(7), 1 /* r1 */, exports.signatureDataSize, "R1");
    }
    else {
        throw new Error("unrecognized signature format");
    }
}
exports.stringToSignature = stringToSignature;
/** Convert `signature` to string (base-58) form */
function signatureToString(signature) {
    if (signature.type === 0 /* k1 */) {
        return keyToString(signature, "K1", "SIG_K1_");
    }
    else if (signature.type === 1 /* r1 */) {
        return keyToString(signature, "R1", "SIG_R1_");
    }
    else {
        throw new Error("unrecognized signature format");
    }
}
exports.signatureToString = signatureToString;


/***/ }),

/***/ "./src/eosjs-serialize.ts":
/*!********************************!*\
  !*** ./src/eosjs-serialize.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module Serialize
 */
// copyright defined in eosjs/LICENSE.txt

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var numeric = __webpack_require__(/*! ./eosjs-numeric */ "./src/eosjs-numeric.ts");
/** State for serialize() and deserialize() */
var SerializerState = /** @class */ (function () {
    function SerializerState() {
        /** Have any binary extensions been skipped? */
        this.skippedBinaryExtension = false;
    }
    return SerializerState;
}());
exports.SerializerState = SerializerState;
/** Serialize and deserialize data */
var SerialBuffer = /** @class */ (function () {
    /**
     * @param __namedParameters
     *    * `array`: `null` if serializing, or binary data to deserialize
     *    * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     *    * `textDecoder`: `TextDecider` instance to use. Pass in `null` if running in a browser
     */
    function SerialBuffer(_a) {
        var _b = _a === void 0 ? {} : _a, textEncoder = _b.textEncoder, textDecoder = _b.textDecoder, array = _b.array;
        /** Current position while reading (deserializing) */
        this.readPos = 0;
        this.array = array || new Uint8Array(1024);
        this.length = array ? array.length : 0;
        this.textEncoder = textEncoder || new TextEncoder();
        this.textDecoder = textDecoder || new TextDecoder("utf-8", { fatal: true });
    }
    /** Resize `array` if needed to have at least `size` bytes free */
    SerialBuffer.prototype.reserve = function (size) {
        if (this.length + size <= this.array.length) {
            return;
        }
        var l = this.array.length;
        while (this.length + size > l) {
            l = Math.ceil(l * 1.5);
        }
        var newArray = new Uint8Array(l);
        newArray.set(this.array);
        this.array = newArray;
    };
    /** Is there data available to read? */
    SerialBuffer.prototype.haveReadData = function () {
        return this.readPos < this.length;
    };
    /** Restart reading from the beginning */
    SerialBuffer.prototype.restartRead = function () {
        this.readPos = 0;
    };
    /** Return data with excess storage trimmed away */
    SerialBuffer.prototype.asUint8Array = function () {
        return new Uint8Array(this.array.buffer, 0, this.length);
    };
    /** Append bytes */
    SerialBuffer.prototype.pushArray = function (v) {
        this.reserve(v.length);
        this.array.set(v, this.length);
        this.length += v.length;
    };
    /** Append bytes */
    SerialBuffer.prototype.push = function () {
        var v = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            v[_i] = arguments[_i];
        }
        this.pushArray(v);
    };
    /** Get a single byte */
    SerialBuffer.prototype.get = function () {
        if (this.readPos < this.length) {
            return this.array[this.readPos++];
        }
        throw new Error("Read past end of buffer");
    };
    /** Append bytes in `v`. Throws if `len` doesn't match `v.length` */
    SerialBuffer.prototype.pushUint8ArrayChecked = function (v, len) {
        if (v.length !== len) {
            throw new Error("Binary data has incorrect size");
        }
        this.pushArray(v);
    };
    /** Get `len` bytes */
    SerialBuffer.prototype.getUint8Array = function (len) {
        if (this.readPos + len > this.length) {
            throw new Error("Read past end of buffer");
        }
        var result = new Uint8Array(this.array.buffer, this.readPos, len);
        this.readPos += len;
        return result;
    };
    /** Append a `uint16` */
    SerialBuffer.prototype.pushUint16 = function (v) {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff);
    };
    /** Get a `uint16` */
    SerialBuffer.prototype.getUint16 = function () {
        var v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        return v;
    };
    /** Append a `uint32` */
    SerialBuffer.prototype.pushUint32 = function (v) {
        this.push((v >> 0) & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff);
    };
    /** Get a `uint32` */
    SerialBuffer.prototype.getUint32 = function () {
        var v = 0;
        v |= this.get() << 0;
        v |= this.get() << 8;
        v |= this.get() << 16;
        v |= this.get() << 24;
        return v >>> 0;
    };
    /** Append a `uint64`. *Caution*: `number` only has 53 bits of precision */
    SerialBuffer.prototype.pushNumberAsUint64 = function (v) {
        this.pushUint32(v >>> 0);
        this.pushUint32(Math.floor(v / 4294967296) >>> 0);
    };
    /**
     * Get a `uint64` as a `number`. *Caution*: `number` only has 53 bits of precision; some values will change.
     * `numeric.binaryToDecimal(serialBuffer.getUint8Array(8))` recommended instead
     */
    SerialBuffer.prototype.getUint64AsNumber = function () {
        var low = this.getUint32();
        var high = this.getUint32();
        return (high >>> 0) * 4294967296 + (low >>> 0);
    };
    /** Append a `varuint32` */
    SerialBuffer.prototype.pushVaruint32 = function (v) {
        while (true) {
            if (v >>> 7) {
                this.push(0x80 | (v & 0x7f));
                v = v >>> 7;
            }
            else {
                this.push(v);
                break;
            }
        }
    };
    /** Get a `varuint32` */
    SerialBuffer.prototype.getVaruint32 = function () {
        var v = 0;
        var bit = 0;
        while (true) {
            var b = this.get();
            v |= (b & 0x7f) << bit;
            bit += 7;
            if (!(b & 0x80)) {
                break;
            }
        }
        return v >>> 0;
    };
    /** Append a `varint32` */
    SerialBuffer.prototype.pushVarint32 = function (v) {
        this.pushVaruint32((v << 1) ^ (v >> 31));
    };
    /** Get a `varint32` */
    SerialBuffer.prototype.getVarint32 = function () {
        var v = this.getVaruint32();
        if (v & 1) {
            return ((~v) >> 1) | 2147483648;
        }
        else {
            return v >>> 1;
        }
    };
    /** Append a `float32` */
    SerialBuffer.prototype.pushFloat32 = function (v) {
        this.pushArray(new Uint8Array((new Float32Array([v])).buffer));
    };
    /** Get a `float32` */
    SerialBuffer.prototype.getFloat32 = function () {
        return new Float32Array(this.getUint8Array(4).slice().buffer)[0];
    };
    /** Append a `float64` */
    SerialBuffer.prototype.pushFloat64 = function (v) {
        this.pushArray(new Uint8Array((new Float64Array([v])).buffer));
    };
    /** Get a `float64` */
    SerialBuffer.prototype.getFloat64 = function () {
        return new Float64Array(this.getUint8Array(8).slice().buffer)[0];
    };
    /** Append a `name` */
    SerialBuffer.prototype.pushName = function (s) {
        if (typeof s !== "string") {
            throw new Error("Expected string containing name");
        }
        function charToSymbol(c) {
            if (c >= "a".charCodeAt(0) && c <= "z".charCodeAt(0)) {
                return (c - "a".charCodeAt(0)) + 6;
            }
            if (c >= "1".charCodeAt(0) && c <= "5".charCodeAt(0)) {
                return (c - "1".charCodeAt(0)) + 1;
            }
            return 0;
        }
        var a = new Uint8Array(8);
        var bit = 63;
        for (var i = 0; i < s.length; ++i) {
            var c = charToSymbol(s.charCodeAt(i));
            if (bit < 5) {
                c = c << 1;
            }
            for (var j = 4; j >= 0; --j) {
                if (bit >= 0) {
                    a[Math.floor(bit / 8)] |= ((c >> j) & 1) << (bit % 8);
                    --bit;
                }
            }
        }
        this.pushArray(a);
    };
    /** Get a `name` */
    SerialBuffer.prototype.getName = function () {
        var a = this.getUint8Array(8);
        var result = "";
        for (var bit = 63; bit >= 0;) {
            var c = 0;
            for (var i = 0; i < 5; ++i) {
                if (bit >= 0) {
                    c = (c << 1) | ((a[Math.floor(bit / 8)] >> (bit % 8)) & 1);
                    --bit;
                }
            }
            if (c >= 6) {
                result += String.fromCharCode(c + "a".charCodeAt(0) - 6);
            }
            else if (c >= 1) {
                result += String.fromCharCode(c + "1".charCodeAt(0) - 1);
            }
            else {
                result += ".";
            }
        }
        if (result === ".............") {
            return result;
        }
        while (result.endsWith(".")) {
            result = result.substr(0, result.length - 1);
        }
        return result;
    };
    /** Append length-prefixed binary data */
    SerialBuffer.prototype.pushBytes = function (v) {
        this.pushVaruint32(v.length);
        this.pushArray(v);
    };
    /** Get length-prefixed binary data */
    SerialBuffer.prototype.getBytes = function () {
        return this.getUint8Array(this.getVaruint32());
    };
    /** Append a string */
    SerialBuffer.prototype.pushString = function (v) {
        this.pushBytes(this.textEncoder.encode(v));
    };
    /** Get a string */
    SerialBuffer.prototype.getString = function () {
        return this.textDecoder.decode(this.getBytes());
    };
    /** Append a `symbol_code`. Unlike `symbol`, `symbol_code` doesn't include a precision. */
    SerialBuffer.prototype.pushSymbolCode = function (name) {
        if (typeof name !== "string") {
            throw new Error("Expected string containing symbol_code");
        }
        var a = [];
        a.push.apply(a, __spread(this.textEncoder.encode(name)));
        while (a.length < 8) {
            a.push(0);
        }
        this.pushArray(a.slice(0, 8));
    };
    /** Get a `symbol_code`. Unlike `symbol`, `symbol_code` doesn't include a precision. */
    SerialBuffer.prototype.getSymbolCode = function () {
        var a = this.getUint8Array(8);
        var len;
        for (len = 0; len < a.length; ++len) {
            if (!a[len]) {
                break;
            }
        }
        var name = this.textDecoder.decode(new Uint8Array(a.buffer, a.byteOffset, len));
        return name;
    };
    /** Append a `symbol` */
    SerialBuffer.prototype.pushSymbol = function (_a) {
        var name = _a.name, precision = _a.precision;
        var a = [precision & 0xff];
        a.push.apply(a, __spread(this.textEncoder.encode(name)));
        while (a.length < 8) {
            a.push(0);
        }
        this.pushArray(a.slice(0, 8));
    };
    /** Get a `symbol` */
    SerialBuffer.prototype.getSymbol = function () {
        var precision = this.get();
        var a = this.getUint8Array(7);
        var len;
        for (len = 0; len < a.length; ++len) {
            if (!a[len]) {
                break;
            }
        }
        var name = this.textDecoder.decode(new Uint8Array(a.buffer, a.byteOffset, len));
        return { name: name, precision: precision };
    };
    /** Append an asset */
    SerialBuffer.prototype.pushAsset = function (s) {
        if (typeof s !== "string") {
            throw new Error("Expected string containing asset");
        }
        s = s.trim();
        var pos = 0;
        var amount = "";
        var precision = 0;
        if (s[pos] === "-") {
            amount += "-";
            ++pos;
        }
        var foundDigit = false;
        while (pos < s.length && s.charCodeAt(pos) >= "0".charCodeAt(0) && s.charCodeAt(pos) <= "9".charCodeAt(0)) {
            foundDigit = true;
            amount += s[pos];
            ++pos;
        }
        if (!foundDigit) {
            throw new Error("Asset must begin with a number");
        }
        if (s[pos] === ".") {
            ++pos;
            while (pos < s.length && s.charCodeAt(pos) >= "0".charCodeAt(0) && s.charCodeAt(pos) <= "9".charCodeAt(0)) {
                amount += s[pos];
                ++precision;
                ++pos;
            }
        }
        var name = s.substr(pos).trim();
        this.pushArray(numeric.signedDecimalToBinary(8, amount));
        this.pushSymbol({ name: name, precision: precision });
    };
    /** Get an asset */
    SerialBuffer.prototype.getAsset = function () {
        var amount = this.getUint8Array(8);
        var _a = this.getSymbol(), name = _a.name, precision = _a.precision;
        var s = numeric.signedBinaryToDecimal(amount, precision + 1);
        if (precision) {
            s = s.substr(0, s.length - precision) + "." + s.substr(s.length - precision);
        }
        return s + " " + name;
    };
    /** Append a public key */
    SerialBuffer.prototype.pushPublicKey = function (s) {
        var key = numeric.stringToPublicKey(s);
        this.push(key.type);
        this.pushArray(key.data);
    };
    /** Get a public key */
    SerialBuffer.prototype.getPublicKey = function () {
        var type = this.get();
        var data = this.getUint8Array(numeric.publicKeyDataSize);
        return numeric.publicKeyToString({ type: type, data: data });
    };
    /** Append a private key */
    SerialBuffer.prototype.pushPrivateKey = function (s) {
        var key = numeric.stringToPrivateKey(s);
        this.push(key.type);
        this.pushArray(key.data);
    };
    /** Get a private key */
    SerialBuffer.prototype.getPrivateKey = function () {
        var type = this.get();
        var data = this.getUint8Array(numeric.privateKeyDataSize);
        return numeric.privateKeyToString({ type: type, data: data });
    };
    /** Append a signature */
    SerialBuffer.prototype.pushSignature = function (s) {
        var key = numeric.stringToSignature(s);
        this.push(key.type);
        this.pushArray(key.data);
    };
    /** Get a signature */
    SerialBuffer.prototype.getSignature = function () {
        var type = this.get();
        var data = this.getUint8Array(numeric.signatureDataSize);
        return numeric.signatureToString({ type: type, data: data });
    };
    return SerialBuffer;
}()); // SerialBuffer
exports.SerialBuffer = SerialBuffer;
/** Is this a supported ABI version? */
function supportedAbiVersion(version) {
    return version.startsWith("eosio::abi/1.");
}
exports.supportedAbiVersion = supportedAbiVersion;
function checkDateParse(date) {
    var result = Date.parse(date);
    if (Number.isNaN(result)) {
        throw new Error("Invalid time format");
    }
    return result;
}
/** Convert date in ISO format to `time_point` (miliseconds since epoch) */
function dateToTimePoint(date) {
    return Math.round(checkDateParse(date + "Z") * 1000);
}
exports.dateToTimePoint = dateToTimePoint;
/** Convert `time_point` (miliseconds since epoch) to date in ISO format */
function timePointToDate(us) {
    var s = (new Date(us / 1000)).toISOString();
    return s.substr(0, s.length - 1);
}
exports.timePointToDate = timePointToDate;
/** Convert date in ISO format to `time_point_sec` (seconds since epoch) */
function dateToTimePointSec(date) {
    return Math.round(checkDateParse(date + "Z") / 1000);
}
exports.dateToTimePointSec = dateToTimePointSec;
/** Convert `time_point_sec` (seconds since epoch) to to date in ISO format */
function timePointSecToDate(sec) {
    var s = (new Date(sec * 1000)).toISOString();
    return s.substr(0, s.length - 1);
}
exports.timePointSecToDate = timePointSecToDate;
/** Convert date in ISO format to `block_timestamp_type` (half-seconds since a different epoch) */
function dateToBlockTimestamp(date) {
    return Math.round((checkDateParse(date + "Z") - 946684800000) / 500);
}
exports.dateToBlockTimestamp = dateToBlockTimestamp;
/** Convert `block_timestamp_type` (half-seconds since a different epoch) to to date in ISO format */
function blockTimestampToDate(slot) {
    var s = (new Date(slot * 500 + 946684800000)).toISOString();
    return s.substr(0, s.length - 1);
}
exports.blockTimestampToDate = blockTimestampToDate;
/** Convert `string` to `Symbol`. format: `precision,NAME`. */
function stringToSymbol(s) {
    if (typeof s !== "string") {
        throw new Error("Expected string containing symbol");
    }
    var m = s.match(/^([0-9]+),([A-Z]+)$/);
    if (!m) {
        throw new Error("Invalid symbol");
    }
    return { name: m[2], precision: +m[1] };
}
exports.stringToSymbol = stringToSymbol;
/** Convert `Symbol` to `string`. format: `precision,NAME`. */
function symbolToString(_a) {
    var name = _a.name, precision = _a.precision;
    return precision + "," + name;
}
exports.symbolToString = symbolToString;
/** Convert binary data to hex */
function arrayToHex(data) {
    var e_1, _a;
    var result = "";
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var x = data_1_1.value;
            result += ("00" + x.toString(16)).slice(-2);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result.toUpperCase();
}
exports.arrayToHex = arrayToHex;
/** Convert hex to binary data */
function hexToUint8Array(hex) {
    if (typeof hex !== "string") {
        throw new Error("Expected string containing hex digits");
    }
    if (hex.length % 2) {
        throw new Error("Odd number of hex digits");
    }
    var l = hex.length / 2;
    var result = new Uint8Array(l);
    for (var i = 0; i < l; ++i) {
        var x = parseInt(hex.substr(i * 2, 2), 16);
        if (Number.isNaN(x)) {
            throw new Error("Expected hex string");
        }
        result[i] = x;
    }
    return result;
}
exports.hexToUint8Array = hexToUint8Array;
function serializeUnknown(buffer, data) {
    throw new Error("Don't know how to serialize " + this.name);
}
function deserializeUnknown(buffer) {
    throw new Error("Don't know how to deserialize " + this.name);
}
function serializeStruct(buffer, data, state, allowExtensions) {
    if (state === void 0) { state = new SerializerState(); }
    if (allowExtensions === void 0) { allowExtensions = true; }
    var e_2, _a;
    if (this.base) {
        this.base.serialize(buffer, data, state, allowExtensions);
    }
    try {
        for (var _b = __values(this.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
            var field = _c.value;
            if (field.name in data) {
                if (state.skippedBinaryExtension) {
                    throw new Error("unexpected " + this.name + "." + field.name);
                }
                field.type.serialize(buffer, data[field.name], state, allowExtensions && field === this.fields[this.fields.length - 1]);
            }
            else {
                if (allowExtensions && field.type.extensionOf) {
                    state.skippedBinaryExtension = true;
                }
                else {
                    throw new Error("missing " + this.name + "." + field.name + " (type=" + field.type.name + ")");
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function deserializeStruct(buffer, state, allowExtensions) {
    if (state === void 0) { state = new SerializerState(); }
    if (allowExtensions === void 0) { allowExtensions = true; }
    var e_3, _a;
    var result;
    if (this.base) {
        result = this.base.deserialize(buffer, state, allowExtensions);
    }
    else {
        result = {};
    }
    try {
        for (var _b = __values(this.fields), _c = _b.next(); !_c.done; _c = _b.next()) {
            var field = _c.value;
            if (allowExtensions && field.type.extensionOf && !buffer.haveReadData()) {
                state.skippedBinaryExtension = true;
            }
            else {
                result[field.name] = field.type.deserialize(buffer, state, allowExtensions);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
}
function serializeVariant(buffer, data, state, allowExtensions) {
    if (!Array.isArray(data) || data.length !== 2 || typeof data[0] !== "string") {
        throw new Error('expected variant: ["type", value]');
    }
    var i = this.fields.findIndex(function (field) { return field.name === data[0]; });
    if (i < 0) {
        throw new Error("type \"" + data[0] + "\" is not valid for variant");
    }
    buffer.pushVaruint32(i);
    this.fields[i].type.serialize(buffer, data[1], state, allowExtensions);
}
function deserializeVariant(buffer, state, allowExtensions) {
    var i = buffer.getVaruint32();
    if (i >= this.fields.length) {
        throw new Error("type index " + i + " is not valid for variant");
    }
    var field = this.fields[i];
    return [field.name, field.type.deserialize(buffer, state, allowExtensions)];
}
function serializeArray(buffer, data, state, allowExtensions) {
    var e_4, _a;
    buffer.pushVaruint32(data.length);
    try {
        for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
            var item = data_2_1.value;
            this.arrayOf.serialize(buffer, item, state, false);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
}
function deserializeArray(buffer, state, allowExtensions) {
    var len = buffer.getVaruint32();
    var result = [];
    for (var i = 0; i < len; ++i) {
        result.push(this.arrayOf.deserialize(buffer, state, false));
    }
    return result;
}
function serializeOptional(buffer, data, state, allowExtensions) {
    if (data === null || data === undefined) {
        buffer.push(0);
    }
    else {
        buffer.push(1);
        this.optionalOf.serialize(buffer, data, state, allowExtensions);
    }
}
function deserializeOptional(buffer, state, allowExtensions) {
    if (buffer.get()) {
        return this.optionalOf.deserialize(buffer, state, allowExtensions);
    }
    else {
        return null;
    }
}
function serializeExtension(buffer, data, state, allowExtensions) {
    this.extensionOf.serialize(buffer, data, state, allowExtensions);
}
function deserializeExtension(buffer, state, allowExtensions) {
    return this.extensionOf.deserialize(buffer, state, allowExtensions);
}
function createType(attrs) {
    return __assign({ name: "<missing name>", aliasOfName: "", arrayOf: null, optionalOf: null, extensionOf: null, baseName: "", base: null, fields: [], serialize: serializeUnknown, deserialize: deserializeUnknown }, attrs);
}
function checkRange(orig, converted) {
    if (Number.isNaN(+orig) || Number.isNaN(+converted) || (typeof orig !== "number" && typeof orig !== "string")) {
        throw new Error("Expected number");
    }
    if (+orig !== +converted) {
        throw new Error("Number is out of range");
    }
    return +orig;
}
/** Create the set of types built-in to the abi format */
function createInitialTypes() {
    var result = new Map(Object.entries({
        bool: createType({
            name: "bool",
            serialize: function (buffer, data) {
                if (typeof data !== "boolean") {
                    throw new Error("Expected true or false");
                }
                buffer.push(data ? 1 : 0);
            },
            deserialize: function (buffer) { return !!buffer.get(); },
        }),
        uint8: createType({
            name: "uint8",
            serialize: function (buffer, data) { buffer.push(checkRange(data, data & 0xff)); },
            deserialize: function (buffer) { return buffer.get(); },
        }),
        int8: createType({
            name: "int8",
            serialize: function (buffer, data) { buffer.push(checkRange(data, data << 24 >> 24)); },
            deserialize: function (buffer) { return buffer.get() << 24 >> 24; },
        }),
        uint16: createType({
            name: "uint16",
            serialize: function (buffer, data) { buffer.pushUint16(checkRange(data, data & 0xffff)); },
            deserialize: function (buffer) { return buffer.getUint16(); },
        }),
        int16: createType({
            name: "int16",
            serialize: function (buffer, data) { buffer.pushUint16(checkRange(data, data << 16 >> 16)); },
            deserialize: function (buffer) { return buffer.getUint16() << 16 >> 16; },
        }),
        uint32: createType({
            name: "uint32",
            serialize: function (buffer, data) { buffer.pushUint32(checkRange(data, data >>> 0)); },
            deserialize: function (buffer) { return buffer.getUint32(); },
        }),
        uint64: createType({
            name: "uint64",
            serialize: function (buffer, data) {
                buffer.pushArray(numeric.decimalToBinary(8, "" + data));
            },
            deserialize: function (buffer) { return numeric.binaryToDecimal(buffer.getUint8Array(8)); },
        }),
        int64: createType({
            name: "int64",
            serialize: function (buffer, data) {
                buffer.pushArray(numeric.signedDecimalToBinary(8, "" + data));
            },
            deserialize: function (buffer) { return numeric.signedBinaryToDecimal(buffer.getUint8Array(8)); },
        }),
        int32: createType({
            name: "int32",
            serialize: function (buffer, data) { buffer.pushUint32(checkRange(data, data | 0)); },
            deserialize: function (buffer) { return buffer.getUint32() | 0; },
        }),
        varuint32: createType({
            name: "varuint32",
            serialize: function (buffer, data) { buffer.pushVaruint32(checkRange(data, data >>> 0)); },
            deserialize: function (buffer) { return buffer.getVaruint32(); },
        }),
        varint32: createType({
            name: "varint32",
            serialize: function (buffer, data) { buffer.pushVarint32(checkRange(data, data | 0)); },
            deserialize: function (buffer) { return buffer.getVarint32(); },
        }),
        uint128: createType({
            name: "uint128",
            serialize: function (buffer, data) { buffer.pushArray(numeric.decimalToBinary(16, "" + data)); },
            deserialize: function (buffer) { return numeric.binaryToDecimal(buffer.getUint8Array(16)); },
        }),
        int128: createType({
            name: "int128",
            serialize: function (buffer, data) {
                buffer.pushArray(numeric.signedDecimalToBinary(16, "" + data));
            },
            deserialize: function (buffer) { return numeric.signedBinaryToDecimal(buffer.getUint8Array(16)); },
        }),
        float32: createType({
            name: "float32",
            serialize: function (buffer, data) { buffer.pushFloat32(data); },
            deserialize: function (buffer) { return buffer.getFloat32(); },
        }),
        float64: createType({
            name: "float64",
            serialize: function (buffer, data) { buffer.pushFloat64(data); },
            deserialize: function (buffer) { return buffer.getFloat64(); },
        }),
        float128: createType({
            name: "float128",
            serialize: function (buffer, data) { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 16); },
            deserialize: function (buffer) { return arrayToHex(buffer.getUint8Array(16)); },
        }),
        bytes: createType({
            name: "bytes",
            serialize: function (buffer, data) { buffer.pushBytes(hexToUint8Array(data)); },
            deserialize: function (buffer) { return arrayToHex(buffer.getBytes()); },
        }),
        string: createType({
            name: "string",
            serialize: function (buffer, data) { buffer.pushString(data); },
            deserialize: function (buffer) { return buffer.getString(); },
        }),
        name: createType({
            name: "name",
            serialize: function (buffer, data) { buffer.pushName(data); },
            deserialize: function (buffer) { return buffer.getName(); },
        }),
        time_point: createType({
            name: "time_point",
            serialize: function (buffer, data) { buffer.pushNumberAsUint64(dateToTimePoint(data)); },
            deserialize: function (buffer) { return timePointToDate(buffer.getUint64AsNumber()); },
        }),
        time_point_sec: createType({
            name: "time_point_sec",
            serialize: function (buffer, data) { buffer.pushUint32(dateToTimePointSec(data)); },
            deserialize: function (buffer) { return timePointSecToDate(buffer.getUint32()); },
        }),
        block_timestamp_type: createType({
            name: "block_timestamp_type",
            serialize: function (buffer, data) { buffer.pushUint32(dateToBlockTimestamp(data)); },
            deserialize: function (buffer) { return blockTimestampToDate(buffer.getUint32()); },
        }),
        symbol_code: createType({
            name: "symbol_code",
            serialize: function (buffer, data) { buffer.pushSymbolCode(data); },
            deserialize: function (buffer) { return buffer.getSymbolCode(); },
        }),
        symbol: createType({
            name: "symbol",
            serialize: function (buffer, data) { buffer.pushSymbol(stringToSymbol(data)); },
            deserialize: function (buffer) { return symbolToString(buffer.getSymbol()); },
        }),
        asset: createType({
            name: "asset",
            serialize: function (buffer, data) { buffer.pushAsset(data); },
            deserialize: function (buffer) { return buffer.getAsset(); },
        }),
        checksum160: createType({
            name: "checksum160",
            serialize: function (buffer, data) { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 20); },
            deserialize: function (buffer) { return arrayToHex(buffer.getUint8Array(20)); },
        }),
        checksum256: createType({
            name: "checksum256",
            serialize: function (buffer, data) { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 32); },
            deserialize: function (buffer) { return arrayToHex(buffer.getUint8Array(32)); },
        }),
        checksum512: createType({
            name: "checksum512",
            serialize: function (buffer, data) { buffer.pushUint8ArrayChecked(hexToUint8Array(data), 64); },
            deserialize: function (buffer) { return arrayToHex(buffer.getUint8Array(64)); },
        }),
        public_key: createType({
            name: "public_key",
            serialize: function (buffer, data) { buffer.pushPublicKey(data); },
            deserialize: function (buffer) { return buffer.getPublicKey(); },
        }),
        private_key: createType({
            name: "private_key",
            serialize: function (buffer, data) { buffer.pushPrivateKey(data); },
            deserialize: function (buffer) { return buffer.getPrivateKey(); },
        }),
        signature: createType({
            name: "signature",
            serialize: function (buffer, data) { buffer.pushSignature(data); },
            deserialize: function (buffer) { return buffer.getSignature(); },
        }),
    }));
    result.set("extended_asset", createType({
        name: "extended_asset",
        baseName: "",
        fields: [
            { name: "quantity", typeName: "asset", type: result.get("asset") },
            { name: "contract", typeName: "name", type: result.get("name") },
        ],
        serialize: serializeStruct,
        deserialize: deserializeStruct,
    }));
    return result;
} // createInitialTypes()
exports.createInitialTypes = createInitialTypes;
/** Get type from `types` */
function getType(types, name) {
    var type = types.get(name);
    if (type && type.aliasOfName) {
        return getType(types, type.aliasOfName);
    }
    if (type) {
        return type;
    }
    if (name.endsWith("[]")) {
        return createType({
            name: name,
            arrayOf: getType(types, name.substr(0, name.length - 2)),
            serialize: serializeArray,
            deserialize: deserializeArray,
        });
    }
    if (name.endsWith("?")) {
        return createType({
            name: name,
            optionalOf: getType(types, name.substr(0, name.length - 1)),
            serialize: serializeOptional,
            deserialize: deserializeOptional,
        });
    }
    if (name.endsWith("$")) {
        return createType({
            name: name,
            extensionOf: getType(types, name.substr(0, name.length - 1)),
            serialize: serializeExtension,
            deserialize: deserializeExtension,
        });
    }
    throw new Error("Unknown type: " + name);
}
exports.getType = getType;
/**
 * Get types from abi
 * @param initialTypes Set of types to build on.
 *     In most cases, it's best to fill this from a fresh call to `getTypesFromAbi()`.
 */
function getTypesFromAbi(initialTypes, abi) {
    var e_5, _a, e_6, _b, e_7, _c, e_8, _d, e_9, _e;
    var types = new Map(initialTypes);
    if (abi.types) {
        try {
            for (var _f = __values(abi.types), _g = _f.next(); !_g.done; _g = _f.next()) {
                var _h = _g.value, new_type_name = _h.new_type_name, type = _h.type;
                types.set(new_type_name, createType({ name: new_type_name, aliasOfName: type }));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
            }
            finally { if (e_5) throw e_5.error; }
        }
    }
    if (abi.structs) {
        try {
            for (var _j = __values(abi.structs), _k = _j.next(); !_k.done; _k = _j.next()) {
                var _l = _k.value, name_1 = _l.name, base = _l.base, fields = _l.fields;
                types.set(name_1, createType({
                    name: name_1,
                    baseName: base,
                    fields: fields.map(function (_a) {
                        var n = _a.name, type = _a.type;
                        return ({ name: n, typeName: type, type: null });
                    }),
                    serialize: serializeStruct,
                    deserialize: deserializeStruct,
                }));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_b = _j.return)) _b.call(_j);
            }
            finally { if (e_6) throw e_6.error; }
        }
    }
    if (abi.variants) {
        try {
            for (var _m = __values(abi.variants), _o = _m.next(); !_o.done; _o = _m.next()) {
                var _p = _o.value, name_2 = _p.name, t = _p.types;
                types.set(name_2, createType({
                    name: name_2,
                    fields: t.map(function (s) { return ({ name: s, typeName: s, type: null }); }),
                    serialize: serializeVariant,
                    deserialize: deserializeVariant,
                }));
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_o && !_o.done && (_c = _m.return)) _c.call(_m);
            }
            finally { if (e_7) throw e_7.error; }
        }
    }
    try {
        for (var types_1 = __values(types), types_1_1 = types_1.next(); !types_1_1.done; types_1_1 = types_1.next()) {
            var _q = __read(types_1_1.value, 2), name_3 = _q[0], type = _q[1];
            if (type.baseName) {
                type.base = getType(types, type.baseName);
            }
            try {
                for (var _r = __values(type.fields), _s = _r.next(); !_s.done; _s = _r.next()) {
                    var field = _s.value;
                    field.type = getType(types, field.typeName);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_s && !_s.done && (_e = _r.return)) _e.call(_r);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (types_1_1 && !types_1_1.done && (_d = types_1.return)) _d.call(types_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return types;
} // getTypesFromAbi
exports.getTypesFromAbi = getTypesFromAbi;
/** TAPoS: Return transaction fields which reference `refBlock` and expire `expireSeconds` after `refBlock.timestamp` */
function transactionHeader(refBlock, expireSeconds) {
    return {
        expiration: timePointSecToDate(dateToTimePointSec(refBlock.timestamp) + expireSeconds),
        ref_block_num: refBlock.block_num & 0xffff,
        ref_block_prefix: refBlock.ref_block_prefix,
    };
}
exports.transactionHeader = transactionHeader;
/** Convert action data to serialized form (hex) */
function serializeActionData(contract, account, name, data, textEncoder, textDecoder) {
    var action = contract.actions.get(name);
    if (!action) {
        throw new Error("Unknown action " + name + " in contract " + account);
    }
    var buffer = new SerialBuffer({ textEncoder: textEncoder, textDecoder: textDecoder });
    action.serialize(buffer, data);
    return arrayToHex(buffer.asUint8Array());
}
exports.serializeActionData = serializeActionData;
/** Return action in serialized form */
function serializeAction(contract, account, name, authorization, data, textEncoder, textDecoder) {
    return {
        account: account,
        name: name,
        authorization: authorization,
        data: serializeActionData(contract, account, name, data, textEncoder, textDecoder),
    };
}
exports.serializeAction = serializeAction;
/** Deserialize action data. If `data` is a `string`, then it's assumed to be in hex. */
function deserializeActionData(contract, account, name, data, textEncoder, textDecoder) {
    var action = contract.actions.get(name);
    if (typeof data === "string") {
        data = hexToUint8Array(data);
    }
    if (!action) {
        throw new Error("Unknown action " + name + " in contract " + account);
    }
    var buffer = new SerialBuffer({ textDecoder: textDecoder, textEncoder: textEncoder });
    buffer.pushArray(data);
    return action.deserialize(buffer);
}
exports.deserializeActionData = deserializeActionData;
/** Deserialize action. If `data` is a `string`, then it's assumed to be in hex. */
function deserializeAction(contract, account, name, authorization, data, textEncoder, textDecoder) {
    return {
        account: account,
        name: name,
        authorization: authorization,
        data: deserializeActionData(contract, account, name, data, textEncoder, textDecoder),
    };
}
exports.deserializeAction = deserializeAction;


/***/ }),

/***/ "./src/ripemd.js":
/*!***********************!*\
  !*** ./src/ripemd.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://gist.githubusercontent.com/wlzla000/bac83df6d3c51916c4dd0bc947e46947/raw/7ee3462b095ab22580ddaf191f44a590da6fe33b/RIPEMD-160.js

/*
	RIPEMD-160.js

		developed
			by K. (https://github.com/wlzla000)
			on December 27-29, 2017,

		licensed under


		the MIT license

		Copyright (c) 2017 K.

		 Permission is hereby granted, free of charge, to any person
		obtaining a copy of this software and associated documentation
		files (the "Software"), to deal in the Software without
		restriction, including without limitation the rights to use,
		copy, modify, merge, publish, distribute, sublicense, and/or
		sell copies of the Software, and to permit persons to whom the
		Software is furnished to do so, subject to the following
		conditions:

		 The above copyright notice and this permission notice shall be
		included in all copies or substantial portions of the Software.

		 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
		EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
		OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
		HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
		WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
		FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
		OTHER DEALINGS IN THE SOFTWARE.
*/



class RIPEMD160
{
	constructor()
	{
		// https://webcache.googleusercontent.com/search?q=cache:CnLOgolTHYEJ:https://www.cosic.esat.kuleuven.be/publications/article-317.pdf
		// http://shodhganga.inflibnet.ac.in/bitstream/10603/22978/13/13_appendix.pdf
	}

	static get_n_pad_bytes(message_size /* in bytes, 1 byte is 8 bits. */)
	{
		//  Obtain the number of bytes needed to pad the message.
		// It does not contain the size of the message size information.
		/*
			https://webcache.googleusercontent.com/search?q=cache:CnLOgolTHYEJ:https://www.cosic.esat.kuleuven.be/publications/article-317.pdf

			The Cryptographic Hash Function RIPEMD-160

			written by
				Bart Preneel,
				Hans Dobbertin,
				Antoon Bosselaers
			in
				1997.

			--------------------------------------------------

			§5     Description of RIPEMD-160

			......

			 In order to guarantee that the total input size is a
			multiple of 512 bits, the input is padded in the same
			way as for all the members of the MD4-family: one
			appends a single 1 followed by a string of 0s (the
			number of 0s lies between 0 and 511); the last 64 bits
			of the extended input contain the binary representation
			of the input size in bits, least significant byte first.
		*/
		/*
			https://tools.ietf.org/rfc/rfc1186.txt

			RFC 1186: MD4 Message Digest Algorithm.

			written by
				Ronald Linn Rivest
			in
				October 1990.

			--------------------------------------------------

			§3     MD4 Algorithm Description

			......

			Step 1. Append padding bits

			 The message is "padded" (extended) so that its length
			(in bits) is congruent to 448, modulo 512. That is, the
			message is extended so that it is just 64 bits shy of
			being a multiple of 512 bits long. Padding is always
			performed, even if the length of the message is already
			congruent to 448, modulo 512 (in which case 512 bits of
			padding are added).

			 Padding is performed as follows: a single "1" bit is
			appended to the message, and then enough zero bits are
			appended so that the length in bits of the padded
			message becomes congruent to 448, modulo 512.

			Step 2. Append length

			 A 64-bit representation of b (the length of the message
			before the padding bits were added) is appended to the
			result of the previous step. In the unlikely event that
			b is greater than 2^64, then only the low-order 64 bits
			of b are used. (These bits are appended as two 32-bit
			words and appended low-order word first in accordance
			with the previous conventions.)

			 At this point the resulting message (after padding with
			bits and with b) has a length that is an exact multiple
			of 512 bits. Equivalently, this message has a length
			that is an exact multiple of 16 (32-bit) words. Let
			M[0 ... N-1] denote the words of the resulting message,
			where N is a multiple of 16.
		*/
		// https://crypto.stackexchange.com/a/32407/54568
		/*
			Example case  # 1
				[0 bit: message.]
				[1 bit: 1.]
				[447 bits: 0.]
				[64 bits: message size information.]

			Example case  # 2
				[512-bits: message]
				[1 bit: 1.]
				[447 bits: 0.]
				[64 bits: message size information.]

			Example case  # 3
				[(512 - 64 = 448) bits: message.]
				[1 bit: 1.]
				[511 bits: 0.]
				[64 bits: message size information.]

			Example case  # 4
				[(512 - 65 = 447) bits: message.]
				[1 bit: 1.]
				[0 bit: 0.]
				[64 bits: message size information.]
		*/
		// The number of padding zero bits:
		//      511 - [{(message size in bits) + 64} (mod 512)]
		return 64 - ((message_size + 8) & 0b00111111 /* 63 */);
	}
	static pad(message /* An ArrayBuffer. */)
	{
		const message_size = message.byteLength;
		const n_pad = RIPEMD160.get_n_pad_bytes(message_size);

		//  `Number.MAX_SAFE_INTEGER` is ((2 ** 53) - 1) and
		// bitwise operation in Javascript is done on 32-bits operands.
		const divmod = (dividend, divisor) => [
			Math.floor(dividend / divisor),
			dividend % divisor
		];
		/*
To shift

   00000000 000????? ???????? ???????? ???????? ???????? ???????? ????????
                                     t o
   00000000 ???????? ???????? ???????? ???????? ???????? ???????? ?????000

--------------------------------------------------------------------------------

Method #1

    00000000 000????? ???????? ????????  ???????? ???????? ???????? ????????
   [00000000 000AAAAA AAAAAAAA AAAAAAAA] (<A> captured)
   [00000000 AAAAAAAA AAAAAAAA AAAAA000] (<A> shifted)
                         (<B> captured) [BBBBBBBB BBBBBBBB BBBBBBBB BBBBBBBB]
                     (<B> shifted) [BBB][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
   [00000000 AAAAAAAA AAAAAAAA AAAAABBB] (<A> & <B_2> merged)
   [00000000 AAAAAAAA AAAAAAAA AAAAABBB][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
    00000000 ???????? ???????? ????????  ???????? ???????? ???????? ?????000

		const uint32_max_plus_1 = 0x100000000; // (2 ** 32)
		const [
			msg_byte_size_most, // Value range [0, (2 ** 21) - 1].
			msg_byte_size_least // Value range [0, (2 ** 32) - 1].
		] = divmod(message_size, uint32_max_plus_1);
		const [
			carry, // Value range [0, 7].
			msg_bit_size_least // Value range [0, (2 ** 32) - 8].
		] = divmod(message_byte_size_least * 8, uint32_max_plus_1);
		const message_bit_size_most = message_byte_size_most * 8
			+ carry; // Value range [0, (2 ** 24) - 1].

--------------------------------------------------------------------------------

Method #2
    00000000 000????? ???????? ????????  ???????? ???????? ???????? ????????
      [00000 000AAAAA AAAAAAAA AAAAAAAA  AAA] (<A> captured)
                         (<B> captured) [000BBBBB BBBBBBBB BBBBBBBB BBBBBBBB]
                          (<B> shifted) [BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
   [00000000 AAAAAAAA AAAAAAAA AAAAAAAA][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
    00000000 ???????? ???????? ????????  ???????? ???????? ???????? ?????000

		*/
		const [
			msg_bit_size_most,
			msg_bit_size_least
		] = divmod(message_size, 536870912 /* (2 ** 29) */)
			.map((x, index) => (index ? (x * 8) : x));

		// `ArrayBuffer.transfer()` is not supported.
		const padded = new Uint8Array(message_size + n_pad + 8);
		padded.set(new Uint8Array(message), 0);
		const data_view = new DataView(padded.buffer);
		data_view.setUint8(message_size, 0b10000000);
		data_view.setUint32(
			message_size + n_pad,
			msg_bit_size_least,
			true // Little-endian
		);
		data_view.setUint32(
			message_size + n_pad + 4,
			msg_bit_size_most,
			true // Little-endian
		);

		return padded.buffer;
	}

	static f(j, x, y, z)
	{
		if(0 <= j && j <= 15)
		{ // Exclusive-OR
			return x ^ y ^ z;
		}
		if(16 <= j && j <= 31)
		{ // Multiplexing (muxing)
			return (x & y) | (~x & z);
		}
		if(32 <= j && j <= 47)
		{
			return (x | ~y) ^ z;
		}
		if(48 <= j && j <= 63)
		{ // Multiplexing (muxing)
			return (x & z) | (y & ~z);
		}
		if(64 <= j && j <= 79)
		{
			return x ^ (y | ~z);
		}
	}
	static K(j)
	{
		if(0 <= j && j <= 15)
		{
			return 0x00000000;
		}
		if(16 <= j && j <= 31)
		{
			// Math.floor((2 ** 30) * Math.SQRT2)
			return 0x5A827999;
		}
		if(32 <= j && j <= 47)
		{
			// Math.floor((2 ** 30) * Math.sqrt(3))
			return 0x6ED9EBA1;
		}
		if(48 <= j && j <= 63)
		{
			// Math.floor((2 ** 30) * Math.sqrt(5))
			return 0x8F1BBCDC;
		}
		if(64 <= j && j <= 79)
		{
			// Math.floor((2 ** 30) * Math.sqrt(7))
			return 0xA953FD4E;
		}
	}
	static KP(j) // K'
	{
		if(0 <= j && j <= 15)
		{
			// Math.floor((2 ** 30) * Math.cbrt(2))
			return 0x50A28BE6;
		}
		if(16 <= j && j <= 31)
		{
			// Math.floor((2 ** 30) * Math.cbrt(3))
			return 0x5C4DD124;
		}
		if(32 <= j && j <= 47)
		{
			// Math.floor((2 ** 30) * Math.cbrt(5))
			return 0x6D703EF3;
		}
		if(48 <= j && j <= 63)
		{
			// Math.floor((2 ** 30) * Math.cbrt(7))
			return 0x7A6D76E9;
		}
		if(64 <= j && j <= 79)
		{
			return 0x00000000;
		}
	}
	static add_modulo32(/* ...... */)
	{
		// 1.  Modulo addition (addition modulo) is associative.
		//    https://proofwiki.org/wiki/Modulo_Addition_is_Associative
 		// 2.  Bitwise operation in Javascript
		//    is done on 32-bits operands
		//    and results in a 32-bits value.
		return Array
			.from(arguments)
			.reduce((a, b) => (a + b), 0) | 0;
	}
	static rol32(value, count)
	{ // Cyclic left shift (rotate) on 32-bits value.
		return (value << count) | (value >>> (32 - count));
	}
	static hash(message /* An ArrayBuffer. */)
	{
		//////////       Padding       //////////

		// The padded message.
		const padded = RIPEMD160.pad(message);

		//////////     Compression     //////////

		// Message word selectors.
		const r = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
			7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
			3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
			1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
			4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
		];
		const rP = [ // r'
			5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
			6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
			15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
			8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
			12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
		];

		// Amounts for 'rotate left' operation.
		const s = [
			11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
			7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
			11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
			11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
			9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
		];
		const sP = [ // s'
			8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
			9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
			9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
			15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
			8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
		];

		// The size, in bytes, of a word.
		const word_size = 4;

		// The size, in bytes, of a 16-words block.
		const block_size = 64;

		// The number of the 16-words blocks.
		const t = padded.byteLength / block_size;

		//  The message after padding consists of t 16-word blocks that
		// are denoted with X_i[j], with 0≤i≤(t − 1) and 0≤j≤15.
		const X = (new Array(t))
			.fill(undefined)
			.map((_, i) => new Proxy(
				new DataView(
					padded, i * block_size, block_size
				), {
				get(block_view, j)
				{
					return block_view.getUint32(
						j * word_size,
						true // Little-endian
					);
				}
			}));

		//  The result of RIPEMD-160 is contained in five 32-bit words,
		// which form the internal state of the algorithm. The final
		// content of these five 32-bit words is converted to a 160-bit
		// string, again using the little-endian convention.
		let h = [
			0x67452301, // h_0
			0xEFCDAB89, // h_1
			0x98BADCFE, // h_2
			0x10325476, // h_3
			0xC3D2E1F0  // h_4
		];

		for(let i = 0; i < t; ++i)
		{
			let A = h[0], B = h[1], C = h[2], D = h[3], E = h[4];
			let AP = A, BP = B, CP = C, DP = D, EP = E;
			for(let j = 0; j < 80; ++j)
			{
				// Left rounds
				let T = RIPEMD160.add_modulo32(
					RIPEMD160.rol32(
						RIPEMD160.add_modulo32(
							A,
							RIPEMD160.f(j, B, C, D),
							X[i][r[j]],
							RIPEMD160.K(j)
						),
						s[j]
					),
					E
				);
				A = E;
				E = D;
				D = RIPEMD160.rol32(C, 10);
				C = B;
				B = T;

				// Right rounds
				T = RIPEMD160.add_modulo32(
					RIPEMD160.rol32(
						RIPEMD160.add_modulo32(
							AP,
							RIPEMD160.f(
								79 - j,
								BP,
								CP,
								DP
							),
							X[i][rP[j]],
							RIPEMD160.KP(j)
						),
						sP[j]
					),
					EP
				);
				AP = EP;
				EP = DP;
				DP = RIPEMD160.rol32(CP, 10);
				CP = BP;
				BP = T;
			}
			let T = RIPEMD160.add_modulo32(h[1], C, DP);
			h[1] = RIPEMD160.add_modulo32(h[2], D, EP);
			h[2] = RIPEMD160.add_modulo32(h[3], E, AP);
			h[3] = RIPEMD160.add_modulo32(h[4], A, BP);
			h[4] = RIPEMD160.add_modulo32(h[0], B, CP);
			h[0] = T;
		}

		//  The final output string then consists of the concatenatation
		// of h_0, h_1, h_2, h_3, and h_4 after converting each h_i to a
		// 4-byte string using the little-endian convention.
		const result = new ArrayBuffer(20);
		const data_view = new DataView(result);
		h.forEach((h_i, i) => data_view.setUint32(i * 4, h_i, true));
		return result;
	}
}

module.exports = {
	RIPEMD160
}


/***/ }),

/***/ "./src/transaction.abi.json":
/*!**********************************!*\
  !*** ./src/transaction.abi.json ***!
  \**********************************/
/*! exports provided: version, types, structs, default */
/***/ (function(module) {

module.exports = {"version":"eosio::abi/1.0","types":[{"new_type_name":"account_name","type":"name"},{"new_type_name":"action_name","type":"name"},{"new_type_name":"permission_name","type":"name"}],"structs":[{"name":"permission_level","base":"","fields":[{"name":"actor","type":"account_name"},{"name":"permission","type":"permission_name"}]},{"name":"action","base":"","fields":[{"name":"account","type":"account_name"},{"name":"name","type":"action_name"},{"name":"authorization","type":"permission_level[]"},{"name":"data","type":"bytes"}]},{"name":"extension","base":"","fields":[{"name":"type","type":"uint16"},{"name":"data","type":"bytes"}]},{"name":"transaction_header","base":"","fields":[{"name":"expiration","type":"time_point_sec"},{"name":"ref_block_num","type":"uint16"},{"name":"ref_block_prefix","type":"uint32"},{"name":"max_net_usage_words","type":"varuint32"},{"name":"max_cpu_usage_ms","type":"uint8"},{"name":"delay_sec","type":"varuint32"}]},{"name":"transaction","base":"transaction_header","fields":[{"name":"context_free_actions","type":"action[]"},{"name":"actions","type":"action[]"},{"name":"transaction_extensions","type":"extension[]"}]}]};

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9baWRdL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1tpZF0vLi9zcmMvZW9zanMtYXBpLnRzIiwid2VicGFjazovL1tpZF0vLi9zcmMvZW9zanMtbnVtZXJpYy50cyIsIndlYnBhY2s6Ly9baWRdLy4vc3JjL2Vvc2pzLXNlcmlhbGl6ZS50cyIsIndlYnBhY2s6Ly9baWRdLy4vc3JjL3JpcGVtZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZBOztHQUVHO0FBRUgseUNBQXlDO0FBRTVCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHYiwyRkFBaUQ7QUFDakQsbUZBQXlDO0FBRXpDLDJCQUEyQjtBQUMzQixJQUFNLE1BQU0sR0FBRyxtQkFBTyxDQUFDLCtDQUFxQixDQUFDLENBQUM7QUFDOUMsMkJBQTJCO0FBQzNCLElBQU0sY0FBYyxHQUFHLG1CQUFPLENBQUMsK0RBQTZCLENBQUMsQ0FBQztBQUU5RCxpQ0FBaUM7QUFDcEIsaUJBQVMsR0FBRyxHQUFHLENBQUM7QUF1RDdCO0lBNEJJOzs7Ozs7OztPQVFHO0lBQ0gsYUFBWSxJQU9YO1FBdEJELDZEQUE2RDtRQUN0RCxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFFbkQsbUJBQW1CO1FBQ1osZUFBVSxHQUFHLElBQUksR0FBRyxFQUFxQixDQUFDO1FBbUI3QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQzVELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRCw4Q0FBOEM7SUFDdkMsMEJBQVksR0FBbkIsVUFBb0IsTUFBa0I7UUFDbEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDO1lBQ2hDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztZQUM3QixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsS0FBSyxFQUFFLE1BQU07U0FDaEIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRTtZQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDOUM7UUFDRCxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELHNFQUFzRTtJQUN6RCwwQkFBWSxHQUF6QixVQUEwQixXQUFtQixFQUFFLE1BQWM7UUFBZCx1Q0FBYzs7Ozs7O3dCQUN6RCxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFOzRCQUM3QyxzQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBQzt5QkFDM0M7Ozs7d0JBSWtCLG1DQUFjO3dCQUFFLHFCQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDOzt3QkFBekUsTUFBTSxHQUFHLGtCQUFlLENBQUMsU0FBZ0QsQ0FBQyxDQUFDLEdBQUcsRUFBQzt3QkFDL0UsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3RDLFNBQVMsR0FBRyxFQUFFLE1BQU0sVUFBRSxHQUFHLE9BQUUsQ0FBQzs7Ozt3QkFFNUIsR0FBQyxDQUFDLE9BQU8sR0FBRyxzQkFBb0IsV0FBVyxVQUFLLEdBQUMsQ0FBQyxPQUFTLENBQUM7d0JBQzVELE1BQU0sR0FBQyxDQUFDOzt3QkFFWixJQUFJLENBQUMsU0FBUyxFQUFFOzRCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQW1CLFdBQWEsQ0FBQyxDQUFDO3lCQUNyRDt3QkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQzVDLHNCQUFPLFNBQVMsRUFBQzs7OztLQUNwQjtJQUVELHFEQUFxRDtJQUN4QyxvQkFBTSxHQUFuQixVQUFvQixXQUFtQixFQUFFLE1BQWM7UUFBZCx1Q0FBYzs7Ozs0QkFDM0MscUJBQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDOzRCQUFwRCxzQkFBTyxDQUFDLFNBQTRDLENBQUMsQ0FBQyxHQUFHLEVBQUM7Ozs7S0FDN0Q7SUFFRCx1Q0FBdUM7SUFDMUIsZ0NBQWtCLEdBQS9CLFVBQWdDLFdBQWdCLEVBQUUsTUFBYztRQUFkLHVDQUFjOzs7OztnQkFDdEQsUUFBUSxHQUFhLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBa0IsSUFBYSxhQUFNLENBQUMsT0FBTyxFQUFkLENBQWMsQ0FBQyxDQUFDO2dCQUM3RixjQUFjLEdBQWdCLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxjQUFjLEdBQThCLFNBQUksY0FBYyxFQUFFLEdBQUcsQ0FDckUsVUFBTyxPQUFlOzs7Ozs7b0NBQ2xCLFlBQVksRUFBRSxPQUFPOztnQ0FBUSxxQkFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7b0NBRDFCLHVCQUNwQixNQUFHLEdBQUUsQ0FBQyxTQUF3QyxDQUFDLENBQUMsTUFBTTt1Q0FDL0U7OztxQkFBQSxDQUFDLENBQUM7Z0JBQ1Isc0JBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBQzs7O0tBQ3RDO0lBRUQseURBQXlEO0lBQzVDLHlCQUFXLEdBQXhCLFVBQXlCLFdBQW1CLEVBQUUsTUFBYztRQUFkLHVDQUFjOzs7Ozs7d0JBQ3hELElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7NEJBQzVDLHNCQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFDO3lCQUMxQzt3QkFDVyxxQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7O3dCQUE1QyxHQUFHLEdBQUcsU0FBc0M7d0JBQzVDLEtBQUssR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMzRCxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7OzRCQUM1QyxLQUE2QixpQkFBRyxDQUFDLE9BQU8sNkNBQUU7Z0NBQS9CLGFBQWMsRUFBWixnQkFBSSxFQUFFLElBQUk7Z0NBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7NkJBQy9DOzs7Ozs7Ozs7d0JBQ0ssTUFBTSxHQUFHLEVBQUUsS0FBSyxTQUFFLE9BQU8sV0FBRSxDQUFDO3dCQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQ3hDLHNCQUFPLE1BQU0sRUFBQzs7OztLQUNqQjtJQUVELHVHQUF1RztJQUNoRyx1QkFBUyxHQUFoQixVQUFpQixNQUF3QixFQUFFLElBQVksRUFBRSxLQUFVO1FBQy9ELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsb0hBQW9IO0lBQzdHLHlCQUFXLEdBQWxCLFVBQW1CLE1BQXdCLEVBQUUsSUFBWTtRQUNyRCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxzQ0FBc0M7SUFDL0Isa0NBQW9CLEdBQTNCLFVBQTRCLFdBQWdCO1FBQ3hDLElBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUN0RyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxhQUFhLGFBQ2hDLG1CQUFtQixFQUFFLENBQUMsRUFDdEIsZ0JBQWdCLEVBQUUsQ0FBQyxFQUNuQixTQUFTLEVBQUUsQ0FBQyxFQUNaLG9CQUFvQixFQUFFLEVBQUUsRUFDeEIsT0FBTyxFQUFFLEVBQUUsRUFDWCxzQkFBc0IsRUFBRSxFQUFFLElBQ3ZCLFdBQVcsRUFDaEIsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxnRUFBZ0U7SUFDekQsb0NBQXNCLEdBQTdCLFVBQThCLFdBQXVCO1FBQ2pELElBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUN0RyxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELDZCQUE2QjtJQUNoQiw4QkFBZ0IsR0FBN0IsVUFBOEIsT0FBcUI7Ozs7OzRCQUN4QyxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBTyxFQUFzQztnQ0FBcEMsb0JBQU8sRUFBRSxjQUFJLEVBQUUsZ0NBQWEsRUFBRSxjQUFJOzs7OztnREFDM0QscUJBQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7OzRDQUExQyxRQUFRLEdBQUcsU0FBK0I7NENBQ2hELHNCQUFPLEdBQUcsQ0FBQyxlQUFlLENBQ3RCLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUM7Ozs7eUJBQ3pGLENBQUMsQ0FBQzs0QkFKSCxzQkFBTyxTQUlKLEVBQUM7Ozs7S0FDUDtJQUVELCtCQUErQjtJQUNsQixnQ0FBa0IsR0FBL0IsVUFBZ0MsT0FBcUI7Ozs7OzRCQUMxQyxxQkFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBTyxFQUFzQztnQ0FBcEMsb0JBQU8sRUFBRSxjQUFJLEVBQUUsZ0NBQWEsRUFBRSxjQUFJOzs7OztnREFDM0QscUJBQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7OzRDQUExQyxRQUFRLEdBQUcsU0FBK0I7NENBQ2hELHNCQUFPLEdBQUcsQ0FBQyxpQkFBaUIsQ0FDeEIsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQzs7Ozt5QkFDekYsQ0FBQyxDQUFDOzRCQUpILHNCQUFPLFNBSUosRUFBQzs7OztLQUNQO0lBRUQsb0VBQW9FO0lBQ3ZELCtDQUFpQyxHQUE5QyxVQUErQyxXQUFnQzs7Ozs7O3dCQUMzRSxJQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVEsRUFBRTs0QkFDakMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7eUJBQ2xEO3dCQUNLLHVCQUF1QixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDN0MscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQzs7d0JBQXBGLG1CQUFtQixHQUFHLFNBQThEO3dCQUMxRixtQ0FBWSx1QkFBdUIsSUFBRSxPQUFPLEVBQUUsbUJBQW1CLEtBQUc7Ozs7S0FDdkU7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDVSxzQkFBUSxHQUFyQixVQUFzQixXQUFnQixFQUFFLEVBQ3dDO1lBRHhDLDRCQUN3QyxFQUR0QyxpQkFBZ0IsRUFBaEIscUNBQWdCLEVBQUUsOEJBQVksRUFBRSxnQ0FBYTs7Ozs7OzZCQUkvRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQWIsd0JBQWE7d0JBQ04scUJBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7O3dCQUFoQyxJQUFJLEdBQUcsU0FBeUIsQ0FBQzt3QkFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOzs7NkJBRzdCLFFBQU8sWUFBWSxLQUFLLFFBQVEsSUFBSSxhQUFhLEdBQWpELHdCQUFpRDs2QkFDN0MsQ0FBQyxJQUFJLEVBQUwsd0JBQUs7d0JBQ0UscUJBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7O3dCQUFoQyxJQUFJLEdBQUcsU0FBeUIsQ0FBQzs7NEJBRXBCLHFCQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsWUFBWSxDQUFDOzt3QkFBdkUsUUFBUSxHQUFHLFNBQTREO3dCQUM3RSxXQUFXLGdCQUFRLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLEVBQUssV0FBVyxDQUFFLENBQUM7Ozt3QkFHeEYsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsRUFBRTs0QkFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO3lCQUM3RTt3QkFFeUIscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQzs7d0JBQTlELElBQUksR0FBZ0IsU0FBMEM7a0NBQ2pELFdBQVc7O3dCQUFXLHFCQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDOzt3QkFBekYsV0FBVyxzQ0FBcUIsVUFBTyxHQUFFLFNBQWdELFFBQUUsQ0FBQzt3QkFDdEYscUJBQXFCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUMvQyxxQkFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUU7O3dCQUEvRCxhQUFhLEdBQUcsU0FBK0M7d0JBQ2hELHFCQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsRUFBRSxXQUFXLGVBQUUsYUFBYSxpQkFBRSxDQUFDOzt3QkFBM0YsWUFBWSxHQUFHLFNBQTRFO3dCQUM5RSxxQkFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO2dDQUNqRCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0NBQ3JCLFlBQVk7Z0NBQ1oscUJBQXFCO2dDQUNyQixJQUFJOzZCQUNQLENBQUM7O3dCQUxJLFVBQVUsR0FBRyxTQUtqQjt3QkFDSSxtQkFBbUIsR0FBRyxFQUFFLFVBQVUsY0FBRSxxQkFBcUIseUJBQUUsQ0FBQzt3QkFDbEUsSUFBSSxTQUFTLEVBQUU7NEJBQ1gsc0JBQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLEVBQUM7eUJBQzFEO3dCQUNELHNCQUFPLG1CQUFtQixFQUFDOzs7O0tBQzlCO0lBRUQscUNBQXFDO0lBQ3hCLG1DQUFxQixHQUFsQyxVQUFtQyxFQUEwRDtZQUF4RCwwQkFBVSxFQUFFLGdEQUFxQjs7O2dCQUNsRSxzQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDO3dCQUM3QixVQUFVO3dCQUNWLHFCQUFxQjtxQkFDeEIsQ0FBQyxFQUFDOzs7S0FDTjtJQUVELHVEQUF1RDtJQUMvQyxvQ0FBc0IsR0FBOUIsVUFBK0IsRUFBb0U7UUFBbEUsOEJBQVUsRUFBRSxnQ0FBYSxFQUFFLHNDQUFnQixFQUFFLDZFQUFjO1FBQ3hGLE9BQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLGFBQWEsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTCxVQUFDO0FBQUQsQ0FBQyxLQUFDLE1BQU07QUF0UEssa0JBQUc7Ozs7Ozs7Ozs7Ozs7QUN6RWhCOztHQUVHO0FBQ0gseUNBQXlDO0FBRTVCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUViLDJDQUEyQztBQUMzQyxJQUFNLFNBQVMsR0FBRyxtQkFBTyxDQUFDLGlDQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBc0MsQ0FBQztBQUV2RixJQUFNLFdBQVcsR0FBRyw0REFBNEQsQ0FBQztBQUNqRixJQUFNLFdBQVcsR0FBRyxrRUFBa0UsQ0FBQztBQUV2RjtJQUNJLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQWEsQ0FBQztJQUNoRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN6QyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQztJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUM7QUFFRCxJQUFNLFNBQVMsR0FBRyxpQkFBaUIsRUFBRSxDQUFDO0FBRXRDO0lBQ0ksSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBYSxDQUFDO0lBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3pDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzFDO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUVELElBQU0sU0FBUyxHQUFHLGlCQUFpQixFQUFFLENBQUM7QUFFdEMscUNBQXFDO0FBQ3JDLG9CQUEyQixNQUFrQjtJQUN6QyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFGRCxnQ0FFQztBQUVELHNCQUFzQjtBQUN0QixnQkFBdUIsTUFBa0I7SUFDckMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDcEMsSUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xCO0FBQ0wsQ0FBQztBQVBELHdCQU9DO0FBRUQ7OztHQUdHO0FBQ0gseUJBQWdDLElBQVksRUFBRSxDQUFTO0lBQ25ELElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQy9CLElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDckM7UUFDRCxJQUFJLEtBQUssR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQzNCLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZCxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQjtRQUNELElBQUksS0FBSyxFQUFFO1lBQ1AsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1NBQzdDO0tBQ0o7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBbEJELDBDQWtCQztBQUVEOzs7R0FHRztBQUNILCtCQUFzQyxJQUFZLEVBQUUsQ0FBUztJQUN6RCxJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDO0lBQzlCLElBQUksUUFBUSxFQUFFO1FBQ1YsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7SUFDRCxJQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLElBQUksUUFBUSxFQUFFO1FBQ1YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDN0M7S0FDSjtTQUFNLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUM3QztJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFmRCxzREFlQztBQUVEOzs7R0FHRztBQUNILHlCQUFnQyxNQUFrQixFQUFFLFNBQWE7SUFBYix5Q0FBYTtJQUM3RCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQWEsQ0FBQztJQUNwRSxLQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDekMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3BDLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN6RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDNUMsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1QjtLQUNKO0lBQ0QsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLE9BQU8sTUFBTSxDQUFDLFlBQVksT0FBbkIsTUFBTSxXQUFpQixNQUFNLEdBQUU7QUFDMUMsQ0FBQztBQWhCRCwwQ0FnQkM7QUFFRDs7O0dBR0c7QUFDSCwrQkFBc0MsTUFBa0IsRUFBRSxTQUFhO0lBQWIseUNBQWE7SUFDbkUsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDcEIsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNWLE9BQU8sR0FBRyxHQUFHLGVBQWUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDOUM7SUFDRCxPQUFPLGVBQWUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQVBELHNEQU9DO0FBRUQ7OztHQUdHO0FBQ0gsd0JBQStCLElBQVksRUFBRSxDQUFTO0lBQ2xELElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQy9CLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRTtZQUMzQixJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEI7UUFDRCxJQUFJLEtBQUssRUFBRTtZQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztTQUNwRDtLQUNKO0lBQ0QsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFsQkQsd0NBa0JDO0FBRUQ7OztHQUdHO0FBQ0gsd0JBQStCLE1BQWtCLEVBQUUsU0FBYTtJQUFiLHlDQUFhOztJQUM1RCxJQUFNLE1BQU0sR0FBRyxFQUFjLENBQUM7O1FBQzlCLEtBQW1CLDhCQUFNLGlGQUFFO1lBQXRCLElBQU0sSUFBSTtZQUNYLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDcEMsSUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUM5QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDeEI7WUFDRCxPQUFPLEtBQUssRUFBRTtnQkFDVixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDNUI7U0FDSjs7Ozs7Ozs7OztRQUNELEtBQW1CLDhCQUFNLGlGQUFFO1lBQXRCLElBQU0sSUFBSTtZQUNYLElBQUksSUFBSSxFQUFFO2dCQUNOLE1BQU07YUFDVDtpQkFBTTtnQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsQztTQUNKOzs7Ozs7Ozs7SUFDRCxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakIsT0FBTyxNQUFNLENBQUMsWUFBWSxPQUFuQixNQUFNLFdBQWlCLE1BQU0sR0FBRTtBQUMxQyxDQUFDO0FBdkJELHdDQXVCQztBQUVELDREQUE0RDtBQUM1RCx3QkFBK0IsQ0FBUztJQUNwQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1FBQ3ZDLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDWixDQUFDLDBCQUEwQjtJQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7S0FDNUQ7SUFDRCxJQUFNLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3hCLElBQUksS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDdkIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1FBQy9CLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDcEIsS0FBSyxJQUFJLENBQUMsQ0FBQztTQUNkO2FBQU07WUFDSCxLQUFLLElBQUksQ0FBQyxDQUFDO1NBQ2Q7S0FDSjtJQUNELElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXJDLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUU7UUFDekMsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDaEU7UUFDRCxJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssRUFBRTtZQUN2QixNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztTQUN4RDtLQUNKO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQWpDRCx3Q0FpQ0M7QUFRRCxpREFBaUQ7QUFDcEMseUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBRXBDLGtEQUFrRDtBQUNyQywwQkFBa0IsR0FBRyxFQUFFLENBQUM7QUFFckMsZ0RBQWdEO0FBQ25DLHlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQVFwQywrQkFBK0IsSUFBZ0IsRUFBRSxNQUFjO0lBQzNELElBQU0sQ0FBQyxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNwQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdDO0lBQ0QsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUVELHFCQUFxQixDQUFTLEVBQUUsSUFBYSxFQUFFLElBQVksRUFBRSxNQUFjO0lBQ3ZFLElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFDLElBQU0sTUFBTSxHQUFHLEVBQUUsSUFBSSxRQUFFLElBQUksRUFBRSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ3JFLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztXQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRTtRQUNuRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDN0M7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBRUQscUJBQXFCLEdBQVEsRUFBRSxNQUFjLEVBQUUsTUFBYztJQUN6RCxJQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkUsSUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3RDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFCO0lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN4QixLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFDO0lBQ0QsT0FBTyxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFFRCx3Q0FBd0M7QUFDeEMsMkJBQWtDLENBQVM7SUFDdkMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0tBQzVEO0lBQ0QsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7UUFDMUIsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLHlCQUFpQixHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBTSxHQUFHLEdBQUcsRUFBRSxJQUFJLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxVQUFVLENBQUMseUJBQWlCLENBQUMsRUFBRSxDQUFDO1FBQzFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyx5QkFBaUIsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUNELElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMseUJBQWlCLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQztlQUM5RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1NBQzdDO1FBQ0QsT0FBTyxHQUFHLENBQUM7S0FDZDtTQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQ3JDLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMseUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDeEU7U0FBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtRQUNyQyxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjLHlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hFO1NBQU07UUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDckQ7QUFDTCxDQUFDO0FBdkJELDhDQXVCQztBQUVELDZDQUE2QztBQUM3QywyQkFBa0MsR0FBUTtJQUN0QyxJQUFJLEdBQUcsQ0FBQyxJQUFJLGVBQWUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyx5QkFBaUIsRUFBRTtRQUNsRSxPQUFPLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQzVDO1NBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxlQUFlLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUsseUJBQWlCLEVBQUU7UUFDekUsT0FBTyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztLQUM1QztTQUFNO1FBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0tBQ3JEO0FBQ0wsQ0FBQztBQVJELDhDQVFDO0FBRUQ7O0dBRUc7QUFDSCxnQ0FBdUMsQ0FBUztJQUM1QyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtRQUMxQixPQUFPLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEQ7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFMRCx3REFLQztBQUVEOztHQUVHO0FBQ0gsaUNBQXdDLElBQWM7SUFDbEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUZELDBEQUVDO0FBRUQsd0NBQXdDO0FBQ3hDLDRCQUFtQyxDQUFTO0lBQ3hDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztLQUM3RDtJQUNELElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQzlCLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMsMEJBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDekU7U0FBTTtRQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztLQUN0RDtBQUNMLENBQUM7QUFURCxnREFTQztBQUVELDZDQUE2QztBQUM3Qyw0QkFBbUMsR0FBUTtJQUN2QyxJQUFJLEdBQUcsQ0FBQyxJQUFJLGVBQWUsRUFBRTtRQUN6QixPQUFPLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQzVDO1NBQU07UUFDSCxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7S0FDdEQ7QUFDTCxDQUFDO0FBTkQsZ0RBTUM7QUFFRCx3Q0FBd0M7QUFDeEMsMkJBQWtDLENBQVM7SUFDdkMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0tBQzNEO0lBQ0QsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFDOUIsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyx5QkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN4RTtTQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQ3JDLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGNBQWMseUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDeEU7U0FBTTtRQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztLQUNwRDtBQUNMLENBQUM7QUFYRCw4Q0FXQztBQUVELG1EQUFtRDtBQUNuRCwyQkFBa0MsU0FBYztJQUM1QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLGVBQWUsRUFBRTtRQUMvQixPQUFPLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ2xEO1NBQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxlQUFlLEVBQUU7UUFDdEMsT0FBTyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNsRDtTQUFNO1FBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQ3BEO0FBQ0wsQ0FBQztBQVJELDhDQVFDOzs7Ozs7Ozs7Ozs7O0FDblhEOztHQUVHO0FBRUgseUNBQXlDO0FBRTVCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR2IsbUZBQTJDO0FBYzNDLDhDQUE4QztBQUM5QztJQUFBO1FBQ0ksK0NBQStDO1FBQ3hDLDJCQUFzQixHQUFHLEtBQUssQ0FBQztJQUMxQyxDQUFDO0lBQUQsc0JBQUM7QUFBRCxDQUFDO0FBSFksMENBQWU7QUF5RTVCLHFDQUFxQztBQUNyQztJQWFJOzs7OztPQUtHO0lBQ0gsc0JBQVksRUFDb0U7WUFEcEUsNEJBQ29FLEVBRGxFLDRCQUFXLEVBQUUsNEJBQVcsRUFBRSxnQkFBSztRQVo3QyxxREFBcUQ7UUFDOUMsWUFBTyxHQUFHLENBQUMsQ0FBQztRQWFmLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxJQUFJLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLElBQUksSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsSUFBSSxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsa0VBQWtFO0lBQzNELDhCQUFPLEdBQWQsVUFBZSxJQUFZO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDekMsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDM0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsSUFBTSxRQUFRLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7SUFDMUIsQ0FBQztJQUVELHVDQUF1QztJQUNoQyxtQ0FBWSxHQUFuQjtRQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3RDLENBQUM7SUFFRCx5Q0FBeUM7SUFDbEMsa0NBQVcsR0FBbEI7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsbURBQW1EO0lBQzVDLG1DQUFZLEdBQW5CO1FBQ0ksT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxtQkFBbUI7SUFDWixnQ0FBUyxHQUFoQixVQUFpQixDQUF3QjtRQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM1QixDQUFDO0lBRUQsbUJBQW1CO0lBQ1osMkJBQUksR0FBWDtRQUFZLFdBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQsc0JBQWM7O1FBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELHdCQUF3QjtJQUNqQiwwQkFBRyxHQUFWO1FBQ0ksSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxvRUFBb0U7SUFDN0QsNENBQXFCLEdBQTVCLFVBQTZCLENBQWEsRUFBRSxHQUFXO1FBQ25ELElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7WUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsc0JBQXNCO0lBQ2Ysb0NBQWEsR0FBcEIsVUFBcUIsR0FBVztRQUM1QixJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQztRQUNwQixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsd0JBQXdCO0lBQ2pCLGlDQUFVLEdBQWpCLFVBQWtCLENBQVM7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELHFCQUFxQjtJQUNkLGdDQUFTLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckIsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsd0JBQXdCO0lBQ2pCLGlDQUFVLEdBQWpCLFVBQWtCLENBQVM7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQscUJBQXFCO0lBQ2QsZ0NBQVMsR0FBaEI7UUFDSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQixDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQixDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUN0QixDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUN0QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELDJFQUEyRTtJQUNwRSx5Q0FBa0IsR0FBekIsVUFBMEIsQ0FBUztRQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFVBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRDs7O09BR0c7SUFDSSx3Q0FBaUIsR0FBeEI7UUFDSSxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDN0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsVUFBWSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCwyQkFBMkI7SUFDcEIsb0NBQWEsR0FBcEIsVUFBcUIsQ0FBUztRQUMxQixPQUFPLElBQUksRUFBRTtZQUNULElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNmO2lCQUFNO2dCQUNILElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsTUFBTTthQUNUO1NBQ0o7SUFDTCxDQUFDO0lBRUQsd0JBQXdCO0lBQ2pCLG1DQUFZLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osT0FBTyxJQUFJLEVBQUU7WUFDVCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDckIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztZQUN2QixHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ1QsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFO2dCQUNiLE1BQU07YUFDVDtTQUNKO1FBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFRCwwQkFBMEI7SUFDbkIsbUNBQVksR0FBbkIsVUFBb0IsQ0FBUztRQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELHVCQUF1QjtJQUNoQixrQ0FBVyxHQUFsQjtRQUNJLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDUCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFVBQVcsQ0FBQztTQUNwQzthQUFNO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xCO0lBQ0wsQ0FBQztJQUVELHlCQUF5QjtJQUNsQixrQ0FBVyxHQUFsQixVQUFtQixDQUFTO1FBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxzQkFBc0I7SUFDZixpQ0FBVSxHQUFqQjtRQUNJLE9BQU8sSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQseUJBQXlCO0lBQ2xCLGtDQUFXLEdBQWxCLFVBQW1CLENBQVM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELHNCQUFzQjtJQUNmLGlDQUFVLEdBQWpCO1FBQ0ksT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxzQkFBc0I7SUFDZiwrQkFBUSxHQUFmLFVBQWdCLENBQVM7UUFDckIsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3REO1FBQ0Qsc0JBQXNCLENBQVM7WUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbEQsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbEQsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsT0FBTyxDQUFDLENBQUM7UUFDYixDQUFDO1FBQ0QsSUFBTSxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDL0IsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7Z0JBQ1QsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDZDtZQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtvQkFDVixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN0RCxFQUFFLEdBQUcsQ0FBQztpQkFDVDthQUNKO1NBQ0o7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxtQkFBbUI7SUFDWiw4QkFBTyxHQUFkO1FBQ0ksSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxJQUFJLEdBQUcsR0FBRyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRztZQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7b0JBQ1YsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxFQUFFLEdBQUcsQ0FBQztpQkFDVDthQUNKO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNSLE1BQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzVEO2lCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDZixNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUM1RDtpQkFBTTtnQkFDSCxNQUFNLElBQUksR0FBRyxDQUFDO2FBQ2pCO1NBQ0o7UUFDRCxJQUFJLE1BQU0sS0FBSyxlQUFlLEVBQUU7WUFDNUIsT0FBTyxNQUFNLENBQUM7U0FDakI7UUFDRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDekIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQseUNBQXlDO0lBQ2xDLGdDQUFTLEdBQWhCLFVBQWlCLENBQXdCO1FBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELHNDQUFzQztJQUMvQiwrQkFBUSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxzQkFBc0I7SUFDZixpQ0FBVSxHQUFqQixVQUFrQixDQUFTO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsbUJBQW1CO0lBQ1osZ0NBQVMsR0FBaEI7UUFDSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCwwRkFBMEY7SUFDbkYscUNBQWMsR0FBckIsVUFBc0IsSUFBWTtRQUM5QixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDN0Q7UUFDRCxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsSUFBSSxPQUFOLENBQUMsV0FBUyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRTtRQUN6QyxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDYjtRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsdUZBQXVGO0lBQ2hGLG9DQUFhLEdBQXBCO1FBQ0ksSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLEdBQUcsQ0FBQztRQUNSLEtBQUssR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRTtZQUNqQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNULE1BQU07YUFDVDtTQUNKO1FBQ0QsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEYsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELHdCQUF3QjtJQUNqQixpQ0FBVSxHQUFqQixVQUFrQixFQUF3RDtZQUF0RCxjQUFJLEVBQUUsd0JBQVM7UUFDL0IsSUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLElBQUksT0FBTixDQUFDLFdBQVMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUU7UUFDekMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELHFCQUFxQjtJQUNkLGdDQUFTLEdBQWhCO1FBQ0ksSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzdCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxHQUFHLENBQUM7UUFDUixLQUFLLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUU7WUFDakMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDVCxNQUFNO2FBQ1Q7U0FDSjtRQUNELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLE9BQU8sRUFBRSxJQUFJLFFBQUUsU0FBUyxhQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELHNCQUFzQjtJQUNmLGdDQUFTLEdBQWhCLFVBQWlCLENBQVM7UUFDdEIsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNiLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxHQUFHLENBQUM7WUFDZCxFQUFFLEdBQUcsQ0FBQztTQUNUO1FBQ0QsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2RyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsRUFBRSxHQUFHLENBQUM7U0FDVDtRQUNELElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDYixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7U0FDckQ7UUFDRCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDaEIsRUFBRSxHQUFHLENBQUM7WUFDTixPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZHLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLEVBQUUsU0FBUyxDQUFDO2dCQUNaLEVBQUUsR0FBRyxDQUFDO2FBQ1Q7U0FDSjtRQUNELElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksUUFBRSxTQUFTLGFBQUUsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxtQkFBbUI7SUFDWiwrQkFBUSxHQUFmO1FBQ0ksSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQix5QkFBc0MsRUFBcEMsY0FBSSxFQUFFLHdCQUFTLENBQXNCO1FBQzdDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksU0FBUyxFQUFFO1lBQ1gsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQztTQUNoRjtRQUNELE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELDBCQUEwQjtJQUNuQixvQ0FBYSxHQUFwQixVQUFxQixDQUFTO1FBQzFCLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsdUJBQXVCO0lBQ2hCLG1DQUFZLEdBQW5CO1FBQ0ksSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDM0QsT0FBTyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBRSxJQUFJLFFBQUUsSUFBSSxRQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsMkJBQTJCO0lBQ3BCLHFDQUFjLEdBQXJCLFVBQXNCLENBQVM7UUFDM0IsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCx3QkFBd0I7SUFDakIsb0NBQWEsR0FBcEI7UUFDSSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUM1RCxPQUFPLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUksUUFBRSxJQUFJLFFBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCx5QkFBeUI7SUFDbEIsb0NBQWEsR0FBcEIsVUFBcUIsQ0FBUztRQUMxQixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELHNCQUFzQjtJQUNmLG1DQUFZLEdBQW5CO1FBQ0ksSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDM0QsT0FBTyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBRSxJQUFJLFFBQUUsSUFBSSxRQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEtBQUMsZUFBZTtBQW5hSixvQ0FBWTtBQXFhekIsdUNBQXVDO0FBQ3ZDLDZCQUFvQyxPQUFlO0lBQy9DLE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRkQsa0RBRUM7QUFFRCx3QkFBd0IsSUFBWTtJQUNoQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDMUM7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBRUQsMkVBQTJFO0FBQzNFLHlCQUFnQyxJQUFZO0lBQ3hDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFGRCwwQ0FFQztBQUVELDJFQUEyRTtBQUMzRSx5QkFBZ0MsRUFBVTtJQUN0QyxJQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBSEQsMENBR0M7QUFFRCwyRUFBMkU7QUFDM0UsNEJBQW1DLElBQVk7SUFDM0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUZELGdEQUVDO0FBRUQsOEVBQThFO0FBQzlFLDRCQUFtQyxHQUFXO0lBQzFDLElBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDL0MsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFIRCxnREFHQztBQUVELGtHQUFrRztBQUNsRyw4QkFBcUMsSUFBWTtJQUM3QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3pFLENBQUM7QUFGRCxvREFFQztBQUVELHFHQUFxRztBQUNyRyw4QkFBcUMsSUFBWTtJQUM3QyxJQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM5RCxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUhELG9EQUdDO0FBRUQsOERBQThEO0FBQzlELHdCQUErQixDQUFTO0lBQ3BDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztLQUN4RDtJQUNELElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDNUMsQ0FBQztBQVRELHdDQVNDO0FBRUQsOERBQThEO0FBQzlELHdCQUErQixFQUF3RDtRQUF0RCxjQUFJLEVBQUUsd0JBQVM7SUFDNUMsT0FBTyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNsQyxDQUFDO0FBRkQsd0NBRUM7QUFFRCxpQ0FBaUM7QUFDakMsb0JBQTJCLElBQWdCOztJQUN2QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7O1FBQ2hCLEtBQWdCLDBCQUFJLHVFQUFFO1lBQWpCLElBQU0sQ0FBQztZQUNSLE1BQU0sSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0M7Ozs7Ozs7OztJQUNELE9BQU8sTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ2hDLENBQUM7QUFORCxnQ0FNQztBQUVELGlDQUFpQztBQUNqQyx5QkFBZ0MsR0FBVztJQUN2QyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtRQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7S0FDNUQ7SUFDRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUMvQztJQUNELElBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDeEIsSUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFqQkQsMENBaUJDO0FBRUQsMEJBQTBCLE1BQW9CLEVBQUUsSUFBUztJQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsNEJBQTRCLE1BQW9CO0lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFFRCx5QkFBcUMsTUFBb0IsRUFBRSxJQUFTLEVBQzNDLEtBQTZCLEVBQUUsZUFBc0I7SUFBckQsb0NBQVksZUFBZSxFQUFFO0lBQUUsd0RBQXNCOztJQUMxRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztLQUM3RDs7UUFDRCxLQUFvQixzQkFBSSxDQUFDLE1BQU0sNkNBQUU7WUFBNUIsSUFBTSxLQUFLO1lBQ1osSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtnQkFDcEIsSUFBSSxLQUFLLENBQUMsc0JBQXNCLEVBQUU7b0JBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDakU7Z0JBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQ2hCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxlQUFlLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxRztpQkFBTTtnQkFDSCxJQUFJLGVBQWUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDM0MsS0FBSyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztpQkFDdkM7cUJBQU07b0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7aUJBQ2xHO2FBQ0o7U0FDSjs7Ozs7Ozs7O0FBQ0wsQ0FBQztBQUVELDJCQUF1QyxNQUFvQixFQUFFLEtBQTZCLEVBQUUsZUFBc0I7SUFBckQsb0NBQVksZUFBZSxFQUFFO0lBQUUsd0RBQXNCOztJQUM5RyxJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtRQUNYLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQ2xFO1NBQU07UUFDSCxNQUFNLEdBQUcsRUFBRSxDQUFDO0tBQ2Y7O1FBQ0QsS0FBb0Isc0JBQUksQ0FBQyxNQUFNLDZDQUFFO1lBQTVCLElBQU0sS0FBSztZQUNaLElBQUksZUFBZSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUNyRSxLQUFLLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO2FBQ3ZDO2lCQUFNO2dCQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQzthQUMvRTtTQUNKOzs7Ozs7Ozs7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBRUQsMEJBQXNDLE1BQW9CLEVBQUUsSUFBUyxFQUMzQyxLQUF1QixFQUFFLGVBQXlCO0lBQ3hFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUMxRSxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7S0FDeEQ7SUFDRCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFDLEtBQVksSUFBSyxZQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO0lBQzFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdDQUE0QixDQUFDLENBQUM7S0FDakU7SUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQsNEJBQXdDLE1BQW9CLEVBQUUsS0FBdUIsRUFBRSxlQUF5QjtJQUM1RyxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDaEMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBYyxDQUFDLDhCQUEyQixDQUFDLENBQUM7S0FDL0Q7SUFDRCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBRUQsd0JBQW9DLE1BQW9CLEVBQUUsSUFBVyxFQUM3QyxLQUF1QixFQUFFLGVBQXlCOztJQUN0RSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7UUFDbEMsS0FBbUIsMEJBQUksdUVBQUU7WUFBcEIsSUFBTSxJQUFJO1lBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdEQ7Ozs7Ozs7OztBQUNMLENBQUM7QUFFRCwwQkFBc0MsTUFBb0IsRUFBRSxLQUF1QixFQUFFLGVBQXlCO0lBQzFHLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNsQyxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUMvRDtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFFRCwyQkFBdUMsTUFBb0IsRUFBRSxJQUFTLEVBQzNDLEtBQXVCLEVBQUUsZUFBeUI7SUFDekUsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQjtTQUFNO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQ25FO0FBQ0wsQ0FBQztBQUVELDZCQUF5QyxNQUFvQixFQUFFLEtBQXVCLEVBQUUsZUFBeUI7SUFDN0csSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDZCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7S0FDdEU7U0FBTTtRQUNILE9BQU8sSUFBSSxDQUFDO0tBQ2Y7QUFDTCxDQUFDO0FBRUQsNEJBQXdDLE1BQW9CLEVBQUUsSUFBUyxFQUMzQyxLQUF1QixFQUFFLGVBQXlCO0lBQzFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFFRCw4QkFBMEMsTUFBb0IsRUFBRSxLQUF1QixFQUFFLGVBQXlCO0lBQzlHLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBZUQsb0JBQW9CLEtBQXFCO0lBQ3JDLGtCQUNJLElBQUksRUFBRSxnQkFBZ0IsRUFDdEIsV0FBVyxFQUFFLEVBQUUsRUFDZixPQUFPLEVBQUUsSUFBSSxFQUNiLFVBQVUsRUFBRSxJQUFJLEVBQ2hCLFdBQVcsRUFBRSxJQUFJLEVBQ2pCLFFBQVEsRUFBRSxFQUFFLEVBQ1osSUFBSSxFQUFFLElBQUksRUFDVixNQUFNLEVBQUUsRUFBRSxFQUNWLFNBQVMsRUFBRSxnQkFBZ0IsRUFDM0IsV0FBVyxFQUFFLGtCQUFrQixJQUM1QixLQUFLLEVBQ1Y7QUFDTixDQUFDO0FBRUQsb0JBQW9CLElBQVksRUFBRSxTQUFpQjtJQUMvQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLEVBQUU7UUFDM0csTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDN0M7SUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ2pCLENBQUM7QUFFRCx5REFBeUQ7QUFDekQ7SUFDSSxJQUFNLE1BQU0sR0FBc0IsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUNyRCxJQUFJLEVBQUUsVUFBVSxDQUFDO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFhO2dCQUN6QyxJQUFJLE9BQU8sSUFBSSxLQUFLLFNBQVMsRUFBRTtvQkFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2lCQUM3QztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBQ0QsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMvRCxDQUFDO1FBQ0YsS0FBSyxFQUFFLFVBQVUsQ0FBQztZQUNkLElBQUksRUFBRSxPQUFPO1lBQ2IsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0YsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzdELENBQUM7UUFDRixJQUFJLEVBQUUsVUFBVSxDQUFDO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEcsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDekUsQ0FBQztRQUNGLE1BQU0sRUFBRSxVQUFVLENBQUM7WUFDZixJQUFJLEVBQUUsUUFBUTtZQUNkLFNBQVMsWUFBQyxNQUFvQixFQUFFLElBQVksSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JHLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRSxDQUFDO1FBQ0YsS0FBSyxFQUFFLFVBQVUsQ0FBQztZQUNkLElBQUksRUFBRSxPQUFPO1lBQ2IsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hHLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9FLENBQUM7UUFDRixNQUFNLEVBQUUsVUFBVSxDQUFDO1lBQ2YsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRyxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDbkUsQ0FBQztRQUNGLE1BQU0sRUFBRSxVQUFVLENBQUM7WUFDZixJQUFJLEVBQUUsUUFBUTtZQUNkLFNBQVMsWUFBQyxNQUFvQixFQUFFLElBQXFCO2dCQUNqRCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVELENBQUM7WUFDRCxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLE9BQU8sQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqRyxDQUFDO1FBQ0YsS0FBSyxFQUFFLFVBQVUsQ0FBQztZQUNkLElBQUksRUFBRSxPQUFPO1lBQ2IsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBcUI7Z0JBQ2pELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDO1lBQ0QsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxPQUFPLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2RyxDQUFDO1FBQ0YsS0FBSyxFQUFFLFVBQVUsQ0FBQztZQUNkLElBQUksRUFBRSxPQUFPO1lBQ2IsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEcsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2RSxDQUFDO1FBQ0YsU0FBUyxFQUFFLFVBQVUsQ0FBQztZQUNsQixJQUFJLEVBQUUsV0FBVztZQUNqQixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRyxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDdEUsQ0FBQztRQUNGLFFBQVEsRUFBRSxVQUFVLENBQUM7WUFDakIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEcsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3JFLENBQUM7UUFDRixPQUFPLEVBQUUsVUFBVSxDQUFDO1lBQ2hCLElBQUksRUFBRSxTQUFTO1lBQ2YsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNHLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sT0FBTyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xHLENBQUM7UUFDRixNQUFNLEVBQUUsVUFBVSxDQUFDO1lBQ2YsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZO2dCQUN4QyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkUsQ0FBQztZQUNELFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sT0FBTyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEcsQ0FBQztRQUNGLE9BQU8sRUFBRSxVQUFVLENBQUM7WUFDaEIsSUFBSSxFQUFFLFNBQVM7WUFDZixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0UsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3BFLENBQUM7UUFDRixPQUFPLEVBQUUsVUFBVSxDQUFDO1lBQ2hCLElBQUksRUFBRSxTQUFTO1lBQ2YsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNFLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNwRSxDQUFDO1FBQ0YsUUFBUSxFQUFFLFVBQVUsQ0FBQztZQUNqQixJQUFJLEVBQUUsVUFBVTtZQUNoQixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUcsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNyRixDQUFDO1FBRUYsS0FBSyxFQUFFLFVBQVUsQ0FBQztZQUNkLElBQUksRUFBRSxPQUFPO1lBQ2IsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFGLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5RSxDQUFDO1FBQ0YsTUFBTSxFQUFFLFVBQVUsQ0FBQztZQUNmLElBQUksRUFBRSxRQUFRO1lBQ2QsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRSxDQUFDO1FBQ0YsSUFBSSxFQUFFLFVBQVUsQ0FBQztZQUNiLElBQUksRUFBRSxNQUFNO1lBQ1osU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNqRSxDQUFDO1FBQ0YsVUFBVSxFQUFFLFVBQVUsQ0FBQztZQUNuQixJQUFJLEVBQUUsWUFBWTtZQUNsQixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRyxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1RixDQUFDO1FBQ0YsY0FBYyxFQUFFLFVBQVUsQ0FBQztZQUN2QixJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLFNBQVMsWUFBQyxNQUFvQixFQUFFLElBQVksSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlGLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZGLENBQUM7UUFDRixvQkFBb0IsRUFBRSxVQUFVLENBQUM7WUFDN0IsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRyxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6RixDQUFDO1FBQ0YsV0FBVyxFQUFFLFVBQVUsQ0FBQztZQUNwQixJQUFJLEVBQUUsYUFBYTtZQUNuQixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3ZFLENBQUM7UUFDRixNQUFNLEVBQUUsVUFBVSxDQUFDO1lBQ2YsSUFBSSxFQUFFLFFBQVE7WUFDZCxTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25GLENBQUM7UUFDRixLQUFLLEVBQUUsVUFBVSxDQUFDO1lBQ2QsSUFBSSxFQUFFLE9BQU87WUFDYixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2xFLENBQUM7UUFDRixXQUFXLEVBQUUsVUFBVSxDQUFDO1lBQ3BCLElBQUksRUFBRSxhQUFhO1lBQ25CLFNBQVMsWUFBQyxNQUFvQixFQUFFLElBQVksSUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRyxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JGLENBQUM7UUFDRixXQUFXLEVBQUUsVUFBVSxDQUFDO1lBQ3BCLElBQUksRUFBRSxhQUFhO1lBQ25CLFNBQVMsWUFBQyxNQUFvQixFQUFFLElBQVksSUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRyxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JGLENBQUM7UUFDRixXQUFXLEVBQUUsVUFBVSxDQUFDO1lBQ3BCLElBQUksRUFBRSxhQUFhO1lBQ25CLFNBQVMsWUFBQyxNQUFvQixFQUFFLElBQVksSUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRyxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JGLENBQUM7UUFDRixVQUFVLEVBQUUsVUFBVSxDQUFDO1lBQ25CLElBQUksRUFBRSxZQUFZO1lBQ2xCLFNBQVMsWUFBQyxNQUFvQixFQUFFLElBQVksSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RSxXQUFXLFlBQUMsTUFBb0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDdEUsQ0FBQztRQUNGLFdBQVcsRUFBRSxVQUFVLENBQUM7WUFDcEIsSUFBSSxFQUFFLGFBQWE7WUFDbkIsU0FBUyxZQUFDLE1BQW9CLEVBQUUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlFLFdBQVcsWUFBQyxNQUFvQixJQUFJLE9BQU8sTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2RSxDQUFDO1FBQ0YsU0FBUyxFQUFFLFVBQVUsQ0FBQztZQUNsQixJQUFJLEVBQUUsV0FBVztZQUNqQixTQUFTLFlBQUMsTUFBb0IsRUFBRSxJQUFZLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0UsV0FBVyxZQUFDLE1BQW9CLElBQUksT0FBTyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3RFLENBQUM7S0FDTCxDQUFDLENBQUMsQ0FBQztJQUVKLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDO1FBQ3BDLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsUUFBUSxFQUFFLEVBQUU7UUFDWixNQUFNLEVBQUU7WUFDSixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNsRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtTQUNuRTtRQUNELFNBQVMsRUFBRSxlQUFlO1FBQzFCLFdBQVcsRUFBRSxpQkFBaUI7S0FDakMsQ0FBQyxDQUFDLENBQUM7SUFFSixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUMsdUJBQXVCO0FBdkx6QixnREF1TEM7QUFFRCw0QkFBNEI7QUFDNUIsaUJBQXdCLEtBQXdCLEVBQUUsSUFBWTtJQUMxRCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDMUIsT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUMzQztJQUNELElBQUksSUFBSSxFQUFFO1FBQ04sT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNyQixPQUFPLFVBQVUsQ0FBQztZQUNkLElBQUk7WUFDSixPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hELFNBQVMsRUFBRSxjQUFjO1lBQ3pCLFdBQVcsRUFBRSxnQkFBZ0I7U0FDaEMsQ0FBQyxDQUFDO0tBQ047SUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxVQUFVLENBQUM7WUFDZCxJQUFJO1lBQ0osVUFBVSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzRCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFdBQVcsRUFBRSxtQkFBbUI7U0FDbkMsQ0FBQyxDQUFDO0tBQ047SUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxVQUFVLENBQUM7WUFDZCxJQUFJO1lBQ0osV0FBVyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1RCxTQUFTLEVBQUUsa0JBQWtCO1lBQzdCLFdBQVcsRUFBRSxvQkFBb0I7U0FDcEMsQ0FBQyxDQUFDO0tBQ047SUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFqQ0QsMEJBaUNDO0FBRUQ7Ozs7R0FJRztBQUNILHlCQUFnQyxZQUErQixFQUFFLEdBQVE7O0lBQ3JFLElBQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTs7WUFDWCxLQUFzQyxxQkFBRyxDQUFDLEtBQUssNkNBQUU7Z0JBQXRDLGlCQUF1QixFQUFyQixnQ0FBYSxFQUFFLGNBQUk7Z0JBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUNuQixVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDL0Q7Ozs7Ozs7OztLQUNKO0lBQ0QsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFOztZQUNiLEtBQXFDLHFCQUFHLENBQUMsT0FBTyw2Q0FBRTtnQkFBdkMsaUJBQXNCLEVBQXBCLGdCQUFJLEVBQUUsY0FBSSxFQUFFLGtCQUFNO2dCQUMzQixLQUFLLENBQUMsR0FBRyxDQUFDLE1BQUksRUFBRSxVQUFVLENBQUM7b0JBQ3ZCLElBQUk7b0JBQ0osUUFBUSxFQUFFLElBQUk7b0JBQ2QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFpQjs0QkFBZixXQUFPLEVBQUUsY0FBSTt3QkFBTyxRQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFBekMsQ0FBeUMsQ0FBQztvQkFDcEYsU0FBUyxFQUFFLGVBQWU7b0JBQzFCLFdBQVcsRUFBRSxpQkFBaUI7aUJBQ2pDLENBQUMsQ0FBQyxDQUFDO2FBQ1A7Ozs7Ozs7OztLQUNKO0lBQ0QsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFOztZQUNkLEtBQWlDLHFCQUFHLENBQUMsUUFBUSw2Q0FBRTtnQkFBcEMsaUJBQWtCLEVBQWhCLGdCQUFJLEVBQUUsWUFBUTtnQkFDdkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFJLEVBQUUsVUFBVSxDQUFDO29CQUN2QixJQUFJO29CQUNKLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLFFBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQXRDLENBQXNDLENBQUM7b0JBQzVELFNBQVMsRUFBRSxnQkFBZ0I7b0JBQzNCLFdBQVcsRUFBRSxrQkFBa0I7aUJBQ2xDLENBQUMsQ0FBQyxDQUFDO2FBQ1A7Ozs7Ozs7OztLQUNKOztRQUNELEtBQTJCLDRCQUFLLDRFQUFFO1lBQXZCLG1DQUFZLEVBQVgsY0FBSSxFQUFFLFlBQUk7WUFDbEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDN0M7O2dCQUNELEtBQW9CLHNCQUFJLENBQUMsTUFBTSw2Q0FBRTtvQkFBNUIsSUFBTSxLQUFLO29CQUNaLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQy9DOzs7Ozs7Ozs7U0FDSjs7Ozs7Ozs7O0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQyxDQUFDLGtCQUFrQjtBQXRDcEIsMENBc0NDO0FBRUQsd0hBQXdIO0FBQ3hILDJCQUFrQyxRQUF3QixFQUFFLGFBQXFCO0lBQzdFLE9BQU87UUFDSCxVQUFVLEVBQUUsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLGFBQWEsQ0FBQztRQUN0RixhQUFhLEVBQUUsUUFBUSxDQUFDLFNBQVMsR0FBRyxNQUFNO1FBQzFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxnQkFBZ0I7S0FDOUMsQ0FBQztBQUNOLENBQUM7QUFORCw4Q0FNQztBQUVELG1EQUFtRDtBQUNuRCw2QkFBb0MsUUFBa0IsRUFBRSxPQUFlLEVBQUUsSUFBWSxFQUFFLElBQVMsRUFDNUQsV0FBd0IsRUFBRSxXQUF3QjtJQUNsRixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBa0IsSUFBSSxxQkFBZ0IsT0FBUyxDQUFDLENBQUM7S0FDcEU7SUFDRCxJQUFNLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxFQUFFLFdBQVcsZUFBRSxXQUFXLGVBQUUsQ0FBQyxDQUFDO0lBQzlELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9CLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFURCxrREFTQztBQUVELHVDQUF1QztBQUN2Qyx5QkFBZ0MsUUFBa0IsRUFBRSxPQUFlLEVBQUUsSUFBWSxFQUNqRCxhQUE4QixFQUFFLElBQVMsRUFBRSxXQUF3QixFQUNuRSxXQUF3QjtJQUNwRCxPQUFPO1FBQ0gsT0FBTztRQUNQLElBQUk7UUFDSixhQUFhO1FBQ2IsSUFBSSxFQUFFLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDO0tBQ3JGLENBQUM7QUFDTixDQUFDO0FBVEQsMENBU0M7QUFFRCx3RkFBd0Y7QUFDeEYsK0JBQXNDLFFBQWtCLEVBQUUsT0FBZSxFQUFFLElBQVksRUFDakQsSUFBb0MsRUFBRSxXQUF3QixFQUM5RCxXQUF3QjtJQUMxRCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUMxQixJQUFJLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2hDO0lBQ0QsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLElBQUkscUJBQWdCLE9BQVMsQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsRUFBRSxXQUFXLGVBQUUsV0FBVyxlQUFFLENBQUMsQ0FBQztJQUM5RCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBYkQsc0RBYUM7QUFFRCxtRkFBbUY7QUFDbkYsMkJBQWtDLFFBQWtCLEVBQUUsT0FBZSxFQUFFLElBQVksRUFBRSxhQUE4QixFQUNqRixJQUFvQyxFQUFFLFdBQXdCLEVBQzlELFdBQXdCO0lBQ3RELE9BQU87UUFDSCxPQUFPO1FBQ1AsSUFBSTtRQUNKLGFBQWE7UUFDYixJQUFJLEVBQUUscUJBQXFCLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUM7S0FDdkYsQ0FBQztBQUNOLENBQUM7QUFURCw4Q0FTQzs7Ozs7Ozs7Ozs7OztBQ2prQ0Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLDRCQUE0QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJlb3Nqcy1kZWJ1Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2Vvc2pzLWFwaS50c1wiKTtcbiIsIi8qKlxuICogQG1vZHVsZSBBUElcbiAqL1xuXG4vLyBjb3B5cmlnaHQgZGVmaW5lZCBpbiBlb3Nqcy9MSUNFTlNFLnR4dFxuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgQWJpLCBHZXRJbmZvUmVzdWx0LCBKc29uUnBjLCBQdXNoVHJhbnNhY3Rpb25BcmdzIH0gZnJvbSBcIi4vZW9zanMtanNvbnJwY1wiO1xuaW1wb3J0IHsgYmFzZTY0VG9CaW5hcnkgfSBmcm9tIFwiLi9lb3Nqcy1udW1lcmljXCI7XG5pbXBvcnQgKiBhcyBzZXIgZnJvbSBcIi4vZW9zanMtc2VyaWFsaXplXCI7XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuY29uc3QgYWJpQWJpID0gcmVxdWlyZSgnLi4vc3JjL2FiaS5hYmkuanNvbicpO1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5jb25zdCB0cmFuc2FjdGlvbkFiaSA9IHJlcXVpcmUoJy4uL3NyYy90cmFuc2FjdGlvbi5hYmkuanNvbicpO1xuXG4vKiogUmVleHBvcnQgYGVvc2pzLXNlcmlhbGl6ZWAgKi9cbmV4cG9ydCBjb25zdCBzZXJpYWxpemUgPSBzZXI7XG5cbi8qKiBBcmd1bWVudHMgdG8gYGdldFJlcXVpcmVkS2V5c2AgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aG9yaXR5UHJvdmlkZXJBcmdzIHtcbiAgICAvKiogVHJhbnNhY3Rpb24gdGhhdCBuZWVkcyB0byBiZSBzaWduZWQgKi9cbiAgICB0cmFuc2FjdGlvbjogYW55O1xuXG4gICAgLyoqIFB1YmxpYyBrZXlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJpdmF0ZSBrZXlzIHRoYXQgdGhlIGBTaWduYXR1cmVQcm92aWRlcmAgaG9sZHMgKi9cbiAgICBhdmFpbGFibGVLZXlzOiBzdHJpbmdbXTtcbn1cblxuLyoqIEdldCBzdWJzZXQgb2YgYGF2YWlsYWJsZUtleXNgIG5lZWRlZCB0byBtZWV0IGF1dGhvcml0aWVzIGluIGB0cmFuc2FjdGlvbmAgKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aG9yaXR5UHJvdmlkZXIge1xuICAgIC8qKiBHZXQgc3Vic2V0IG9mIGBhdmFpbGFibGVLZXlzYCBuZWVkZWQgdG8gbWVldCBhdXRob3JpdGllcyBpbiBgdHJhbnNhY3Rpb25gICovXG4gICAgZ2V0UmVxdWlyZWRLZXlzOiAoYXJnczogQXV0aG9yaXR5UHJvdmlkZXJBcmdzKSA9PiBQcm9taXNlPHN0cmluZ1tdPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCaW5hcnlBYmkge1xuICAgIGFjY291bnRfbmFtZTogc3RyaW5nO1xuICAgIGFiaTogVWludDhBcnJheTtcbn1cblxuLyoqIEFyZ3VtZW50cyB0byBgc2lnbmAgKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2lnbmF0dXJlUHJvdmlkZXJBcmdzIHtcbiAgICAvKiogQ2hhaW4gdHJhbnNhY3Rpb24gaXMgZm9yICovXG4gICAgY2hhaW5JZDogc3RyaW5nO1xuXG4gICAgLyoqIFB1YmxpYyBrZXlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJpdmF0ZSBrZXlzIG5lZWRlZCB0byBzaWduIHRoZSB0cmFuc2FjdGlvbiAqL1xuICAgIHJlcXVpcmVkS2V5czogc3RyaW5nW107XG5cbiAgICAvKiogVHJhbnNhY3Rpb24gdG8gc2lnbiAqL1xuICAgIHNlcmlhbGl6ZWRUcmFuc2FjdGlvbjogVWludDhBcnJheTtcblxuICAgIC8qKiBBQklzIGZvciBhbGwgY29udHJhY3RzIHdpdGggYWN0aW9ucyBpbmNsdWRlZCBpbiBgc2VyaWFsaXplZFRyYW5zYWN0aW9uYCAqL1xuICAgIGFiaXM6IEJpbmFyeUFiaVtdO1xufVxuXG4vKiogU2lnbnMgdHJhbnNhY3Rpb25zICovXG5leHBvcnQgaW50ZXJmYWNlIFNpZ25hdHVyZVByb3ZpZGVyIHtcbiAgICAvKiogUHVibGljIGtleXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBwcml2YXRlIGtleXMgdGhhdCB0aGUgYFNpZ25hdHVyZVByb3ZpZGVyYCBob2xkcyAqL1xuICAgIGdldEF2YWlsYWJsZUtleXM6ICgpID0+IFByb21pc2U8c3RyaW5nW10+O1xuXG4gICAgLyoqIFNpZ24gYSB0cmFuc2FjdGlvbiAqL1xuICAgIHNpZ246IChhcmdzOiBTaWduYXR1cmVQcm92aWRlckFyZ3MpID0+IFByb21pc2U8c3RyaW5nW10+O1xufVxuXG4vKiogSG9sZHMgYSBmZXRjaGVkIGFiaSAqL1xuZXhwb3J0IGludGVyZmFjZSBDYWNoZWRBYmkge1xuICAgIC8qKiBhYmkgaW4gYmluYXJ5IGZvcm0gKi9cbiAgICByYXdBYmk6IFVpbnQ4QXJyYXk7XG5cbiAgICAvKiogYWJpIGluIHN0cnVjdHVyZWQgZm9ybSAqL1xuICAgIGFiaTogQWJpO1xufVxuXG5leHBvcnQgY2xhc3MgQXBpIHtcbiAgICAvKiogSXNzdWVzIFJQQyBjYWxscyAqL1xuICAgIHB1YmxpYyBycGM6IEpzb25ScGM7XG5cbiAgICAvKiogR2V0IHN1YnNldCBvZiBgYXZhaWxhYmxlS2V5c2AgbmVlZGVkIHRvIG1lZXQgYXV0aG9yaXRpZXMgaW4gYSBgdHJhbnNhY3Rpb25gICovXG4gICAgcHVibGljIGF1dGhvcml0eVByb3ZpZGVyOiBBdXRob3JpdHlQcm92aWRlcjtcblxuICAgIC8qKiBTaWducyB0cmFuc2FjdGlvbnMgKi9cbiAgICBwdWJsaWMgc2lnbmF0dXJlUHJvdmlkZXI6IFNpZ25hdHVyZVByb3ZpZGVyO1xuXG4gICAgLyoqIElkZW50aWZpZXMgY2hhaW4gKi9cbiAgICBwdWJsaWMgY2hhaW5JZDogc3RyaW5nO1xuXG4gICAgcHVibGljIHRleHRFbmNvZGVyOiBUZXh0RW5jb2RlcjtcbiAgICBwdWJsaWMgdGV4dERlY29kZXI6IFRleHREZWNvZGVyO1xuXG4gICAgLyoqIENvbnZlcnRzIGFiaSBmaWxlcyBiZXR3ZWVuIGJpbmFyeSBhbmQgc3RydWN0dXJlZCBmb3JtIChgYWJpLmFiaS5qc29uYCkgKi9cbiAgICBwdWJsaWMgYWJpVHlwZXM6IE1hcDxzdHJpbmcsIHNlci5UeXBlPjtcblxuICAgIC8qKiBDb252ZXJ0cyB0cmFuc2FjdGlvbnMgYmV0d2VlbiBiaW5hcnkgYW5kIHN0cnVjdHVyZWQgZm9ybSAoYHRyYW5zYWN0aW9uLmFiaS5qc29uYCkgKi9cbiAgICBwdWJsaWMgdHJhbnNhY3Rpb25UeXBlczogTWFwPHN0cmluZywgc2VyLlR5cGU+O1xuXG4gICAgLyoqIEhvbGRzIGluZm9ybWF0aW9uIG5lZWRlZCB0byBzZXJpYWxpemUgY29udHJhY3QgYWN0aW9ucyAqL1xuICAgIHB1YmxpYyBjb250cmFjdHMgPSBuZXcgTWFwPHN0cmluZywgc2VyLkNvbnRyYWN0PigpO1xuXG4gICAgLyoqIEZldGNoZWQgYWJpcyAqL1xuICAgIHB1YmxpYyBjYWNoZWRBYmlzID0gbmV3IE1hcDxzdHJpbmcsIENhY2hlZEFiaT4oKTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBhcmdzXG4gICAgICogICAgKiBgcnBjYDogSXNzdWVzIFJQQyBjYWxsc1xuICAgICAqICAgICogYGF1dGhvcml0eVByb3ZpZGVyYDogR2V0IHB1YmxpYyBrZXlzIG5lZWRlZCB0byBtZWV0IGF1dGhvcml0aWVzIGluIGEgdHJhbnNhY3Rpb25cbiAgICAgKiAgICAqIGBzaWduYXR1cmVQcm92aWRlcmA6IFNpZ25zIHRyYW5zYWN0aW9uc1xuICAgICAqICAgICogYGNoYWluSWRgOiBJZGVudGlmaWVzIGNoYWluXG4gICAgICogICAgKiBgdGV4dEVuY29kZXJgOiBgVGV4dEVuY29kZXJgIGluc3RhbmNlIHRvIHVzZS4gUGFzcyBpbiBgbnVsbGAgaWYgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAgICAgKiAgICAqIGB0ZXh0RGVjb2RlcmA6IGBUZXh0RGVjaWRlcmAgaW5zdGFuY2UgdG8gdXNlLiBQYXNzIGluIGBudWxsYCBpZiBydW5uaW5nIGluIGEgYnJvd3NlclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGFyZ3M6IHtcbiAgICAgICAgcnBjOiBKc29uUnBjLFxuICAgICAgICBhdXRob3JpdHlQcm92aWRlcj86IEF1dGhvcml0eVByb3ZpZGVyLFxuICAgICAgICBzaWduYXR1cmVQcm92aWRlcjogU2lnbmF0dXJlUHJvdmlkZXIsXG4gICAgICAgIGNoYWluSWQ6IHN0cmluZyxcbiAgICAgICAgdGV4dEVuY29kZXI/OiBUZXh0RW5jb2RlcixcbiAgICAgICAgdGV4dERlY29kZXI/OiBUZXh0RGVjb2RlcixcbiAgICB9KSB7XG4gICAgICAgIHRoaXMucnBjID0gYXJncy5ycGM7XG4gICAgICAgIHRoaXMuYXV0aG9yaXR5UHJvdmlkZXIgPSBhcmdzLmF1dGhvcml0eVByb3ZpZGVyIHx8IGFyZ3MucnBjO1xuICAgICAgICB0aGlzLnNpZ25hdHVyZVByb3ZpZGVyID0gYXJncy5zaWduYXR1cmVQcm92aWRlcjtcbiAgICAgICAgdGhpcy5jaGFpbklkID0gYXJncy5jaGFpbklkO1xuICAgICAgICB0aGlzLnRleHRFbmNvZGVyID0gYXJncy50ZXh0RW5jb2RlcjtcbiAgICAgICAgdGhpcy50ZXh0RGVjb2RlciA9IGFyZ3MudGV4dERlY29kZXI7XG5cbiAgICAgICAgdGhpcy5hYmlUeXBlcyA9IHNlci5nZXRUeXBlc0Zyb21BYmkoc2VyLmNyZWF0ZUluaXRpYWxUeXBlcygpLCBhYmlBYmkpO1xuICAgICAgICB0aGlzLnRyYW5zYWN0aW9uVHlwZXMgPSBzZXIuZ2V0VHlwZXNGcm9tQWJpKHNlci5jcmVhdGVJbml0aWFsVHlwZXMoKSwgdHJhbnNhY3Rpb25BYmkpO1xuICAgIH1cblxuICAgIC8qKiBEZWNvZGVzIGFuIGFiaSBhcyBVaW50OEFycmF5IGludG8ganNvbi4gKi9cbiAgICBwdWJsaWMgcmF3QWJpVG9Kc29uKHJhd0FiaTogVWludDhBcnJheSk6IEFiaSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBzZXIuU2VyaWFsQnVmZmVyKHtcbiAgICAgICAgICAgIHRleHRFbmNvZGVyOiB0aGlzLnRleHRFbmNvZGVyLFxuICAgICAgICAgICAgdGV4dERlY29kZXI6IHRoaXMudGV4dERlY29kZXIsXG4gICAgICAgICAgICBhcnJheTogcmF3QWJpLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFzZXIuc3VwcG9ydGVkQWJpVmVyc2lvbihidWZmZXIuZ2V0U3RyaW5nKCkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBhYmkgdmVyc2lvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIucmVzdGFydFJlYWQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWJpVHlwZXMuZ2V0KFwiYWJpX2RlZlwiKS5kZXNlcmlhbGl6ZShidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKiBHZXQgYWJpIGluIGJvdGggYmluYXJ5IGFuZCBzdHJ1Y3R1cmVkIGZvcm1zLiBGZXRjaCB3aGVuIG5lZWRlZC4gKi9cbiAgICBwdWJsaWMgYXN5bmMgZ2V0Q2FjaGVkQWJpKGFjY291bnROYW1lOiBzdHJpbmcsIHJlbG9hZCA9IGZhbHNlKTogUHJvbWlzZTxDYWNoZWRBYmk+IHtcbiAgICAgICAgaWYgKCFyZWxvYWQgJiYgdGhpcy5jYWNoZWRBYmlzLmdldChhY2NvdW50TmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlZEFiaXMuZ2V0KGFjY291bnROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY2FjaGVkQWJpOiBDYWNoZWRBYmk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyB0b2RvOiB1c2UgZ2V0X3Jhd19hYmkgd2hlbiBpdCBiZWNvbWVzIGF2YWlsYWJsZVxuICAgICAgICAgICAgY29uc3QgcmF3QWJpID0gYmFzZTY0VG9CaW5hcnkoKGF3YWl0IHRoaXMucnBjLmdldF9yYXdfY29kZV9hbmRfYWJpKGFjY291bnROYW1lKSkuYWJpKTtcbiAgICAgICAgICAgIGNvbnN0IGFiaSA9IHRoaXMucmF3QWJpVG9Kc29uKHJhd0FiaSk7XG4gICAgICAgICAgICBjYWNoZWRBYmkgPSB7IHJhd0FiaSwgYWJpIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGUubWVzc2FnZSA9IGBmZXRjaGluZyBhYmkgZm9yICR7YWNjb3VudE5hbWV9OiAke2UubWVzc2FnZX1gO1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNhY2hlZEFiaSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFiaSBmb3IgJHthY2NvdW50TmFtZX1gKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhY2hlZEFiaXMuc2V0KGFjY291bnROYW1lLCBjYWNoZWRBYmkpO1xuICAgICAgICByZXR1cm4gY2FjaGVkQWJpO1xuICAgIH1cblxuICAgIC8qKiBHZXQgYWJpIGluIHN0cnVjdHVyZWQgZm9ybS4gRmV0Y2ggd2hlbiBuZWVkZWQuICovXG4gICAgcHVibGljIGFzeW5jIGdldEFiaShhY2NvdW50TmFtZTogc3RyaW5nLCByZWxvYWQgPSBmYWxzZSk6IFByb21pc2U8QWJpPiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5nZXRDYWNoZWRBYmkoYWNjb3VudE5hbWUsIHJlbG9hZCkpLmFiaTtcbiAgICB9XG5cbiAgICAvKiogR2V0IGFiaXMgbmVlZGVkIGJ5IGEgdHJhbnNhY3Rpb24gKi9cbiAgICBwdWJsaWMgYXN5bmMgZ2V0VHJhbnNhY3Rpb25BYmlzKHRyYW5zYWN0aW9uOiBhbnksIHJlbG9hZCA9IGZhbHNlKTogUHJvbWlzZTxCaW5hcnlBYmlbXT4ge1xuICAgICAgICBjb25zdCBhY2NvdW50czogc3RyaW5nW10gPSB0cmFuc2FjdGlvbi5hY3Rpb25zLm1hcCgoYWN0aW9uOiBzZXIuQWN0aW9uKTogc3RyaW5nID0+IGFjdGlvbi5hY2NvdW50KTtcbiAgICAgICAgY29uc3QgdW5pcXVlQWNjb3VudHM6IFNldDxzdHJpbmc+ID0gbmV3IFNldChhY2NvdW50cyk7XG4gICAgICAgIGNvbnN0IGFjdGlvblByb21pc2VzOiBBcnJheTxQcm9taXNlPEJpbmFyeUFiaT4+ID0gWy4uLnVuaXF1ZUFjY291bnRzXS5tYXAoXG4gICAgICAgICAgICBhc3luYyAoYWNjb3VudDogc3RyaW5nKTogUHJvbWlzZTxCaW5hcnlBYmk+ID0+ICh7XG4gICAgICAgICAgICAgICAgYWNjb3VudF9uYW1lOiBhY2NvdW50LCBhYmk6IChhd2FpdCB0aGlzLmdldENhY2hlZEFiaShhY2NvdW50LCByZWxvYWQpKS5yYXdBYmksXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChhY3Rpb25Qcm9taXNlcyk7XG4gICAgfVxuXG4gICAgLyoqIEdldCBkYXRhIG5lZWRlZCB0byBzZXJpYWxpemUgYWN0aW9ucyBpbiBhIGNvbnRyYWN0ICovXG4gICAgcHVibGljIGFzeW5jIGdldENvbnRyYWN0KGFjY291bnROYW1lOiBzdHJpbmcsIHJlbG9hZCA9IGZhbHNlKTogUHJvbWlzZTxzZXIuQ29udHJhY3Q+IHtcbiAgICAgICAgaWYgKCFyZWxvYWQgJiYgdGhpcy5jb250cmFjdHMuZ2V0KGFjY291bnROYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udHJhY3RzLmdldChhY2NvdW50TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWJpID0gYXdhaXQgdGhpcy5nZXRBYmkoYWNjb3VudE5hbWUsIHJlbG9hZCk7XG4gICAgICAgIGNvbnN0IHR5cGVzID0gc2VyLmdldFR5cGVzRnJvbUFiaShzZXIuY3JlYXRlSW5pdGlhbFR5cGVzKCksIGFiaSk7XG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgc2VyLlR5cGU+KCk7XG4gICAgICAgIGZvciAoY29uc3QgeyBuYW1lLCB0eXBlIH0gb2YgYWJpLmFjdGlvbnMpIHtcbiAgICAgICAgICAgIGFjdGlvbnMuc2V0KG5hbWUsIHNlci5nZXRUeXBlKHR5cGVzLCB0eXBlKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0geyB0eXBlcywgYWN0aW9ucyB9O1xuICAgICAgICB0aGlzLmNvbnRyYWN0cy5zZXQoYWNjb3VudE5hbWUsIHJlc3VsdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqIENvbnZlcnQgYHZhbHVlYCB0byBiaW5hcnkgZm9ybS4gYHR5cGVgIG11c3QgYmUgYSBidWlsdC1pbiBhYmkgdHlwZSBvciBpbiBgdHJhbnNhY3Rpb24uYWJpLmpzb25gLiAqL1xuICAgIHB1YmxpYyBzZXJpYWxpemUoYnVmZmVyOiBzZXIuU2VyaWFsQnVmZmVyLCB0eXBlOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50cmFuc2FjdGlvblR5cGVzLmdldCh0eXBlKS5zZXJpYWxpemUoYnVmZmVyLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqIENvbnZlcnQgZGF0YSBpbiBgYnVmZmVyYCB0byBzdHJ1Y3R1cmVkIGZvcm0uIGB0eXBlYCBtdXN0IGJlIGEgYnVpbHQtaW4gYWJpIHR5cGUgb3IgaW4gYHRyYW5zYWN0aW9uLmFiaS5qc29uYC4gKi9cbiAgICBwdWJsaWMgZGVzZXJpYWxpemUoYnVmZmVyOiBzZXIuU2VyaWFsQnVmZmVyLCB0eXBlOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvblR5cGVzLmdldCh0eXBlKS5kZXNlcmlhbGl6ZShidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKiBDb252ZXJ0IGEgdHJhbnNhY3Rpb24gdG8gYmluYXJ5ICovXG4gICAgcHVibGljIHNlcmlhbGl6ZVRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uOiBhbnkpOiBVaW50OEFycmF5IHtcbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IHNlci5TZXJpYWxCdWZmZXIoeyB0ZXh0RW5jb2RlcjogdGhpcy50ZXh0RW5jb2RlciwgdGV4dERlY29kZXI6IHRoaXMudGV4dERlY29kZXIgfSk7XG4gICAgICAgIHRoaXMuc2VyaWFsaXplKGJ1ZmZlciwgXCJ0cmFuc2FjdGlvblwiLCB7XG4gICAgICAgICAgICBtYXhfbmV0X3VzYWdlX3dvcmRzOiAwLFxuICAgICAgICAgICAgbWF4X2NwdV91c2FnZV9tczogMCxcbiAgICAgICAgICAgIGRlbGF5X3NlYzogMCxcbiAgICAgICAgICAgIGNvbnRleHRfZnJlZV9hY3Rpb25zOiBbXSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtdLFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25fZXh0ZW5zaW9uczogW10sXG4gICAgICAgICAgICAuLi50cmFuc2FjdGlvbixcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBidWZmZXIuYXNVaW50OEFycmF5KCk7XG4gICAgfVxuXG4gICAgLyoqIENvbnZlcnQgYSB0cmFuc2FjdGlvbiBmcm9tIGJpbmFyeS4gTGVhdmVzIGFjdGlvbnMgaW4gaGV4LiAqL1xuICAgIHB1YmxpYyBkZXNlcmlhbGl6ZVRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uOiBVaW50OEFycmF5KTogYW55IHtcbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IHNlci5TZXJpYWxCdWZmZXIoeyB0ZXh0RW5jb2RlcjogdGhpcy50ZXh0RW5jb2RlciwgdGV4dERlY29kZXI6IHRoaXMudGV4dERlY29kZXIgfSk7XG4gICAgICAgIGJ1ZmZlci5wdXNoQXJyYXkodHJhbnNhY3Rpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5kZXNlcmlhbGl6ZShidWZmZXIsIFwidHJhbnNhY3Rpb25cIik7XG4gICAgfVxuXG4gICAgLyoqIENvbnZlcnQgYWN0aW9ucyB0byBoZXggKi9cbiAgICBwdWJsaWMgYXN5bmMgc2VyaWFsaXplQWN0aW9ucyhhY3Rpb25zOiBzZXIuQWN0aW9uW10pOiBQcm9taXNlPHNlci5TZXJpYWxpemVkQWN0aW9uW10+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKGFjdGlvbnMubWFwKGFzeW5jICh7IGFjY291bnQsIG5hbWUsIGF1dGhvcml6YXRpb24sIGRhdGEgfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udHJhY3QgPSBhd2FpdCB0aGlzLmdldENvbnRyYWN0KGFjY291bnQpO1xuICAgICAgICAgICAgcmV0dXJuIHNlci5zZXJpYWxpemVBY3Rpb24oXG4gICAgICAgICAgICAgICAgY29udHJhY3QsIGFjY291bnQsIG5hbWUsIGF1dGhvcml6YXRpb24sIGRhdGEsIHRoaXMudGV4dEVuY29kZXIsIHRoaXMudGV4dERlY29kZXIpO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgLyoqIENvbnZlcnQgYWN0aW9ucyBmcm9tIGhleCAqL1xuICAgIHB1YmxpYyBhc3luYyBkZXNlcmlhbGl6ZUFjdGlvbnMoYWN0aW9uczogc2VyLkFjdGlvbltdKTogUHJvbWlzZTxzZXIuQWN0aW9uW10+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKGFjdGlvbnMubWFwKGFzeW5jICh7IGFjY291bnQsIG5hbWUsIGF1dGhvcml6YXRpb24sIGRhdGEgfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udHJhY3QgPSBhd2FpdCB0aGlzLmdldENvbnRyYWN0KGFjY291bnQpO1xuICAgICAgICAgICAgcmV0dXJuIHNlci5kZXNlcmlhbGl6ZUFjdGlvbihcbiAgICAgICAgICAgICAgICBjb250cmFjdCwgYWNjb3VudCwgbmFtZSwgYXV0aG9yaXphdGlvbiwgZGF0YSwgdGhpcy50ZXh0RW5jb2RlciwgdGhpcy50ZXh0RGVjb2Rlcik7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKiogQ29udmVydCBhIHRyYW5zYWN0aW9uIGZyb20gYmluYXJ5LiBBbHNvIGRlc2VyaWFsaXplcyBhY3Rpb25zLiAqL1xuICAgIHB1YmxpYyBhc3luYyBkZXNlcmlhbGl6ZVRyYW5zYWN0aW9uV2l0aEFjdGlvbnModHJhbnNhY3Rpb246IFVpbnQ4QXJyYXkgfCBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBpZiAodHlwZW9mIHRyYW5zYWN0aW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbiA9IHNlci5oZXhUb1VpbnQ4QXJyYXkodHJhbnNhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlc2VyaWFsaXplZFRyYW5zYWN0aW9uID0gdGhpcy5kZXNlcmlhbGl6ZVRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKTtcbiAgICAgICAgY29uc3QgZGVzZXJpYWxpemVkQWN0aW9ucyA9IGF3YWl0IHRoaXMuZGVzZXJpYWxpemVBY3Rpb25zKGRlc2VyaWFsaXplZFRyYW5zYWN0aW9uLmFjdGlvbnMpO1xuICAgICAgICByZXR1cm4geyAuLi5kZXNlcmlhbGl6ZWRUcmFuc2FjdGlvbiwgYWN0aW9uczogZGVzZXJpYWxpemVkQWN0aW9ucyB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbmQgb3B0aW9uYWxseSBicm9hZGNhc3QgYSB0cmFuc2FjdGlvbi5cbiAgICAgKlxuICAgICAqIE5hbWVkIFBhcmFtZXRlcnM6XG4gICAgICogICAgKiBgYnJvYWRjYXN0YDogYnJvYWRjYXN0IHRoaXMgdHJhbnNhY3Rpb24/XG4gICAgICogICAgKiBJZiBib3RoIGBibG9ja3NCZWhpbmRgIGFuZCBgZXhwaXJlU2Vjb25kc2AgYXJlIHByZXNlbnQsXG4gICAgICogICAgICB0aGVuIGZldGNoIHRoZSBibG9jayB3aGljaCBpcyBgYmxvY2tzQmVoaW5kYCBiZWhpbmQgaGVhZCBibG9jayxcbiAgICAgKiAgICAgIHVzZSBpdCBhcyBhIHJlZmVyZW5jZSBmb3IgVEFQb1MsIGFuZCBleHBpcmUgdGhlIHRyYW5zYWN0aW9uIGBleHBpcmVTZWNvbmRzYCBhZnRlciB0aGF0IGJsb2NrJ3MgdGltZS5cbiAgICAgKiBAcmV0dXJucyBub2RlIHJlc3BvbnNlIGlmIGBicm9hZGNhc3RgLCBge3NpZ25hdHVyZXMsIHNlcmlhbGl6ZWRUcmFuc2FjdGlvbn1gIGlmIGAhYnJvYWRjYXN0YFxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyB0cmFuc2FjdCh0cmFuc2FjdGlvbjogYW55LCB7IGJyb2FkY2FzdCA9IHRydWUsIGJsb2Nrc0JlaGluZCwgZXhwaXJlU2Vjb25kcyB9OlxuICAgICAgICB7IGJyb2FkY2FzdD86IGJvb2xlYW47IGJsb2Nrc0JlaGluZD86IG51bWJlcjsgZXhwaXJlU2Vjb25kcz86IG51bWJlcjsgfSA9IHt9KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbGV0IGluZm86IEdldEluZm9SZXN1bHQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNoYWluSWQpIHtcbiAgICAgICAgICAgIGluZm8gPSBhd2FpdCB0aGlzLnJwYy5nZXRfaW5mbygpO1xuICAgICAgICAgICAgdGhpcy5jaGFpbklkID0gaW5mby5jaGFpbl9pZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgYmxvY2tzQmVoaW5kID09PSBcIm51bWJlclwiICYmIGV4cGlyZVNlY29uZHMpIHsgLy8gdXNlIGNvbmZpZyBmaWVsZHMgdG8gZ2VuZXJhdGUgVEFQT1MgaWYgdGhleSBleGlzdFxuICAgICAgICAgICAgaWYgKCFpbmZvKSB7XG4gICAgICAgICAgICAgICAgaW5mbyA9IGF3YWl0IHRoaXMucnBjLmdldF9pbmZvKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZWZCbG9jayA9IGF3YWl0IHRoaXMucnBjLmdldF9ibG9jayhpbmZvLmhlYWRfYmxvY2tfbnVtIC0gYmxvY2tzQmVoaW5kKTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uID0geyAuLi5zZXIudHJhbnNhY3Rpb25IZWFkZXIocmVmQmxvY2ssIGV4cGlyZVNlY29uZHMpLCAuLi50cmFuc2FjdGlvbiB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmhhc1JlcXVpcmVkVGFwb3NGaWVsZHModHJhbnNhY3Rpb24pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZXF1aXJlZCBjb25maWd1cmF0aW9uIG9yIFRBUE9TIGZpZWxkcyBhcmUgbm90IHByZXNlbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhYmlzOiBCaW5hcnlBYmlbXSA9IGF3YWl0IHRoaXMuZ2V0VHJhbnNhY3Rpb25BYmlzKHRyYW5zYWN0aW9uKTtcbiAgICAgICAgdHJhbnNhY3Rpb24gPSB7IC4uLnRyYW5zYWN0aW9uLCBhY3Rpb25zOiBhd2FpdCB0aGlzLnNlcmlhbGl6ZUFjdGlvbnModHJhbnNhY3Rpb24uYWN0aW9ucykgfTtcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplZFRyYW5zYWN0aW9uID0gdGhpcy5zZXJpYWxpemVUcmFuc2FjdGlvbih0cmFuc2FjdGlvbik7XG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZUtleXMgPSBhd2FpdCB0aGlzLnNpZ25hdHVyZVByb3ZpZGVyLmdldEF2YWlsYWJsZUtleXMoKTtcbiAgICAgICAgY29uc3QgcmVxdWlyZWRLZXlzID0gYXdhaXQgdGhpcy5hdXRob3JpdHlQcm92aWRlci5nZXRSZXF1aXJlZEtleXMoeyB0cmFuc2FjdGlvbiwgYXZhaWxhYmxlS2V5cyB9KTtcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlcyA9IGF3YWl0IHRoaXMuc2lnbmF0dXJlUHJvdmlkZXIuc2lnbih7XG4gICAgICAgICAgICBjaGFpbklkOiB0aGlzLmNoYWluSWQsXG4gICAgICAgICAgICByZXF1aXJlZEtleXMsXG4gICAgICAgICAgICBzZXJpYWxpemVkVHJhbnNhY3Rpb24sXG4gICAgICAgICAgICBhYmlzLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcHVzaFRyYW5zYWN0aW9uQXJncyA9IHsgc2lnbmF0dXJlcywgc2VyaWFsaXplZFRyYW5zYWN0aW9uIH07XG4gICAgICAgIGlmIChicm9hZGNhc3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnB1c2hTaWduZWRUcmFuc2FjdGlvbihwdXNoVHJhbnNhY3Rpb25BcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHVzaFRyYW5zYWN0aW9uQXJncztcbiAgICB9XG5cbiAgICAvKiogQnJvYWRjYXN0IGEgc2lnbmVkIHRyYW5zYWN0aW9uICovXG4gICAgcHVibGljIGFzeW5jIHB1c2hTaWduZWRUcmFuc2FjdGlvbih7IHNpZ25hdHVyZXMsIHNlcmlhbGl6ZWRUcmFuc2FjdGlvbiB9OiBQdXNoVHJhbnNhY3Rpb25BcmdzKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnBjLnB1c2hfdHJhbnNhY3Rpb24oe1xuICAgICAgICAgICAgc2lnbmF0dXJlcyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZWRUcmFuc2FjdGlvbixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gZXZlbnR1YWxseSBicmVhayBvdXQgaW50byBUcmFuc2FjdGlvblZhbGlkYXRvciBjbGFzc1xuICAgIHByaXZhdGUgaGFzUmVxdWlyZWRUYXBvc0ZpZWxkcyh7IGV4cGlyYXRpb24sIHJlZl9ibG9ja19udW0sIHJlZl9ibG9ja19wcmVmaXgsIC4uLnRyYW5zYWN0aW9uIH06IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEoZXhwaXJhdGlvbiAmJiByZWZfYmxvY2tfbnVtICYmIHJlZl9ibG9ja19wcmVmaXgpO1xuICAgIH1cblxufSAvLyBBcGlcbiIsIi8qKlxuICogQG1vZHVsZSBOdW1lcmljXG4gKi9cbi8vIGNvcHlyaWdodCBkZWZpbmVkIGluIGVvc2pzL0xJQ0VOU0UudHh0XG5cblwidXNlIHN0cmljdFwiO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdmFyLXJlcXVpcmVzXG5jb25zdCByaXBlbWQxNjAgPSByZXF1aXJlKFwiLi9yaXBlbWRcIikuUklQRU1EMTYwLmhhc2ggYXMgKGE6IFVpbnQ4QXJyYXkpID0+IEFycmF5QnVmZmVyO1xuXG5jb25zdCBiYXNlNThDaGFycyA9IFwiMTIzNDU2Nzg5QUJDREVGR0hKS0xNTlBRUlNUVVZXWFlaYWJjZGVmZ2hpamttbm9wcXJzdHV2d3h5elwiO1xuY29uc3QgYmFzZTY0Q2hhcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIjtcblxuZnVuY3Rpb24gY3JlYXRlX2Jhc2U1OF9tYXAoKSB7XG4gICAgY29uc3QgYmFzZTU4TSA9IEFycmF5KDI1NikuZmlsbCgtMSkgYXMgbnVtYmVyW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiYXNlNThDaGFycy5sZW5ndGg7ICsraSkge1xuICAgICAgICBiYXNlNThNW2Jhc2U1OENoYXJzLmNoYXJDb2RlQXQoaSldID0gaTtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2U1OE07XG59XG5cbmNvbnN0IGJhc2U1OE1hcCA9IGNyZWF0ZV9iYXNlNThfbWFwKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZV9iYXNlNjRfbWFwKCkge1xuICAgIGNvbnN0IGJhc2U2NE0gPSBBcnJheSgyNTYpLmZpbGwoLTEpIGFzIG51bWJlcltdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmFzZTY0Q2hhcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgYmFzZTY0TVtiYXNlNjRDaGFycy5jaGFyQ29kZUF0KGkpXSA9IGk7XG4gICAgfVxuICAgIGJhc2U2NE1bXCI9XCIuY2hhckNvZGVBdCgwKV0gPSAwO1xuICAgIHJldHVybiBiYXNlNjRNO1xufVxuXG5jb25zdCBiYXNlNjRNYXAgPSBjcmVhdGVfYmFzZTY0X21hcCgpO1xuXG4vKiogSXMgYGJpZ251bWAgYSBuZWdhdGl2ZSBudW1iZXI/ICovXG5leHBvcnQgZnVuY3Rpb24gaXNOZWdhdGl2ZShiaWdudW06IFVpbnQ4QXJyYXkpIHtcbiAgICByZXR1cm4gKGJpZ251bVtiaWdudW0ubGVuZ3RoIC0gMV0gJiAweDgwKSAhPT0gMDtcbn1cblxuLyoqIE5lZ2F0ZSBgYmlnbnVtYCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5lZ2F0ZShiaWdudW06IFVpbnQ4QXJyYXkpIHtcbiAgICBsZXQgY2FycnkgPSAxO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmlnbnVtLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IHggPSAofmJpZ251bVtpXSAmIDB4ZmYpICsgY2Fycnk7XG4gICAgICAgIGJpZ251bVtpXSA9IHg7XG4gICAgICAgIGNhcnJ5ID0geCA+PiA4O1xuICAgIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIHVuc2lnbmVkIGRlY2ltYWwgbnVtYmVyIGluIGBzYCB0byBhIGJpZ251bVxuICogQHBhcmFtIHNpemUgYmlnbnVtIHNpemUgKGJ5dGVzKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjaW1hbFRvQmluYXJ5KHNpemU6IG51bWJlciwgczogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IHNyY0RpZ2l0ID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoc3JjRGlnaXQgPCBcIjBcIi5jaGFyQ29kZUF0KDApIHx8IHNyY0RpZ2l0ID4gXCI5XCIuY2hhckNvZGVBdCgwKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBudW1iZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNhcnJ5ID0gc3JjRGlnaXQgLSBcIjBcIi5jaGFyQ29kZUF0KDApO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7ICsraikge1xuICAgICAgICAgICAgY29uc3QgeCA9IHJlc3VsdFtqXSAqIDEwICsgY2Fycnk7XG4gICAgICAgICAgICByZXN1bHRbal0gPSB4O1xuICAgICAgICAgICAgY2FycnkgPSB4ID4+IDg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhcnJ5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJudW1iZXIgaXMgb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29udmVydCBhIHNpZ25lZCBkZWNpbWFsIG51bWJlciBpbiBgc2AgdG8gYSBiaWdudW1cbiAqIEBwYXJhbSBzaXplIGJpZ251bSBzaXplIChieXRlcylcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpZ25lZERlY2ltYWxUb0JpbmFyeShzaXplOiBudW1iZXIsIHM6IHN0cmluZykge1xuICAgIGNvbnN0IG5lZ2F0aXZlID0gc1swXSA9PT0gXCItXCI7XG4gICAgaWYgKG5lZ2F0aXZlKSB7XG4gICAgICAgIHMgPSBzLnN1YnN0cigxKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gZGVjaW1hbFRvQmluYXJ5KHNpemUsIHMpO1xuICAgIGlmIChuZWdhdGl2ZSkge1xuICAgICAgICBuZWdhdGUocmVzdWx0KTtcbiAgICAgICAgaWYgKCFpc05lZ2F0aXZlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm51bWJlciBpcyBvdXQgb2YgcmFuZ2VcIik7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzTmVnYXRpdmUocmVzdWx0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJudW1iZXIgaXMgb3V0IG9mIHJhbmdlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvbnZlcnQgYGJpZ251bWAgdG8gYW4gdW5zaWduZWQgZGVjaW1hbCBudW1iZXJcbiAqIEBwYXJhbSBtaW5EaWdpdHMgMC1wYWQgcmVzdWx0IHRvIHRoaXMgbWFueSBkaWdpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmFyeVRvRGVjaW1hbChiaWdudW06IFVpbnQ4QXJyYXksIG1pbkRpZ2l0cyA9IDEpIHtcbiAgICBjb25zdCByZXN1bHQgPSBBcnJheShtaW5EaWdpdHMpLmZpbGwoXCIwXCIuY2hhckNvZGVBdCgwKSkgYXMgbnVtYmVyW107XG4gICAgZm9yIChsZXQgaSA9IGJpZ251bS5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBsZXQgY2FycnkgPSBiaWdudW1baV07XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVzdWx0Lmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gKChyZXN1bHRbal0gLSBcIjBcIi5jaGFyQ29kZUF0KDApKSA8PCA4KSArIGNhcnJ5O1xuICAgICAgICAgICAgcmVzdWx0W2pdID0gXCIwXCIuY2hhckNvZGVBdCgwKSArIHggJSAxMDtcbiAgICAgICAgICAgIGNhcnJ5ID0gKHggLyAxMCkgfCAwO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChjYXJyeSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goXCIwXCIuY2hhckNvZGVBdCgwKSArIGNhcnJ5ICUgMTApO1xuICAgICAgICAgICAgY2FycnkgPSAoY2FycnkgLyAxMCkgfCAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoLi4ucmVzdWx0KTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGBiaWdudW1gIHRvIGEgc2lnbmVkIGRlY2ltYWwgbnVtYmVyXG4gKiBAcGFyYW0gbWluRGlnaXRzIDAtcGFkIHJlc3VsdCB0byB0aGlzIG1hbnkgZGlnaXRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaWduZWRCaW5hcnlUb0RlY2ltYWwoYmlnbnVtOiBVaW50OEFycmF5LCBtaW5EaWdpdHMgPSAxKSB7XG4gICAgaWYgKGlzTmVnYXRpdmUoYmlnbnVtKSkge1xuICAgICAgICBjb25zdCB4ID0gYmlnbnVtLnNsaWNlKCk7XG4gICAgICAgIG5lZ2F0ZSh4KTtcbiAgICAgICAgcmV0dXJuIFwiLVwiICsgYmluYXJ5VG9EZWNpbWFsKHgsIG1pbkRpZ2l0cyk7XG4gICAgfVxuICAgIHJldHVybiBiaW5hcnlUb0RlY2ltYWwoYmlnbnVtLCBtaW5EaWdpdHMpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgYW4gdW5zaWduZWQgYmFzZS01OCBudW1iZXIgaW4gYHNgIHRvIGEgYmlnbnVtXG4gKiBAcGFyYW0gc2l6ZSBiaWdudW0gc2l6ZSAoYnl0ZXMpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiYXNlNThUb0JpbmFyeShzaXplOiBudW1iZXIsIHM6IHN0cmluZykge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgY2FycnkgPSBiYXNlNThNYXBbcy5jaGFyQ29kZUF0KGkpXTtcbiAgICAgICAgaWYgKGNhcnJ5IDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBiYXNlLTU4IHZhbHVlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgKytqKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gcmVzdWx0W2pdICogNTggKyBjYXJyeTtcbiAgICAgICAgICAgIHJlc3VsdFtqXSA9IHg7XG4gICAgICAgICAgICBjYXJyeSA9IHggPj4gODtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FycnkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImJhc2UtNTggdmFsdWUgaXMgb3V0IG9mIHJhbmdlXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGBiaWdudW1gIHRvIGEgYmFzZS01OCBudW1iZXJcbiAqIEBwYXJhbSBtaW5EaWdpdHMgMC1wYWQgcmVzdWx0IHRvIHRoaXMgbWFueSBkaWdpdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmFyeVRvQmFzZTU4KGJpZ251bTogVWludDhBcnJheSwgbWluRGlnaXRzID0gMSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdIGFzIG51bWJlcltdO1xuICAgIGZvciAoY29uc3QgYnl0ZSBvZiBiaWdudW0pIHtcbiAgICAgICAgbGV0IGNhcnJ5ID0gYnl0ZTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZXN1bHQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSAoYmFzZTU4TWFwW3Jlc3VsdFtqXV0gPDwgOCkgKyBjYXJyeTtcbiAgICAgICAgICAgIHJlc3VsdFtqXSA9IGJhc2U1OENoYXJzLmNoYXJDb2RlQXQoeCAlIDU4KTtcbiAgICAgICAgICAgIGNhcnJ5ID0gKHggLyA1OCkgfCAwO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChjYXJyeSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goYmFzZTU4Q2hhcnMuY2hhckNvZGVBdChjYXJyeSAlIDU4KSk7XG4gICAgICAgICAgICBjYXJyeSA9IChjYXJyeSAvIDU4KSB8IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBieXRlIG9mIGJpZ251bSkge1xuICAgICAgICBpZiAoYnl0ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChcIjFcIi5jaGFyQ29kZUF0KDApKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQucmV2ZXJzZSgpO1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLnJlc3VsdCk7XG59XG5cbi8qKiBDb252ZXJ0IGFuIHVuc2lnbmVkIGJhc2UtNjQgbnVtYmVyIGluIGBzYCB0byBhIGJpZ251bSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFRvQmluYXJ5KHM6IHN0cmluZykge1xuICAgIGxldCBsZW4gPSBzLmxlbmd0aDtcbiAgICBpZiAoKGxlbiAmIDMpID09PSAxICYmIHNbbGVuIC0gMV0gPT09IFwiPVwiKSB7XG4gICAgICAgIGxlbiAtPSAxO1xuICAgIH0gLy8gZmMgYXBwZW5kcyBhbiBleHRyYSAnPSdcbiAgICBpZiAoKGxlbiAmIDMpICE9PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImJhc2UtNjQgdmFsdWUgaXMgbm90IHBhZGRlZCBjb3JyZWN0bHlcIik7XG4gICAgfVxuICAgIGNvbnN0IGdyb3VwcyA9IGxlbiA+PiAyO1xuICAgIGxldCBieXRlcyA9IGdyb3VwcyAqIDM7XG4gICAgaWYgKGxlbiA+IDAgJiYgc1tsZW4gLSAxXSA9PT0gXCI9XCIpIHtcbiAgICAgICAgaWYgKHNbbGVuIC0gMl0gPT09IFwiPVwiKSB7XG4gICAgICAgICAgICBieXRlcyAtPSAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnl0ZXMgLT0gMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgVWludDhBcnJheShieXRlcyk7XG5cbiAgICBmb3IgKGxldCBncm91cCA9IDA7IGdyb3VwIDwgZ3JvdXBzOyArK2dyb3VwKSB7XG4gICAgICAgIGNvbnN0IGRpZ2l0MCA9IGJhc2U2NE1hcFtzLmNoYXJDb2RlQXQoZ3JvdXAgKiA0ICsgMCldO1xuICAgICAgICBjb25zdCBkaWdpdDEgPSBiYXNlNjRNYXBbcy5jaGFyQ29kZUF0KGdyb3VwICogNCArIDEpXTtcbiAgICAgICAgY29uc3QgZGlnaXQyID0gYmFzZTY0TWFwW3MuY2hhckNvZGVBdChncm91cCAqIDQgKyAyKV07XG4gICAgICAgIGNvbnN0IGRpZ2l0MyA9IGJhc2U2NE1hcFtzLmNoYXJDb2RlQXQoZ3JvdXAgKiA0ICsgMyldO1xuICAgICAgICByZXN1bHRbZ3JvdXAgKiAzICsgMF0gPSAoZGlnaXQwIDw8IDIpIHwgKGRpZ2l0MSA+PiA0KTtcbiAgICAgICAgaWYgKGdyb3VwICogMyArIDEgPCBieXRlcykge1xuICAgICAgICAgICAgcmVzdWx0W2dyb3VwICogMyArIDFdID0gKChkaWdpdDEgJiAxNSkgPDwgNCkgfCAoZGlnaXQyID4+IDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChncm91cCAqIDMgKyAyIDwgYnl0ZXMpIHtcbiAgICAgICAgICAgIHJlc3VsdFtncm91cCAqIDMgKyAyXSA9ICgoZGlnaXQyICYgMykgPDwgNikgfCBkaWdpdDM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqIEtleSB0eXBlcyB0aGlzIGxpYnJhcnkgc3VwcG9ydHMgKi9cbmV4cG9ydCBjb25zdCBlbnVtIEtleVR5cGUge1xuICAgIGsxID0gMCxcbiAgICByMSA9IDEsXG59XG5cbi8qKiBQdWJsaWMga2V5IGRhdGEgc2l6ZSwgZXhjbHVkaW5nIHR5cGUgZmllbGQgKi9cbmV4cG9ydCBjb25zdCBwdWJsaWNLZXlEYXRhU2l6ZSA9IDMzO1xuXG4vKiogUHJpdmF0ZSBrZXkgZGF0YSBzaXplLCBleGNsdWRpbmcgdHlwZSBmaWVsZCAqL1xuZXhwb3J0IGNvbnN0IHByaXZhdGVLZXlEYXRhU2l6ZSA9IDMyO1xuXG4vKiogU2lnbmF0dXJlIGRhdGEgc2l6ZSwgZXhjbHVkaW5nIHR5cGUgZmllbGQgKi9cbmV4cG9ydCBjb25zdCBzaWduYXR1cmVEYXRhU2l6ZSA9IDY1O1xuXG4vKiogUHVibGljIGtleSwgcHJpdmF0ZSBrZXksIG9yIHNpZ25hdHVyZSBpbiBiaW5hcnkgZm9ybSAqL1xuZXhwb3J0IGludGVyZmFjZSBLZXkge1xuICAgIHR5cGU6IEtleVR5cGU7XG4gICAgZGF0YTogVWludDhBcnJheTtcbn1cblxuZnVuY3Rpb24gZGlnZXN0U3VmZml4UmlwZW1kMTYwKGRhdGE6IFVpbnQ4QXJyYXksIHN1ZmZpeDogc3RyaW5nKSB7XG4gICAgY29uc3QgZCA9IG5ldyBVaW50OEFycmF5KGRhdGEubGVuZ3RoICsgc3VmZml4Lmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGRbaV0gPSBkYXRhW2ldO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1ZmZpeC5sZW5ndGg7ICsraSkge1xuICAgICAgICBkW2RhdGEubGVuZ3RoICsgaV0gPSBzdWZmaXguY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJpcGVtZDE2MChkKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5nVG9LZXkoczogc3RyaW5nLCB0eXBlOiBLZXlUeXBlLCBzaXplOiBudW1iZXIsIHN1ZmZpeDogc3RyaW5nKTogS2V5IHtcbiAgICBjb25zdCB3aG9sZSA9IGJhc2U1OFRvQmluYXJ5KHNpemUgKyA0LCBzKTtcbiAgICBjb25zdCByZXN1bHQgPSB7IHR5cGUsIGRhdGE6IG5ldyBVaW50OEFycmF5KHdob2xlLmJ1ZmZlciwgMCwgc2l6ZSkgfTtcbiAgICBjb25zdCBkaWdlc3QgPSBuZXcgVWludDhBcnJheShkaWdlc3RTdWZmaXhSaXBlbWQxNjAocmVzdWx0LmRhdGEsIHN1ZmZpeCkpO1xuICAgIGlmIChkaWdlc3RbMF0gIT09IHdob2xlW3NpemUgKyAwXSB8fCBkaWdlc3RbMV0gIT09IHdob2xlW3NpemUgKyAxXVxuICAgICAgICB8fCBkaWdlc3RbMl0gIT09IHdob2xlW3NpemUgKyAyXSB8fCBkaWdlc3RbM10gIT09IHdob2xlW3NpemUgKyAzXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjaGVja3N1bSBkb2Vzbid0IG1hdGNoXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBrZXlUb1N0cmluZyhrZXk6IEtleSwgc3VmZml4OiBzdHJpbmcsIHByZWZpeDogc3RyaW5nKSB7XG4gICAgY29uc3QgZGlnZXN0ID0gbmV3IFVpbnQ4QXJyYXkoZGlnZXN0U3VmZml4UmlwZW1kMTYwKGtleS5kYXRhLCBzdWZmaXgpKTtcbiAgICBjb25zdCB3aG9sZSA9IG5ldyBVaW50OEFycmF5KGtleS5kYXRhLmxlbmd0aCArIDQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5LmRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgd2hvbGVbaV0gPSBrZXkuZGF0YVtpXTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgICAgd2hvbGVbaSArIGtleS5kYXRhLmxlbmd0aF0gPSBkaWdlc3RbaV07XG4gICAgfVxuICAgIHJldHVybiBwcmVmaXggKyBiaW5hcnlUb0Jhc2U1OCh3aG9sZSk7XG59XG5cbi8qKiBDb252ZXJ0IGtleSBpbiBgc2AgdG8gYmluYXJ5IGZvcm0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdUb1B1YmxpY0tleShzOiBzdHJpbmcpOiBLZXkge1xuICAgIGlmICh0eXBlb2YgcyAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJleHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBwdWJsaWMga2V5XCIpO1xuICAgIH1cbiAgICBpZiAocy5zdWJzdHIoMCwgMykgPT09IFwiRU9TXCIpIHtcbiAgICAgICAgY29uc3Qgd2hvbGUgPSBiYXNlNThUb0JpbmFyeShwdWJsaWNLZXlEYXRhU2l6ZSArIDQsIHMuc3Vic3RyKDMpKTtcbiAgICAgICAgY29uc3Qga2V5ID0geyB0eXBlOiBLZXlUeXBlLmsxLCBkYXRhOiBuZXcgVWludDhBcnJheShwdWJsaWNLZXlEYXRhU2l6ZSkgfTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwdWJsaWNLZXlEYXRhU2l6ZTsgKytpKSB7XG4gICAgICAgICAgICBrZXkuZGF0YVtpXSA9IHdob2xlW2ldO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpZ2VzdCA9IG5ldyBVaW50OEFycmF5KHJpcGVtZDE2MChrZXkuZGF0YSkpO1xuICAgICAgICBpZiAoZGlnZXN0WzBdICE9PSB3aG9sZVtwdWJsaWNLZXlEYXRhU2l6ZV0gfHwgZGlnZXN0WzFdICE9PSB3aG9sZVszNF1cbiAgICAgICAgICAgIHx8IGRpZ2VzdFsyXSAhPT0gd2hvbGVbMzVdIHx8IGRpZ2VzdFszXSAhPT0gd2hvbGVbMzZdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjaGVja3N1bSBkb2Vzbid0IG1hdGNoXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfSBlbHNlIGlmIChzLnN1YnN0cigwLCA3KSA9PT0gXCJQVUJfSzFfXCIpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ1RvS2V5KHMuc3Vic3RyKDcpLCBLZXlUeXBlLmsxLCBwdWJsaWNLZXlEYXRhU2l6ZSwgXCJLMVwiKTtcbiAgICB9IGVsc2UgaWYgKHMuc3Vic3RyKDAsIDcpID09PSBcIlBVQl9SMV9cIikge1xuICAgICAgICByZXR1cm4gc3RyaW5nVG9LZXkocy5zdWJzdHIoNyksIEtleVR5cGUucjEsIHB1YmxpY0tleURhdGFTaXplLCBcIlIxXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInVucmVjb2duaXplZCBwdWJsaWMga2V5IGZvcm1hdFwiKTtcbiAgICB9XG59XG5cbi8qKiBDb252ZXJ0IGBrZXlgIHRvIHN0cmluZyAoYmFzZS01OCkgZm9ybSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB1YmxpY0tleVRvU3RyaW5nKGtleTogS2V5KSB7XG4gICAgaWYgKGtleS50eXBlID09PSBLZXlUeXBlLmsxICYmIGtleS5kYXRhLmxlbmd0aCA9PT0gcHVibGljS2V5RGF0YVNpemUpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKGtleSwgXCJLMVwiLCBcIlBVQl9LMV9cIik7XG4gICAgfSBlbHNlIGlmIChrZXkudHlwZSA9PT0gS2V5VHlwZS5yMSAmJiBrZXkuZGF0YS5sZW5ndGggPT09IHB1YmxpY0tleURhdGFTaXplKSB7XG4gICAgICAgIHJldHVybiBrZXlUb1N0cmluZyhrZXksIFwiUjFcIiwgXCJQVUJfUjFfXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInVucmVjb2duaXplZCBwdWJsaWMga2V5IGZvcm1hdFwiKTtcbiAgICB9XG59XG5cbi8qKiBJZiBhIGtleSBpcyBpbiB0aGUgbGVnYWN5IGZvcm1hdCAoYEVPU2AgcHJlZml4KSwgdGhlbiBjb252ZXJ0IGl0IHRvIHRoZSBuZXcgZm9ybWF0IChgUFVCX0sxX2ApLlxuICogTGVhdmVzIG90aGVyIGZvcm1hdHMgdW50b3VjaGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0TGVnYWN5UHVibGljS2V5KHM6IHN0cmluZykge1xuICAgIGlmIChzLnN1YnN0cigwLCAzKSA9PT0gXCJFT1NcIikge1xuICAgICAgICByZXR1cm4gcHVibGljS2V5VG9TdHJpbmcoc3RyaW5nVG9QdWJsaWNLZXkocykpO1xuICAgIH1cbiAgICByZXR1cm4gcztcbn1cblxuLyoqIElmIGEga2V5IGlzIGluIHRoZSBsZWdhY3kgZm9ybWF0IChgRU9TYCBwcmVmaXgpLCB0aGVuIGNvbnZlcnQgaXQgdG8gdGhlIG5ldyBmb3JtYXQgKGBQVUJfSzFfYCkuXG4gKiBMZWF2ZXMgb3RoZXIgZm9ybWF0cyB1bnRvdWNoZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRMZWdhY3lQdWJsaWNLZXlzKGtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGtleXMubWFwKGNvbnZlcnRMZWdhY3lQdWJsaWNLZXkpO1xufVxuXG4vKiogQ29udmVydCBrZXkgaW4gYHNgIHRvIGJpbmFyeSBmb3JtICovXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nVG9Qcml2YXRlS2V5KHM6IHN0cmluZyk6IEtleSB7XG4gICAgaWYgKHR5cGVvZiBzICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImV4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIHByaXZhdGUga2V5XCIpO1xuICAgIH1cbiAgICBpZiAocy5zdWJzdHIoMCwgNykgPT09IFwiUFZUX1IxX1wiKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb0tleShzLnN1YnN0cig3KSwgS2V5VHlwZS5yMSwgcHJpdmF0ZUtleURhdGFTaXplLCBcIlIxXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInVucmVjb2duaXplZCBwcml2YXRlIGtleSBmb3JtYXRcIik7XG4gICAgfVxufVxuXG4vKiogQ29udmVydCBga2V5YCB0byBzdHJpbmcgKGJhc2UtNTgpIGZvcm0gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcml2YXRlS2V5VG9TdHJpbmcoa2V5OiBLZXkpIHtcbiAgICBpZiAoa2V5LnR5cGUgPT09IEtleVR5cGUucjEpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKGtleSwgXCJSMVwiLCBcIlBWVF9SMV9cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5yZWNvZ25pemVkIHByaXZhdGUga2V5IGZvcm1hdFwiKTtcbiAgICB9XG59XG5cbi8qKiBDb252ZXJ0IGtleSBpbiBgc2AgdG8gYmluYXJ5IGZvcm0gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdUb1NpZ25hdHVyZShzOiBzdHJpbmcpOiBLZXkge1xuICAgIGlmICh0eXBlb2YgcyAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJleHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBzaWduYXR1cmVcIik7XG4gICAgfVxuICAgIGlmIChzLnN1YnN0cigwLCA3KSA9PT0gXCJTSUdfSzFfXCIpIHtcbiAgICAgICAgcmV0dXJuIHN0cmluZ1RvS2V5KHMuc3Vic3RyKDcpLCBLZXlUeXBlLmsxLCBzaWduYXR1cmVEYXRhU2l6ZSwgXCJLMVwiKTtcbiAgICB9IGVsc2UgaWYgKHMuc3Vic3RyKDAsIDcpID09PSBcIlNJR19SMV9cIikge1xuICAgICAgICByZXR1cm4gc3RyaW5nVG9LZXkocy5zdWJzdHIoNyksIEtleVR5cGUucjEsIHNpZ25hdHVyZURhdGFTaXplLCBcIlIxXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInVucmVjb2duaXplZCBzaWduYXR1cmUgZm9ybWF0XCIpO1xuICAgIH1cbn1cblxuLyoqIENvbnZlcnQgYHNpZ25hdHVyZWAgdG8gc3RyaW5nIChiYXNlLTU4KSBmb3JtICovXG5leHBvcnQgZnVuY3Rpb24gc2lnbmF0dXJlVG9TdHJpbmcoc2lnbmF0dXJlOiBLZXkpIHtcbiAgICBpZiAoc2lnbmF0dXJlLnR5cGUgPT09IEtleVR5cGUuazEpIHtcbiAgICAgICAgcmV0dXJuIGtleVRvU3RyaW5nKHNpZ25hdHVyZSwgXCJLMVwiLCBcIlNJR19LMV9cIik7XG4gICAgfSBlbHNlIGlmIChzaWduYXR1cmUudHlwZSA9PT0gS2V5VHlwZS5yMSkge1xuICAgICAgICByZXR1cm4ga2V5VG9TdHJpbmcoc2lnbmF0dXJlLCBcIlIxXCIsIFwiU0lHX1IxX1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bnJlY29nbml6ZWQgc2lnbmF0dXJlIGZvcm1hdFwiKTtcbiAgICB9XG59XG4iLCIvKipcbiAqIEBtb2R1bGUgU2VyaWFsaXplXG4gKi9cblxuLy8gY29weXJpZ2h0IGRlZmluZWQgaW4gZW9zanMvTElDRU5TRS50eHRcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IEFiaSwgQmxvY2tUYXBvc0luZm8gfSBmcm9tIFwiLi9lb3Nqcy1qc29ucnBjXCI7XG5pbXBvcnQgKiBhcyBudW1lcmljIGZyb20gXCIuL2Vvc2pzLW51bWVyaWNcIjtcblxuLyoqIEEgZmllbGQgaW4gYW4gYWJpICovXG5leHBvcnQgaW50ZXJmYWNlIEZpZWxkIHtcbiAgICAvKiogRmllbGQgbmFtZSAqL1xuICAgIG5hbWU6IHN0cmluZztcblxuICAgIC8qKiBUeXBlIG5hbWUgaW4gc3RyaW5nIGZvcm0gKi9cbiAgICB0eXBlTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqIFR5cGUgb2YgdGhlIGZpZWxkICovXG4gICAgdHlwZTogVHlwZTtcbn1cblxuLyoqIFN0YXRlIGZvciBzZXJpYWxpemUoKSBhbmQgZGVzZXJpYWxpemUoKSAqL1xuZXhwb3J0IGNsYXNzIFNlcmlhbGl6ZXJTdGF0ZSB7XG4gICAgLyoqIEhhdmUgYW55IGJpbmFyeSBleHRlbnNpb25zIGJlZW4gc2tpcHBlZD8gKi9cbiAgICBwdWJsaWMgc2tpcHBlZEJpbmFyeUV4dGVuc2lvbiA9IGZhbHNlO1xufVxuXG4vKiogQSB0eXBlIGluIGFuIGFiaSAqL1xuZXhwb3J0IGludGVyZmFjZSBUeXBlIHtcbiAgICAvKiogVHlwZSBuYW1lICovXG4gICAgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqIFR5cGUgbmFtZSB0aGlzIGlzIGFuIGFsaWFzIG9mLCBpZiBhbnkgKi9cbiAgICBhbGlhc09mTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqIFR5cGUgdGhpcyBpcyBhbiBhcnJheSBvZiwgaWYgYW55ICovXG4gICAgYXJyYXlPZjogVHlwZTtcblxuICAgIC8qKiBUeXBlIHRoaXMgaXMgYW4gb3B0aW9uYWwgb2YsIGlmIGFueSAqL1xuICAgIG9wdGlvbmFsT2Y6IFR5cGU7XG5cbiAgICAvKiogTWFya3MgYmluYXJ5IGV4dGVuc2lvbiBmaWVsZHMgKi9cbiAgICBleHRlbnNpb25PZj86IFR5cGU7XG5cbiAgICAvKiogQmFzZSBuYW1lIG9mIHRoaXMgdHlwZSwgaWYgdGhpcyBpcyBhIHN0cnVjdCAqL1xuICAgIGJhc2VOYW1lOiBzdHJpbmc7XG5cbiAgICAvKiogQmFzZSBvZiB0aGlzIHR5cGUsIGlmIHRoaXMgaXMgYSBzdHJ1Y3QgKi9cbiAgICBiYXNlOiBUeXBlO1xuXG4gICAgLyoqIENvbnRhaW5lZCBmaWVsZHMsIGlmIHRoaXMgaXMgYSBzdHJ1Y3QgKi9cbiAgICBmaWVsZHM6IEZpZWxkW107XG5cbiAgICAvKiogQ29udmVydCBgZGF0YWAgdG8gYmluYXJ5IGZvcm0gYW5kIHN0b3JlIGluIGBidWZmZXJgICovXG4gICAgc2VyaWFsaXplOiAoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IGFueSwgc3RhdGU/OiBTZXJpYWxpemVyU3RhdGUsIGFsbG93RXh0ZW5zaW9ucz86IGJvb2xlYW4pID0+IHZvaWQ7XG5cbiAgICAvKiogQ29udmVydCBkYXRhIGluIGBidWZmZXJgIGZyb20gYmluYXJ5IGZvcm0gKi9cbiAgICBkZXNlcmlhbGl6ZTogKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBzdGF0ZT86IFNlcmlhbGl6ZXJTdGF0ZSwgYWxsb3dFeHRlbnNpb25zPzogYm9vbGVhbikgPT4gYW55O1xufVxuXG4vKiogU3RydWN0dXJhbCByZXByZXNlbnRhdGlvbiBvZiBhIHN5bWJvbCAqL1xuZXhwb3J0IGludGVyZmFjZSBTeW1ib2wge1xuICAgIC8qKiBOYW1lIG9mIHRoZSBzeW1ib2wsIG5vdCBpbmNsdWRpbmcgcHJlY2lzaW9uICovXG4gICAgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqIE51bWJlciBvZiBkaWdpdHMgYWZ0ZXIgdGhlIGRlY2ltYWwgcG9pbnQgKi9cbiAgICBwcmVjaXNpb246IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb250cmFjdCB7XG4gICAgYWN0aW9uczogTWFwPHN0cmluZywgVHlwZT47XG4gICAgdHlwZXM6IE1hcDxzdHJpbmcsIFR5cGU+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhvcml6YXRpb24ge1xuICAgIGFjdG9yOiBzdHJpbmc7XG4gICAgcGVybWlzc2lvbjogc3RyaW5nO1xufVxuXG4vKiogQWN0aW9uIHdpdGggZGF0YSBpbiBzdHJ1Y3R1cmVkIGZvcm0gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uIHtcbiAgICBhY2NvdW50OiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGF1dGhvcml6YXRpb246IEF1dGhvcml6YXRpb25bXTtcbiAgICBkYXRhOiBhbnk7XG59XG5cbi8qKiBBY3Rpb24gd2l0aCBkYXRhIGluIHNlcmlhbGl6ZWQgaGV4IGZvcm0gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VyaWFsaXplZEFjdGlvbiB7XG4gICAgYWNjb3VudDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBhdXRob3JpemF0aW9uOiBBdXRob3JpemF0aW9uW107XG4gICAgZGF0YTogc3RyaW5nO1xufVxuXG4vKiogU2VyaWFsaXplIGFuZCBkZXNlcmlhbGl6ZSBkYXRhICovXG5leHBvcnQgY2xhc3MgU2VyaWFsQnVmZmVyIHtcbiAgICAvKiogQW1vdW50IG9mIHZhbGlkIGRhdGEgaW4gYGFycmF5YCAqL1xuICAgIHB1YmxpYyBsZW5ndGg6IG51bWJlcjtcblxuICAgIC8qKiBEYXRhIGluIHNlcmlhbGl6ZWQgKGJpbmFyeSkgZm9ybSAqL1xuICAgIHB1YmxpYyBhcnJheTogVWludDhBcnJheTtcblxuICAgIC8qKiBDdXJyZW50IHBvc2l0aW9uIHdoaWxlIHJlYWRpbmcgKGRlc2VyaWFsaXppbmcpICovXG4gICAgcHVibGljIHJlYWRQb3MgPSAwO1xuXG4gICAgcHVibGljIHRleHRFbmNvZGVyOiBUZXh0RW5jb2RlcjtcbiAgICBwdWJsaWMgdGV4dERlY29kZXI6IFRleHREZWNvZGVyO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIF9fbmFtZWRQYXJhbWV0ZXJzXG4gICAgICogICAgKiBgYXJyYXlgOiBgbnVsbGAgaWYgc2VyaWFsaXppbmcsIG9yIGJpbmFyeSBkYXRhIHRvIGRlc2VyaWFsaXplXG4gICAgICogICAgKiBgdGV4dEVuY29kZXJgOiBgVGV4dEVuY29kZXJgIGluc3RhbmNlIHRvIHVzZS4gUGFzcyBpbiBgbnVsbGAgaWYgcnVubmluZyBpbiBhIGJyb3dzZXJcbiAgICAgKiAgICAqIGB0ZXh0RGVjb2RlcmA6IGBUZXh0RGVjaWRlcmAgaW5zdGFuY2UgdG8gdXNlLiBQYXNzIGluIGBudWxsYCBpZiBydW5uaW5nIGluIGEgYnJvd3NlclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHsgdGV4dEVuY29kZXIsIHRleHREZWNvZGVyLCBhcnJheSB9ID0ge30gYXNcbiAgICAgICAgeyB0ZXh0RW5jb2Rlcj86IFRleHRFbmNvZGVyLCB0ZXh0RGVjb2Rlcj86IFRleHREZWNvZGVyLCBhcnJheT86IFVpbnQ4QXJyYXkgfSkge1xuICAgICAgICB0aGlzLmFycmF5ID0gYXJyYXkgfHwgbmV3IFVpbnQ4QXJyYXkoMTAyNCk7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgICAgICB0aGlzLnRleHRFbmNvZGVyID0gdGV4dEVuY29kZXIgfHwgbmV3IFRleHRFbmNvZGVyKCk7XG4gICAgICAgIHRoaXMudGV4dERlY29kZXIgPSB0ZXh0RGVjb2RlciB8fCBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiLCB7IGZhdGFsOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIC8qKiBSZXNpemUgYGFycmF5YCBpZiBuZWVkZWQgdG8gaGF2ZSBhdCBsZWFzdCBgc2l6ZWAgYnl0ZXMgZnJlZSAqL1xuICAgIHB1YmxpYyByZXNlcnZlKHNpemU6IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggKyBzaXplIDw9IHRoaXMuYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGwgPSB0aGlzLmFycmF5Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKHRoaXMubGVuZ3RoICsgc2l6ZSA+IGwpIHtcbiAgICAgICAgICAgIGwgPSBNYXRoLmNlaWwobCAqIDEuNSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3QXJyYXkgPSBuZXcgVWludDhBcnJheShsKTtcbiAgICAgICAgbmV3QXJyYXkuc2V0KHRoaXMuYXJyYXkpO1xuICAgICAgICB0aGlzLmFycmF5ID0gbmV3QXJyYXk7XG4gICAgfVxuXG4gICAgLyoqIElzIHRoZXJlIGRhdGEgYXZhaWxhYmxlIHRvIHJlYWQ/ICovXG4gICAgcHVibGljIGhhdmVSZWFkRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZFBvcyA8IHRoaXMubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKiBSZXN0YXJ0IHJlYWRpbmcgZnJvbSB0aGUgYmVnaW5uaW5nICovXG4gICAgcHVibGljIHJlc3RhcnRSZWFkKCkge1xuICAgICAgICB0aGlzLnJlYWRQb3MgPSAwO1xuICAgIH1cblxuICAgIC8qKiBSZXR1cm4gZGF0YSB3aXRoIGV4Y2VzcyBzdG9yYWdlIHRyaW1tZWQgYXdheSAqL1xuICAgIHB1YmxpYyBhc1VpbnQ4QXJyYXkoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSh0aGlzLmFycmF5LmJ1ZmZlciwgMCwgdGhpcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYnl0ZXMgKi9cbiAgICBwdWJsaWMgcHVzaEFycmF5KHY6IG51bWJlcltdIHwgVWludDhBcnJheSkge1xuICAgICAgICB0aGlzLnJlc2VydmUodi5sZW5ndGgpO1xuICAgICAgICB0aGlzLmFycmF5LnNldCh2LCB0aGlzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMubGVuZ3RoICs9IHYubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYnl0ZXMgKi9cbiAgICBwdWJsaWMgcHVzaCguLi52OiBudW1iZXJbXSkge1xuICAgICAgICB0aGlzLnB1c2hBcnJheSh2KTtcbiAgICB9XG5cbiAgICAvKiogR2V0IGEgc2luZ2xlIGJ5dGUgKi9cbiAgICBwdWJsaWMgZ2V0KCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkUG9zIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFycmF5W3RoaXMucmVhZFBvcysrXTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWFkIHBhc3QgZW5kIG9mIGJ1ZmZlclwiKTtcbiAgICB9XG5cbiAgICAvKiogQXBwZW5kIGJ5dGVzIGluIGB2YC4gVGhyb3dzIGlmIGBsZW5gIGRvZXNuJ3QgbWF0Y2ggYHYubGVuZ3RoYCAqL1xuICAgIHB1YmxpYyBwdXNoVWludDhBcnJheUNoZWNrZWQodjogVWludDhBcnJheSwgbGVuOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHYubGVuZ3RoICE9PSBsZW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJpbmFyeSBkYXRhIGhhcyBpbmNvcnJlY3Qgc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2hBcnJheSh2KTtcbiAgICB9XG5cbiAgICAvKiogR2V0IGBsZW5gIGJ5dGVzICovXG4gICAgcHVibGljIGdldFVpbnQ4QXJyYXkobGVuOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZFBvcyArIGxlbiA+IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWFkIHBhc3QgZW5kIG9mIGJ1ZmZlclwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgVWludDhBcnJheSh0aGlzLmFycmF5LmJ1ZmZlciwgdGhpcy5yZWFkUG9zLCBsZW4pO1xuICAgICAgICB0aGlzLnJlYWRQb3MgKz0gbGVuO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYSBgdWludDE2YCAqL1xuICAgIHB1YmxpYyBwdXNoVWludDE2KHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLnB1c2goKHYgPj4gMCkgJiAweGZmLCAodiA+PiA4KSAmIDB4ZmYpO1xuICAgIH1cblxuICAgIC8qKiBHZXQgYSBgdWludDE2YCAqL1xuICAgIHB1YmxpYyBnZXRVaW50MTYoKSB7XG4gICAgICAgIGxldCB2ID0gMDtcbiAgICAgICAgdiB8PSB0aGlzLmdldCgpIDw8IDA7XG4gICAgICAgIHYgfD0gdGhpcy5nZXQoKSA8PCA4O1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG5cbiAgICAvKiogQXBwZW5kIGEgYHVpbnQzMmAgKi9cbiAgICBwdWJsaWMgcHVzaFVpbnQzMih2OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wdXNoKCh2ID4+IDApICYgMHhmZiwgKHYgPj4gOCkgJiAweGZmLCAodiA+PiAxNikgJiAweGZmLCAodiA+PiAyNCkgJiAweGZmKTtcbiAgICB9XG5cbiAgICAvKiogR2V0IGEgYHVpbnQzMmAgKi9cbiAgICBwdWJsaWMgZ2V0VWludDMyKCkge1xuICAgICAgICBsZXQgdiA9IDA7XG4gICAgICAgIHYgfD0gdGhpcy5nZXQoKSA8PCAwO1xuICAgICAgICB2IHw9IHRoaXMuZ2V0KCkgPDwgODtcbiAgICAgICAgdiB8PSB0aGlzLmdldCgpIDw8IDE2O1xuICAgICAgICB2IHw9IHRoaXMuZ2V0KCkgPDwgMjQ7XG4gICAgICAgIHJldHVybiB2ID4+PiAwO1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYSBgdWludDY0YC4gKkNhdXRpb24qOiBgbnVtYmVyYCBvbmx5IGhhcyA1MyBiaXRzIG9mIHByZWNpc2lvbiAqL1xuICAgIHB1YmxpYyBwdXNoTnVtYmVyQXNVaW50NjQodjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucHVzaFVpbnQzMih2ID4+PiAwKTtcbiAgICAgICAgdGhpcy5wdXNoVWludDMyKE1hdGguZmxvb3IodiAvIDB4MTAwMDBfMDAwMCkgPj4+IDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIGB1aW50NjRgIGFzIGEgYG51bWJlcmAuICpDYXV0aW9uKjogYG51bWJlcmAgb25seSBoYXMgNTMgYml0cyBvZiBwcmVjaXNpb247IHNvbWUgdmFsdWVzIHdpbGwgY2hhbmdlLlxuICAgICAqIGBudW1lcmljLmJpbmFyeVRvRGVjaW1hbChzZXJpYWxCdWZmZXIuZ2V0VWludDhBcnJheSg4KSlgIHJlY29tbWVuZGVkIGluc3RlYWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0VWludDY0QXNOdW1iZXIoKSB7XG4gICAgICAgIGNvbnN0IGxvdyA9IHRoaXMuZ2V0VWludDMyKCk7XG4gICAgICAgIGNvbnN0IGhpZ2ggPSB0aGlzLmdldFVpbnQzMigpO1xuICAgICAgICByZXR1cm4gKGhpZ2ggPj4+IDApICogMHgxMDAwMF8wMDAwICsgKGxvdyA+Pj4gMCk7XG4gICAgfVxuXG4gICAgLyoqIEFwcGVuZCBhIGB2YXJ1aW50MzJgICovXG4gICAgcHVibGljIHB1c2hWYXJ1aW50MzIodjogbnVtYmVyKSB7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAodiA+Pj4gNykge1xuICAgICAgICAgICAgICAgIHRoaXMucHVzaCgweDgwIHwgKHYgJiAweDdmKSk7XG4gICAgICAgICAgICAgICAgdiA9IHYgPj4+IDc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucHVzaCh2KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBHZXQgYSBgdmFydWludDMyYCAqL1xuICAgIHB1YmxpYyBnZXRWYXJ1aW50MzIoKSB7XG4gICAgICAgIGxldCB2ID0gMDtcbiAgICAgICAgbGV0IGJpdCA9IDA7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBiID0gdGhpcy5nZXQoKTtcbiAgICAgICAgICAgIHYgfD0gKGIgJiAweDdmKSA8PCBiaXQ7XG4gICAgICAgICAgICBiaXQgKz0gNztcbiAgICAgICAgICAgIGlmICghKGIgJiAweDgwKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ID4+PiAwO1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYSBgdmFyaW50MzJgICovXG4gICAgcHVibGljIHB1c2hWYXJpbnQzMih2OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wdXNoVmFydWludDMyKCh2IDw8IDEpIF4gKHYgPj4gMzEpKTtcbiAgICB9XG5cbiAgICAvKiogR2V0IGEgYHZhcmludDMyYCAqL1xuICAgIHB1YmxpYyBnZXRWYXJpbnQzMigpIHtcbiAgICAgICAgY29uc3QgdiA9IHRoaXMuZ2V0VmFydWludDMyKCk7XG4gICAgICAgIGlmICh2ICYgMSkge1xuICAgICAgICAgICAgcmV0dXJuICgofnYpID4+IDEpIHwgMHg4MDAwXzAwMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdiA+Pj4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYSBgZmxvYXQzMmAgKi9cbiAgICBwdWJsaWMgcHVzaEZsb2F0MzIodjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucHVzaEFycmF5KG5ldyBVaW50OEFycmF5KChuZXcgRmxvYXQzMkFycmF5KFt2XSkpLmJ1ZmZlcikpO1xuICAgIH1cblxuICAgIC8qKiBHZXQgYSBgZmxvYXQzMmAgKi9cbiAgICBwdWJsaWMgZ2V0RmxvYXQzMigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkodGhpcy5nZXRVaW50OEFycmF5KDQpLnNsaWNlKCkuYnVmZmVyKVswXTtcbiAgICB9XG5cbiAgICAvKiogQXBwZW5kIGEgYGZsb2F0NjRgICovXG4gICAgcHVibGljIHB1c2hGbG9hdDY0KHY6IG51bWJlcikge1xuICAgICAgICB0aGlzLnB1c2hBcnJheShuZXcgVWludDhBcnJheSgobmV3IEZsb2F0NjRBcnJheShbdl0pKS5idWZmZXIpKTtcbiAgICB9XG5cbiAgICAvKiogR2V0IGEgYGZsb2F0NjRgICovXG4gICAgcHVibGljIGdldEZsb2F0NjQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQ2NEFycmF5KHRoaXMuZ2V0VWludDhBcnJheSg4KS5zbGljZSgpLmJ1ZmZlcilbMF07XG4gICAgfVxuXG4gICAgLyoqIEFwcGVuZCBhIGBuYW1lYCAqL1xuICAgIHB1YmxpYyBwdXNoTmFtZShzOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBuYW1lXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNoYXJUb1N5bWJvbChjOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGlmIChjID49IFwiYVwiLmNoYXJDb2RlQXQoMCkgJiYgYyA8PSBcInpcIi5jaGFyQ29kZUF0KDApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChjIC0gXCJhXCIuY2hhckNvZGVBdCgwKSkgKyA2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGMgPj0gXCIxXCIuY2hhckNvZGVBdCgwKSAmJiBjIDw9IFwiNVwiLmNoYXJDb2RlQXQoMCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGMgLSBcIjFcIi5jaGFyQ29kZUF0KDApKSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhID0gbmV3IFVpbnQ4QXJyYXkoOCk7XG4gICAgICAgIGxldCBiaXQgPSA2MztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQgYyA9IGNoYXJUb1N5bWJvbChzLmNoYXJDb2RlQXQoaSkpO1xuICAgICAgICAgICAgaWYgKGJpdCA8IDUpIHtcbiAgICAgICAgICAgICAgICBjID0gYyA8PCAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDQ7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpdCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFbTWF0aC5mbG9vcihiaXQgLyA4KV0gfD0gKChjID4+IGopICYgMSkgPDwgKGJpdCAlIDgpO1xuICAgICAgICAgICAgICAgICAgICAtLWJpdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoYSk7XG4gICAgfVxuXG4gICAgLyoqIEdldCBhIGBuYW1lYCAqL1xuICAgIHB1YmxpYyBnZXROYW1lKCkge1xuICAgICAgICBjb25zdCBhID0gdGhpcy5nZXRVaW50OEFycmF5KDgpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gXCJcIjtcbiAgICAgICAgZm9yIChsZXQgYml0ID0gNjM7IGJpdCA+PSAwOykge1xuICAgICAgICAgICAgbGV0IGMgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoYml0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYyA9IChjIDw8IDEpIHwgKChhW01hdGguZmxvb3IoYml0IC8gOCldID4+IChiaXQgJSA4KSkgJiAxKTtcbiAgICAgICAgICAgICAgICAgICAgLS1iaXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGMgPj0gNikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMgKyBcImFcIi5jaGFyQ29kZUF0KDApIC0gNik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGMgPj0gMSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMgKyBcIjFcIi5jaGFyQ29kZUF0KDApIC0gMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIi5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0ID09PSBcIi4uLi4uLi4uLi4uLi5cIikge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAocmVzdWx0LmVuZHNXaXRoKFwiLlwiKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cigwLCByZXN1bHQubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKiogQXBwZW5kIGxlbmd0aC1wcmVmaXhlZCBiaW5hcnkgZGF0YSAqL1xuICAgIHB1YmxpYyBwdXNoQnl0ZXModjogbnVtYmVyW10gfCBVaW50OEFycmF5KSB7XG4gICAgICAgIHRoaXMucHVzaFZhcnVpbnQzMih2Lmxlbmd0aCk7XG4gICAgICAgIHRoaXMucHVzaEFycmF5KHYpO1xuICAgIH1cblxuICAgIC8qKiBHZXQgbGVuZ3RoLXByZWZpeGVkIGJpbmFyeSBkYXRhICovXG4gICAgcHVibGljIGdldEJ5dGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRVaW50OEFycmF5KHRoaXMuZ2V0VmFydWludDMyKCkpO1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYSBzdHJpbmcgKi9cbiAgICBwdWJsaWMgcHVzaFN0cmluZyh2OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5wdXNoQnl0ZXModGhpcy50ZXh0RW5jb2Rlci5lbmNvZGUodikpO1xuICAgIH1cblxuICAgIC8qKiBHZXQgYSBzdHJpbmcgKi9cbiAgICBwdWJsaWMgZ2V0U3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0RGVjb2Rlci5kZWNvZGUodGhpcy5nZXRCeXRlcygpKTtcbiAgICB9XG5cbiAgICAvKiogQXBwZW5kIGEgYHN5bWJvbF9jb2RlYC4gVW5saWtlIGBzeW1ib2xgLCBgc3ltYm9sX2NvZGVgIGRvZXNuJ3QgaW5jbHVkZSBhIHByZWNpc2lvbi4gKi9cbiAgICBwdWJsaWMgcHVzaFN5bWJvbENvZGUobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgc3RyaW5nIGNvbnRhaW5pbmcgc3ltYm9sX2NvZGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYSA9IFtdO1xuICAgICAgICBhLnB1c2goLi4udGhpcy50ZXh0RW5jb2Rlci5lbmNvZGUobmFtZSkpO1xuICAgICAgICB3aGlsZSAoYS5sZW5ndGggPCA4KSB7XG4gICAgICAgICAgICBhLnB1c2goMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoYS5zbGljZSgwLCA4KSk7XG4gICAgfVxuXG4gICAgLyoqIEdldCBhIGBzeW1ib2xfY29kZWAuIFVubGlrZSBgc3ltYm9sYCwgYHN5bWJvbF9jb2RlYCBkb2Vzbid0IGluY2x1ZGUgYSBwcmVjaXNpb24uICovXG4gICAgcHVibGljIGdldFN5bWJvbENvZGUoKSB7XG4gICAgICAgIGNvbnN0IGEgPSB0aGlzLmdldFVpbnQ4QXJyYXkoOCk7XG4gICAgICAgIGxldCBsZW47XG4gICAgICAgIGZvciAobGVuID0gMDsgbGVuIDwgYS5sZW5ndGg7ICsrbGVuKSB7XG4gICAgICAgICAgICBpZiAoIWFbbGVuXSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnRleHREZWNvZGVyLmRlY29kZShuZXcgVWludDhBcnJheShhLmJ1ZmZlciwgYS5ieXRlT2Zmc2V0LCBsZW4pKTtcbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLyoqIEFwcGVuZCBhIGBzeW1ib2xgICovXG4gICAgcHVibGljIHB1c2hTeW1ib2woeyBuYW1lLCBwcmVjaXNpb24gfTogeyBuYW1lOiBzdHJpbmcsIHByZWNpc2lvbjogbnVtYmVyIH0pIHtcbiAgICAgICAgY29uc3QgYSA9IFtwcmVjaXNpb24gJiAweGZmXTtcbiAgICAgICAgYS5wdXNoKC4uLnRoaXMudGV4dEVuY29kZXIuZW5jb2RlKG5hbWUpKTtcbiAgICAgICAgd2hpbGUgKGEubGVuZ3RoIDwgOCkge1xuICAgICAgICAgICAgYS5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHVzaEFycmF5KGEuc2xpY2UoMCwgOCkpO1xuICAgIH1cblxuICAgIC8qKiBHZXQgYSBgc3ltYm9sYCAqL1xuICAgIHB1YmxpYyBnZXRTeW1ib2woKTogeyBuYW1lOiBzdHJpbmcsIHByZWNpc2lvbjogbnVtYmVyIH0ge1xuICAgICAgICBjb25zdCBwcmVjaXNpb24gPSB0aGlzLmdldCgpO1xuICAgICAgICBjb25zdCBhID0gdGhpcy5nZXRVaW50OEFycmF5KDcpO1xuICAgICAgICBsZXQgbGVuO1xuICAgICAgICBmb3IgKGxlbiA9IDA7IGxlbiA8IGEubGVuZ3RoOyArK2xlbikge1xuICAgICAgICAgICAgaWYgKCFhW2xlbl0pIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy50ZXh0RGVjb2Rlci5kZWNvZGUobmV3IFVpbnQ4QXJyYXkoYS5idWZmZXIsIGEuYnl0ZU9mZnNldCwgbGVuKSk7XG4gICAgICAgIHJldHVybiB7IG5hbWUsIHByZWNpc2lvbiB9O1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYW4gYXNzZXQgKi9cbiAgICBwdWJsaWMgcHVzaEFzc2V0KHM6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIHMgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIGFzc2V0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHMgPSBzLnRyaW0oKTtcbiAgICAgICAgbGV0IHBvcyA9IDA7XG4gICAgICAgIGxldCBhbW91bnQgPSBcIlwiO1xuICAgICAgICBsZXQgcHJlY2lzaW9uID0gMDtcbiAgICAgICAgaWYgKHNbcG9zXSA9PT0gXCItXCIpIHtcbiAgICAgICAgICAgIGFtb3VudCArPSBcIi1cIjtcbiAgICAgICAgICAgICsrcG9zO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb3VuZERpZ2l0ID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChwb3MgPCBzLmxlbmd0aCAmJiBzLmNoYXJDb2RlQXQocG9zKSA+PSBcIjBcIi5jaGFyQ29kZUF0KDApICYmIHMuY2hhckNvZGVBdChwb3MpIDw9IFwiOVwiLmNoYXJDb2RlQXQoMCkpIHtcbiAgICAgICAgICAgIGZvdW5kRGlnaXQgPSB0cnVlO1xuICAgICAgICAgICAgYW1vdW50ICs9IHNbcG9zXTtcbiAgICAgICAgICAgICsrcG9zO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZm91bmREaWdpdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXNzZXQgbXVzdCBiZWdpbiB3aXRoIGEgbnVtYmVyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzW3Bvc10gPT09IFwiLlwiKSB7XG4gICAgICAgICAgICArK3BvcztcbiAgICAgICAgICAgIHdoaWxlIChwb3MgPCBzLmxlbmd0aCAmJiBzLmNoYXJDb2RlQXQocG9zKSA+PSBcIjBcIi5jaGFyQ29kZUF0KDApICYmIHMuY2hhckNvZGVBdChwb3MpIDw9IFwiOVwiLmNoYXJDb2RlQXQoMCkpIHtcbiAgICAgICAgICAgICAgICBhbW91bnQgKz0gc1twb3NdO1xuICAgICAgICAgICAgICAgICsrcHJlY2lzaW9uO1xuICAgICAgICAgICAgICAgICsrcG9zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSBzLnN1YnN0cihwb3MpLnRyaW0oKTtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkobnVtZXJpYy5zaWduZWREZWNpbWFsVG9CaW5hcnkoOCwgYW1vdW50KSk7XG4gICAgICAgIHRoaXMucHVzaFN5bWJvbCh7IG5hbWUsIHByZWNpc2lvbiB9KTtcbiAgICB9XG5cbiAgICAvKiogR2V0IGFuIGFzc2V0ICovXG4gICAgcHVibGljIGdldEFzc2V0KCkge1xuICAgICAgICBjb25zdCBhbW91bnQgPSB0aGlzLmdldFVpbnQ4QXJyYXkoOCk7XG4gICAgICAgIGNvbnN0IHsgbmFtZSwgcHJlY2lzaW9uIH0gPSB0aGlzLmdldFN5bWJvbCgpO1xuICAgICAgICBsZXQgcyA9IG51bWVyaWMuc2lnbmVkQmluYXJ5VG9EZWNpbWFsKGFtb3VudCwgcHJlY2lzaW9uICsgMSk7XG4gICAgICAgIGlmIChwcmVjaXNpb24pIHtcbiAgICAgICAgICAgIHMgPSBzLnN1YnN0cigwLCBzLmxlbmd0aCAtIHByZWNpc2lvbikgKyBcIi5cIiArIHMuc3Vic3RyKHMubGVuZ3RoIC0gcHJlY2lzaW9uKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcyArIFwiIFwiICsgbmFtZTtcbiAgICB9XG5cbiAgICAvKiogQXBwZW5kIGEgcHVibGljIGtleSAqL1xuICAgIHB1YmxpYyBwdXNoUHVibGljS2V5KHM6IHN0cmluZykge1xuICAgICAgICBjb25zdCBrZXkgPSBudW1lcmljLnN0cmluZ1RvUHVibGljS2V5KHMpO1xuICAgICAgICB0aGlzLnB1c2goa2V5LnR5cGUpO1xuICAgICAgICB0aGlzLnB1c2hBcnJheShrZXkuZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqIEdldCBhIHB1YmxpYyBrZXkgKi9cbiAgICBwdWJsaWMgZ2V0UHVibGljS2V5KCkge1xuICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5nZXQoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0VWludDhBcnJheShudW1lcmljLnB1YmxpY0tleURhdGFTaXplKTtcbiAgICAgICAgcmV0dXJuIG51bWVyaWMucHVibGljS2V5VG9TdHJpbmcoeyB0eXBlLCBkYXRhIH0pO1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYSBwcml2YXRlIGtleSAqL1xuICAgIHB1YmxpYyBwdXNoUHJpdmF0ZUtleShzOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbnVtZXJpYy5zdHJpbmdUb1ByaXZhdGVLZXkocyk7XG4gICAgICAgIHRoaXMucHVzaChrZXkudHlwZSk7XG4gICAgICAgIHRoaXMucHVzaEFycmF5KGtleS5kYXRhKTtcbiAgICB9XG5cbiAgICAvKiogR2V0IGEgcHJpdmF0ZSBrZXkgKi9cbiAgICBwdWJsaWMgZ2V0UHJpdmF0ZUtleSgpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZ2V0KCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldFVpbnQ4QXJyYXkobnVtZXJpYy5wcml2YXRlS2V5RGF0YVNpemUpO1xuICAgICAgICByZXR1cm4gbnVtZXJpYy5wcml2YXRlS2V5VG9TdHJpbmcoeyB0eXBlLCBkYXRhIH0pO1xuICAgIH1cblxuICAgIC8qKiBBcHBlbmQgYSBzaWduYXR1cmUgKi9cbiAgICBwdWJsaWMgcHVzaFNpZ25hdHVyZShzOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbnVtZXJpYy5zdHJpbmdUb1NpZ25hdHVyZShzKTtcbiAgICAgICAgdGhpcy5wdXNoKGtleS50eXBlKTtcbiAgICAgICAgdGhpcy5wdXNoQXJyYXkoa2V5LmRhdGEpO1xuICAgIH1cblxuICAgIC8qKiBHZXQgYSBzaWduYXR1cmUgKi9cbiAgICBwdWJsaWMgZ2V0U2lnbmF0dXJlKCkge1xuICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5nZXQoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0VWludDhBcnJheShudW1lcmljLnNpZ25hdHVyZURhdGFTaXplKTtcbiAgICAgICAgcmV0dXJuIG51bWVyaWMuc2lnbmF0dXJlVG9TdHJpbmcoeyB0eXBlLCBkYXRhIH0pO1xuICAgIH1cbn0gLy8gU2VyaWFsQnVmZmVyXG5cbi8qKiBJcyB0aGlzIGEgc3VwcG9ydGVkIEFCSSB2ZXJzaW9uPyAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1cHBvcnRlZEFiaVZlcnNpb24odmVyc2lvbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHZlcnNpb24uc3RhcnRzV2l0aChcImVvc2lvOjphYmkvMS5cIik7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRGF0ZVBhcnNlKGRhdGU6IHN0cmluZykge1xuICAgIGNvbnN0IHJlc3VsdCA9IERhdGUucGFyc2UoZGF0ZSk7XG4gICAgaWYgKE51bWJlci5pc05hTihyZXN1bHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZSBmb3JtYXRcIik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBDb252ZXJ0IGRhdGUgaW4gSVNPIGZvcm1hdCB0byBgdGltZV9wb2ludGAgKG1pbGlzZWNvbmRzIHNpbmNlIGVwb2NoKSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGVUb1RpbWVQb2ludChkYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChjaGVja0RhdGVQYXJzZShkYXRlICsgXCJaXCIpICogMTAwMCk7XG59XG5cbi8qKiBDb252ZXJ0IGB0aW1lX3BvaW50YCAobWlsaXNlY29uZHMgc2luY2UgZXBvY2gpIHRvIGRhdGUgaW4gSVNPIGZvcm1hdCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVQb2ludFRvRGF0ZSh1czogbnVtYmVyKSB7XG4gICAgY29uc3QgcyA9IChuZXcgRGF0ZSh1cyAvIDEwMDApKS50b0lTT1N0cmluZygpO1xuICAgIHJldHVybiBzLnN1YnN0cigwLCBzLmxlbmd0aCAtIDEpO1xufVxuXG4vKiogQ29udmVydCBkYXRlIGluIElTTyBmb3JtYXQgdG8gYHRpbWVfcG9pbnRfc2VjYCAoc2Vjb25kcyBzaW5jZSBlcG9jaCkgKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXRlVG9UaW1lUG9pbnRTZWMoZGF0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoY2hlY2tEYXRlUGFyc2UoZGF0ZSArIFwiWlwiKSAvIDEwMDApO1xufVxuXG4vKiogQ29udmVydCBgdGltZV9wb2ludF9zZWNgIChzZWNvbmRzIHNpbmNlIGVwb2NoKSB0byB0byBkYXRlIGluIElTTyBmb3JtYXQgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lUG9pbnRTZWNUb0RhdGUoc2VjOiBudW1iZXIpIHtcbiAgICBjb25zdCBzID0gKG5ldyBEYXRlKHNlYyAqIDEwMDApKS50b0lTT1N0cmluZygpO1xuICAgIHJldHVybiBzLnN1YnN0cigwLCBzLmxlbmd0aCAtIDEpO1xufVxuXG4vKiogQ29udmVydCBkYXRlIGluIElTTyBmb3JtYXQgdG8gYGJsb2NrX3RpbWVzdGFtcF90eXBlYCAoaGFsZi1zZWNvbmRzIHNpbmNlIGEgZGlmZmVyZW50IGVwb2NoKSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGVUb0Jsb2NrVGltZXN0YW1wKGRhdGU6IHN0cmluZykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKChjaGVja0RhdGVQYXJzZShkYXRlICsgXCJaXCIpIC0gOTQ2Njg0ODAwMDAwKSAvIDUwMCk7XG59XG5cbi8qKiBDb252ZXJ0IGBibG9ja190aW1lc3RhbXBfdHlwZWAgKGhhbGYtc2Vjb25kcyBzaW5jZSBhIGRpZmZlcmVudCBlcG9jaCkgdG8gdG8gZGF0ZSBpbiBJU08gZm9ybWF0ICovXG5leHBvcnQgZnVuY3Rpb24gYmxvY2tUaW1lc3RhbXBUb0RhdGUoc2xvdDogbnVtYmVyKSB7XG4gICAgY29uc3QgcyA9IChuZXcgRGF0ZShzbG90ICogNTAwICsgOTQ2Njg0ODAwMDAwKSkudG9JU09TdHJpbmcoKTtcbiAgICByZXR1cm4gcy5zdWJzdHIoMCwgcy5sZW5ndGggLSAxKTtcbn1cblxuLyoqIENvbnZlcnQgYHN0cmluZ2AgdG8gYFN5bWJvbGAuIGZvcm1hdDogYHByZWNpc2lvbixOQU1FYC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdUb1N5bWJvbChzOiBzdHJpbmcpOiB7IG5hbWU6IHN0cmluZywgcHJlY2lzaW9uOiBudW1iZXIgfSB7XG4gICAgaWYgKHR5cGVvZiBzICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIHN0cmluZyBjb250YWluaW5nIHN5bWJvbFwiKTtcbiAgICB9XG4gICAgY29uc3QgbSA9IHMubWF0Y2goL14oWzAtOV0rKSwoW0EtWl0rKSQvKTtcbiAgICBpZiAoIW0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzeW1ib2xcIik7XG4gICAgfVxuICAgIHJldHVybiB7IG5hbWU6IG1bMl0sIHByZWNpc2lvbjogK21bMV0gfTtcbn1cblxuLyoqIENvbnZlcnQgYFN5bWJvbGAgdG8gYHN0cmluZ2AuIGZvcm1hdDogYHByZWNpc2lvbixOQU1FYC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzeW1ib2xUb1N0cmluZyh7IG5hbWUsIHByZWNpc2lvbiB9OiB7IG5hbWU6IHN0cmluZywgcHJlY2lzaW9uOiBudW1iZXIgfSkge1xuICAgIHJldHVybiBwcmVjaXNpb24gKyBcIixcIiArIG5hbWU7XG59XG5cbi8qKiBDb252ZXJ0IGJpbmFyeSBkYXRhIHRvIGhleCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFycmF5VG9IZXgoZGF0YTogVWludDhBcnJheSkge1xuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgeCBvZiBkYXRhKSB7XG4gICAgICAgIHJlc3VsdCArPSAoXCIwMFwiICsgeC50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC50b1VwcGVyQ2FzZSgpO1xufVxuXG4vKiogQ29udmVydCBoZXggdG8gYmluYXJ5IGRhdGEgKi9cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1VpbnQ4QXJyYXkoaGV4OiBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIGhleCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBzdHJpbmcgY29udGFpbmluZyBoZXggZGlnaXRzXCIpO1xuICAgIH1cbiAgICBpZiAoaGV4Lmxlbmd0aCAlIDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT2RkIG51bWJlciBvZiBoZXggZGlnaXRzXCIpO1xuICAgIH1cbiAgICBjb25zdCBsID0gaGV4Lmxlbmd0aCAvIDI7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkobCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgY29uc3QgeCA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSAqIDIsIDIpLCAxNik7XG4gICAgICAgIGlmIChOdW1iZXIuaXNOYU4oeCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIGhleCBzdHJpbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0W2ldID0geDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplVW5rbm93bihidWZmZXI6IFNlcmlhbEJ1ZmZlciwgZGF0YTogYW55KTogU2VyaWFsQnVmZmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJEb24ndCBrbm93IGhvdyB0byBzZXJpYWxpemUgXCIgKyB0aGlzLm5hbWUpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVVua25vd24oYnVmZmVyOiBTZXJpYWxCdWZmZXIpOiBTZXJpYWxCdWZmZXIge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkRvbid0IGtub3cgaG93IHRvIGRlc2VyaWFsaXplIFwiICsgdGhpcy5uYW1lKTtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplU3RydWN0KHRoaXM6IFR5cGUsIGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSBuZXcgU2VyaWFsaXplclN0YXRlKCksIGFsbG93RXh0ZW5zaW9ucyA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5iYXNlKSB7XG4gICAgICAgIHRoaXMuYmFzZS5zZXJpYWxpemUoYnVmZmVyLCBkYXRhLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiB0aGlzLmZpZWxkcykge1xuICAgICAgICBpZiAoZmllbGQubmFtZSBpbiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoc3RhdGUuc2tpcHBlZEJpbmFyeUV4dGVuc2lvbikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInVuZXhwZWN0ZWQgXCIgKyB0aGlzLm5hbWUgKyBcIi5cIiArIGZpZWxkLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmllbGQudHlwZS5zZXJpYWxpemUoXG4gICAgICAgICAgICAgICAgYnVmZmVyLCBkYXRhW2ZpZWxkLm5hbWVdLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zICYmIGZpZWxkID09PSB0aGlzLmZpZWxkc1t0aGlzLmZpZWxkcy5sZW5ndGggLSAxXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYWxsb3dFeHRlbnNpb25zICYmIGZpZWxkLnR5cGUuZXh0ZW5zaW9uT2YpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5za2lwcGVkQmluYXJ5RXh0ZW5zaW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibWlzc2luZyBcIiArIHRoaXMubmFtZSArIFwiLlwiICsgZmllbGQubmFtZSArIFwiICh0eXBlPVwiICsgZmllbGQudHlwZS5uYW1lICsgXCIpXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVN0cnVjdCh0aGlzOiBUeXBlLCBidWZmZXI6IFNlcmlhbEJ1ZmZlciwgc3RhdGUgPSBuZXcgU2VyaWFsaXplclN0YXRlKCksIGFsbG93RXh0ZW5zaW9ucyA9IHRydWUpIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh0aGlzLmJhc2UpIHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5iYXNlLmRlc2VyaWFsaXplKGJ1ZmZlciwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0ge307XG4gICAgfVxuICAgIGZvciAoY29uc3QgZmllbGQgb2YgdGhpcy5maWVsZHMpIHtcbiAgICAgICAgaWYgKGFsbG93RXh0ZW5zaW9ucyAmJiBmaWVsZC50eXBlLmV4dGVuc2lvbk9mICYmICFidWZmZXIuaGF2ZVJlYWREYXRhKCkpIHtcbiAgICAgICAgICAgIHN0YXRlLnNraXBwZWRCaW5hcnlFeHRlbnNpb24gPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0W2ZpZWxkLm5hbWVdID0gZmllbGQudHlwZS5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVZhcmlhbnQodGhpczogVHlwZSwgYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU/OiBTZXJpYWxpemVyU3RhdGUsIGFsbG93RXh0ZW5zaW9ucz86IGJvb2xlYW4pIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkgfHwgZGF0YS5sZW5ndGggIT09IDIgfHwgdHlwZW9mIGRhdGFbMF0gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCB2YXJpYW50OiBbXCJ0eXBlXCIsIHZhbHVlXScpO1xuICAgIH1cbiAgICBjb25zdCBpID0gdGhpcy5maWVsZHMuZmluZEluZGV4KChmaWVsZDogRmllbGQpID0+IGZpZWxkLm5hbWUgPT09IGRhdGFbMF0pO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHR5cGUgXCIke2RhdGFbMF19XCIgaXMgbm90IHZhbGlkIGZvciB2YXJpYW50YCk7XG4gICAgfVxuICAgIGJ1ZmZlci5wdXNoVmFydWludDMyKGkpO1xuICAgIHRoaXMuZmllbGRzW2ldLnR5cGUuc2VyaWFsaXplKGJ1ZmZlciwgZGF0YVsxXSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplVmFyaWFudCh0aGlzOiBUeXBlLCBidWZmZXI6IFNlcmlhbEJ1ZmZlciwgc3RhdGU/OiBTZXJpYWxpemVyU3RhdGUsIGFsbG93RXh0ZW5zaW9ucz86IGJvb2xlYW4pIHtcbiAgICBjb25zdCBpID0gYnVmZmVyLmdldFZhcnVpbnQzMigpO1xuICAgIGlmIChpID49IHRoaXMuZmllbGRzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHR5cGUgaW5kZXggJHtpfSBpcyBub3QgdmFsaWQgZm9yIHZhcmlhbnRgKTtcbiAgICB9XG4gICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tpXTtcbiAgICByZXR1cm4gW2ZpZWxkLm5hbWUsIGZpZWxkLnR5cGUuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSwgYWxsb3dFeHRlbnNpb25zKV07XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZUFycmF5KHRoaXM6IFR5cGUsIGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBhbnlbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlPzogU2VyaWFsaXplclN0YXRlLCBhbGxvd0V4dGVuc2lvbnM/OiBib29sZWFuKSB7XG4gICAgYnVmZmVyLnB1c2hWYXJ1aW50MzIoZGF0YS5sZW5ndGgpO1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhKSB7XG4gICAgICAgIHRoaXMuYXJyYXlPZi5zZXJpYWxpemUoYnVmZmVyLCBpdGVtLCBzdGF0ZSwgZmFsc2UpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVBcnJheSh0aGlzOiBUeXBlLCBidWZmZXI6IFNlcmlhbEJ1ZmZlciwgc3RhdGU/OiBTZXJpYWxpemVyU3RhdGUsIGFsbG93RXh0ZW5zaW9ucz86IGJvb2xlYW4pIHtcbiAgICBjb25zdCBsZW4gPSBidWZmZXIuZ2V0VmFydWludDMyKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmFycmF5T2YuZGVzZXJpYWxpemUoYnVmZmVyLCBzdGF0ZSwgZmFsc2UpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplT3B0aW9uYWwodGhpczogVHlwZSwgYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlPzogU2VyaWFsaXplclN0YXRlLCBhbGxvd0V4dGVuc2lvbnM/OiBib29sZWFuKSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwgfHwgZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKDEpO1xuICAgICAgICB0aGlzLm9wdGlvbmFsT2Yuc2VyaWFsaXplKGJ1ZmZlciwgZGF0YSwgc3RhdGUsIGFsbG93RXh0ZW5zaW9ucyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZU9wdGlvbmFsKHRoaXM6IFR5cGUsIGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBzdGF0ZT86IFNlcmlhbGl6ZXJTdGF0ZSwgYWxsb3dFeHRlbnNpb25zPzogYm9vbGVhbikge1xuICAgIGlmIChidWZmZXIuZ2V0KCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uYWxPZi5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplRXh0ZW5zaW9uKHRoaXM6IFR5cGUsIGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU/OiBTZXJpYWxpemVyU3RhdGUsIGFsbG93RXh0ZW5zaW9ucz86IGJvb2xlYW4pIHtcbiAgICB0aGlzLmV4dGVuc2lvbk9mLnNlcmlhbGl6ZShidWZmZXIsIGRhdGEsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUV4dGVuc2lvbih0aGlzOiBUeXBlLCBidWZmZXI6IFNlcmlhbEJ1ZmZlciwgc3RhdGU/OiBTZXJpYWxpemVyU3RhdGUsIGFsbG93RXh0ZW5zaW9ucz86IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gdGhpcy5leHRlbnNpb25PZi5kZXNlcmlhbGl6ZShidWZmZXIsIHN0YXRlLCBhbGxvd0V4dGVuc2lvbnMpO1xufVxuXG5pbnRlcmZhY2UgQ3JlYXRlVHlwZUFyZ3Mge1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gICAgYWxpYXNPZk5hbWU/OiBzdHJpbmc7XG4gICAgYXJyYXlPZj86IFR5cGU7XG4gICAgb3B0aW9uYWxPZj86IFR5cGU7XG4gICAgZXh0ZW5zaW9uT2Y/OiBUeXBlO1xuICAgIGJhc2VOYW1lPzogc3RyaW5nO1xuICAgIGJhc2U/OiBUeXBlO1xuICAgIGZpZWxkcz86IEZpZWxkW107XG4gICAgc2VyaWFsaXplPzogKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBhbnksIHN0YXRlPzogU2VyaWFsaXplclN0YXRlLCBhbGxvd0V4dGVuc2lvbnM/OiBib29sZWFuKSA9PiB2b2lkO1xuICAgIGRlc2VyaWFsaXplPzogKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBzdGF0ZT86IFNlcmlhbGl6ZXJTdGF0ZSwgYWxsb3dFeHRlbnNpb25zPzogYm9vbGVhbikgPT4gYW55O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUeXBlKGF0dHJzOiBDcmVhdGVUeXBlQXJncyk6IFR5cGUge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiPG1pc3NpbmcgbmFtZT5cIixcbiAgICAgICAgYWxpYXNPZk5hbWU6IFwiXCIsXG4gICAgICAgIGFycmF5T2Y6IG51bGwsXG4gICAgICAgIG9wdGlvbmFsT2Y6IG51bGwsXG4gICAgICAgIGV4dGVuc2lvbk9mOiBudWxsLFxuICAgICAgICBiYXNlTmFtZTogXCJcIixcbiAgICAgICAgYmFzZTogbnVsbCxcbiAgICAgICAgZmllbGRzOiBbXSxcbiAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVVbmtub3duLFxuICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVVbmtub3duLFxuICAgICAgICAuLi5hdHRycyxcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjaGVja1JhbmdlKG9yaWc6IG51bWJlciwgY29udmVydGVkOiBudW1iZXIpIHtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKCtvcmlnKSB8fCBOdW1iZXIuaXNOYU4oK2NvbnZlcnRlZCkgfHwgKHR5cGVvZiBvcmlnICE9PSBcIm51bWJlclwiICYmIHR5cGVvZiBvcmlnICE9PSBcInN0cmluZ1wiKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCBudW1iZXJcIik7XG4gICAgfVxuICAgIGlmICgrb3JpZyAhPT0gK2NvbnZlcnRlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOdW1iZXIgaXMgb3V0IG9mIHJhbmdlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gK29yaWc7XG59XG5cbi8qKiBDcmVhdGUgdGhlIHNldCBvZiB0eXBlcyBidWlsdC1pbiB0byB0aGUgYWJpIGZvcm1hdCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUluaXRpYWxUeXBlcygpOiBNYXA8c3RyaW5nLCBUeXBlPiB7XG4gICAgY29uc3QgcmVzdWx0OiBNYXA8c3RyaW5nLCBUeXBlPiA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoe1xuICAgICAgICBib29sOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwiYm9vbFwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBib29sZWFuKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFeHBlY3RlZCB0cnVlIG9yIGZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaChkYXRhID8gMSA6IDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiAhIWJ1ZmZlci5nZXQoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHVpbnQ4OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwidWludDhcIixcbiAgICAgICAgICAgIHNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlciwgZGF0YTogbnVtYmVyKSB7IGJ1ZmZlci5wdXNoKGNoZWNrUmFuZ2UoZGF0YSwgZGF0YSAmIDB4ZmYpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0KCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBpbnQ4OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwiaW50OFwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBudW1iZXIpIHsgYnVmZmVyLnB1c2goY2hlY2tSYW5nZShkYXRhLCBkYXRhIDw8IDI0ID4+IDI0KSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldCgpIDw8IDI0ID4+IDI0OyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgdWludDE2OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwidWludDE2XCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IG51bWJlcikgeyBidWZmZXIucHVzaFVpbnQxNihjaGVja1JhbmdlKGRhdGEsIGRhdGEgJiAweGZmZmYpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0VWludDE2KCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBpbnQxNjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcImludDE2XCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IG51bWJlcikgeyBidWZmZXIucHVzaFVpbnQxNihjaGVja1JhbmdlKGRhdGEsIGRhdGEgPDwgMTYgPj4gMTYpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0VWludDE2KCkgPDwgMTYgPj4gMTY7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB1aW50MzI6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogXCJ1aW50MzJcIixcbiAgICAgICAgICAgIHNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlciwgZGF0YTogbnVtYmVyKSB7IGJ1ZmZlci5wdXNoVWludDMyKGNoZWNrUmFuZ2UoZGF0YSwgZGF0YSA+Pj4gMCkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRVaW50MzIoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHVpbnQ2NDogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcInVpbnQ2NFwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaEFycmF5KG51bWVyaWMuZGVjaW1hbFRvQmluYXJ5KDgsIFwiXCIgKyBkYXRhKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIG51bWVyaWMuYmluYXJ5VG9EZWNpbWFsKGJ1ZmZlci5nZXRVaW50OEFycmF5KDgpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGludDY0OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwiaW50NjRcIixcbiAgICAgICAgICAgIHNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlciwgZGF0YTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2hBcnJheShudW1lcmljLnNpZ25lZERlY2ltYWxUb0JpbmFyeSg4LCBcIlwiICsgZGF0YSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBudW1lcmljLnNpZ25lZEJpbmFyeVRvRGVjaW1hbChidWZmZXIuZ2V0VWludDhBcnJheSg4KSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBpbnQzMjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcImludDMyXCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IG51bWJlcikgeyBidWZmZXIucHVzaFVpbnQzMihjaGVja1JhbmdlKGRhdGEsIGRhdGEgfCAwKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFVpbnQzMigpIHwgMDsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHZhcnVpbnQzMjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcInZhcnVpbnQzMlwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBudW1iZXIpIHsgYnVmZmVyLnB1c2hWYXJ1aW50MzIoY2hlY2tSYW5nZShkYXRhLCBkYXRhID4+PiAwKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFZhcnVpbnQzMigpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgdmFyaW50MzI6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogXCJ2YXJpbnQzMlwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBudW1iZXIpIHsgYnVmZmVyLnB1c2hWYXJpbnQzMihjaGVja1JhbmdlKGRhdGEsIGRhdGEgfCAwKSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFZhcmludDMyKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB1aW50MTI4OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwidWludDEyOFwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBzdHJpbmcpIHsgYnVmZmVyLnB1c2hBcnJheShudW1lcmljLmRlY2ltYWxUb0JpbmFyeSgxNiwgXCJcIiArIGRhdGEpKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBudW1lcmljLmJpbmFyeVRvRGVjaW1hbChidWZmZXIuZ2V0VWludDhBcnJheSgxNikpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgaW50MTI4OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwiaW50MTI4XCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IHN0cmluZykge1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoQXJyYXkobnVtZXJpYy5zaWduZWREZWNpbWFsVG9CaW5hcnkoMTYsIFwiXCIgKyBkYXRhKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIG51bWVyaWMuc2lnbmVkQmluYXJ5VG9EZWNpbWFsKGJ1ZmZlci5nZXRVaW50OEFycmF5KDE2KSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBmbG9hdDMyOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwiZmxvYXQzMlwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBudW1iZXIpIHsgYnVmZmVyLnB1c2hGbG9hdDMyKGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRGbG9hdDMyKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBmbG9hdDY0OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwiZmxvYXQ2NFwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBudW1iZXIpIHsgYnVmZmVyLnB1c2hGbG9hdDY0KGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRGbG9hdDY0KCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBmbG9hdDEyODogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcImZsb2F0MTI4XCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IHN0cmluZykgeyBidWZmZXIucHVzaFVpbnQ4QXJyYXlDaGVja2VkKGhleFRvVWludDhBcnJheShkYXRhKSwgMTYpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGFycmF5VG9IZXgoYnVmZmVyLmdldFVpbnQ4QXJyYXkoMTYpKTsgfSxcbiAgICAgICAgfSksXG5cbiAgICAgICAgYnl0ZXM6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogXCJieXRlc1wiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBzdHJpbmcpIHsgYnVmZmVyLnB1c2hCeXRlcyhoZXhUb1VpbnQ4QXJyYXkoZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGFycmF5VG9IZXgoYnVmZmVyLmdldEJ5dGVzKCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgc3RyaW5nOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IHN0cmluZykgeyBidWZmZXIucHVzaFN0cmluZyhkYXRhKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0U3RyaW5nKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBuYW1lOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwibmFtZVwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBzdHJpbmcpIHsgYnVmZmVyLnB1c2hOYW1lKGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXROYW1lKCk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB0aW1lX3BvaW50OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwidGltZV9wb2ludFwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBzdHJpbmcpIHsgYnVmZmVyLnB1c2hOdW1iZXJBc1VpbnQ2NChkYXRlVG9UaW1lUG9pbnQoZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIHRpbWVQb2ludFRvRGF0ZShidWZmZXIuZ2V0VWludDY0QXNOdW1iZXIoKSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICB0aW1lX3BvaW50X3NlYzogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcInRpbWVfcG9pbnRfc2VjXCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IHN0cmluZykgeyBidWZmZXIucHVzaFVpbnQzMihkYXRlVG9UaW1lUG9pbnRTZWMoZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIHRpbWVQb2ludFNlY1RvRGF0ZShidWZmZXIuZ2V0VWludDMyKCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgYmxvY2tfdGltZXN0YW1wX3R5cGU6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogXCJibG9ja190aW1lc3RhbXBfdHlwZVwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBzdHJpbmcpIHsgYnVmZmVyLnB1c2hVaW50MzIoZGF0ZVRvQmxvY2tUaW1lc3RhbXAoZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGJsb2NrVGltZXN0YW1wVG9EYXRlKGJ1ZmZlci5nZXRVaW50MzIoKSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBzeW1ib2xfY29kZTogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcInN5bWJvbF9jb2RlXCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IHN0cmluZykgeyBidWZmZXIucHVzaFN5bWJvbENvZGUoZGF0YSk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyLmdldFN5bWJvbENvZGUoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHN5bWJvbDogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcInN5bWJvbFwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBzdHJpbmcpIHsgYnVmZmVyLnB1c2hTeW1ib2woc3RyaW5nVG9TeW1ib2woZGF0YSkpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIHN5bWJvbFRvU3RyaW5nKGJ1ZmZlci5nZXRTeW1ib2woKSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBhc3NldDogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcImFzc2V0XCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IHN0cmluZykgeyBidWZmZXIucHVzaEFzc2V0KGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRBc3NldCgpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgY2hlY2tzdW0xNjA6IGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZTogXCJjaGVja3N1bTE2MFwiLFxuICAgICAgICAgICAgc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyLCBkYXRhOiBzdHJpbmcpIHsgYnVmZmVyLnB1c2hVaW50OEFycmF5Q2hlY2tlZChoZXhUb1VpbnQ4QXJyYXkoZGF0YSksIDIwKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBhcnJheVRvSGV4KGJ1ZmZlci5nZXRVaW50OEFycmF5KDIwKSk7IH0sXG4gICAgICAgIH0pLFxuICAgICAgICBjaGVja3N1bTI1NjogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcImNoZWNrc3VtMjU2XCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IHN0cmluZykgeyBidWZmZXIucHVzaFVpbnQ4QXJyYXlDaGVja2VkKGhleFRvVWludDhBcnJheShkYXRhKSwgMzIpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGFycmF5VG9IZXgoYnVmZmVyLmdldFVpbnQ4QXJyYXkoMzIpKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGNoZWNrc3VtNTEyOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwiY2hlY2tzdW01MTJcIixcbiAgICAgICAgICAgIHNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlciwgZGF0YTogc3RyaW5nKSB7IGJ1ZmZlci5wdXNoVWludDhBcnJheUNoZWNrZWQoaGV4VG9VaW50OEFycmF5KGRhdGEpLCA2NCk7IH0sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlcikgeyByZXR1cm4gYXJyYXlUb0hleChidWZmZXIuZ2V0VWludDhBcnJheSg2NCkpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgcHVibGljX2tleTogY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lOiBcInB1YmxpY19rZXlcIixcbiAgICAgICAgICAgIHNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlciwgZGF0YTogc3RyaW5nKSB7IGJ1ZmZlci5wdXNoUHVibGljS2V5KGRhdGEpOyB9LFxuICAgICAgICAgICAgZGVzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIpIHsgcmV0dXJuIGJ1ZmZlci5nZXRQdWJsaWNLZXkoKTsgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHByaXZhdGVfa2V5OiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwicHJpdmF0ZV9rZXlcIixcbiAgICAgICAgICAgIHNlcmlhbGl6ZShidWZmZXI6IFNlcmlhbEJ1ZmZlciwgZGF0YTogc3RyaW5nKSB7IGJ1ZmZlci5wdXNoUHJpdmF0ZUtleShkYXRhKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0UHJpdmF0ZUtleSgpOyB9LFxuICAgICAgICB9KSxcbiAgICAgICAgc2lnbmF0dXJlOiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWU6IFwic2lnbmF0dXJlXCIsXG4gICAgICAgICAgICBzZXJpYWxpemUoYnVmZmVyOiBTZXJpYWxCdWZmZXIsIGRhdGE6IHN0cmluZykgeyBidWZmZXIucHVzaFNpZ25hdHVyZShkYXRhKTsgfSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplKGJ1ZmZlcjogU2VyaWFsQnVmZmVyKSB7IHJldHVybiBidWZmZXIuZ2V0U2lnbmF0dXJlKCk7IH0sXG4gICAgICAgIH0pLFxuICAgIH0pKTtcblxuICAgIHJlc3VsdC5zZXQoXCJleHRlbmRlZF9hc3NldFwiLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgbmFtZTogXCJleHRlbmRlZF9hc3NldFwiLFxuICAgICAgICBiYXNlTmFtZTogXCJcIixcbiAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICB7IG5hbWU6IFwicXVhbnRpdHlcIiwgdHlwZU5hbWU6IFwiYXNzZXRcIiwgdHlwZTogcmVzdWx0LmdldChcImFzc2V0XCIpIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiY29udHJhY3RcIiwgdHlwZU5hbWU6IFwibmFtZVwiLCB0eXBlOiByZXN1bHQuZ2V0KFwibmFtZVwiKSB9LFxuICAgICAgICBdLFxuICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplU3RydWN0LFxuICAgIH0pKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59IC8vIGNyZWF0ZUluaXRpYWxUeXBlcygpXG5cbi8qKiBHZXQgdHlwZSBmcm9tIGB0eXBlc2AgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlKHR5cGVzOiBNYXA8c3RyaW5nLCBUeXBlPiwgbmFtZTogc3RyaW5nKTogVHlwZSB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVzLmdldChuYW1lKTtcbiAgICBpZiAodHlwZSAmJiB0eXBlLmFsaWFzT2ZOYW1lKSB7XG4gICAgICAgIHJldHVybiBnZXRUeXBlKHR5cGVzLCB0eXBlLmFsaWFzT2ZOYW1lKTtcbiAgICB9XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICAgIGlmIChuYW1lLmVuZHNXaXRoKFwiW11cIikpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVR5cGUoe1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIGFycmF5T2Y6IGdldFR5cGUodHlwZXMsIG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMikpLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVBcnJheSxcbiAgICAgICAgICAgIGRlc2VyaWFsaXplOiBkZXNlcmlhbGl6ZUFycmF5LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG5hbWUuZW5kc1dpdGgoXCI/XCIpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBvcHRpb25hbE9mOiBnZXRUeXBlKHR5cGVzLCBuYW1lLnN1YnN0cigwLCBuYW1lLmxlbmd0aCAtIDEpKSxcbiAgICAgICAgICAgIHNlcmlhbGl6ZTogc2VyaWFsaXplT3B0aW9uYWwsXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVPcHRpb25hbCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChuYW1lLmVuZHNXaXRoKFwiJFwiKSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlVHlwZSh7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgZXh0ZW5zaW9uT2Y6IGdldFR5cGUodHlwZXMsIG5hbWUuc3Vic3RyKDAsIG5hbWUubGVuZ3RoIC0gMSkpLFxuICAgICAgICAgICAgc2VyaWFsaXplOiBzZXJpYWxpemVFeHRlbnNpb24sXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVFeHRlbnNpb24sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHR5cGU6IFwiICsgbmFtZSk7XG59XG5cbi8qKlxuICogR2V0IHR5cGVzIGZyb20gYWJpXG4gKiBAcGFyYW0gaW5pdGlhbFR5cGVzIFNldCBvZiB0eXBlcyB0byBidWlsZCBvbi5cbiAqICAgICBJbiBtb3N0IGNhc2VzLCBpdCdzIGJlc3QgdG8gZmlsbCB0aGlzIGZyb20gYSBmcmVzaCBjYWxsIHRvIGBnZXRUeXBlc0Zyb21BYmkoKWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlc0Zyb21BYmkoaW5pdGlhbFR5cGVzOiBNYXA8c3RyaW5nLCBUeXBlPiwgYWJpOiBBYmkpIHtcbiAgICBjb25zdCB0eXBlcyA9IG5ldyBNYXAoaW5pdGlhbFR5cGVzKTtcbiAgICBpZiAoYWJpLnR5cGVzKSB7XG4gICAgICAgIGZvciAoY29uc3QgeyBuZXdfdHlwZV9uYW1lLCB0eXBlIH0gb2YgYWJpLnR5cGVzKSB7XG4gICAgICAgICAgICB0eXBlcy5zZXQobmV3X3R5cGVfbmFtZSxcbiAgICAgICAgICAgICAgICBjcmVhdGVUeXBlKHsgbmFtZTogbmV3X3R5cGVfbmFtZSwgYWxpYXNPZk5hbWU6IHR5cGUgfSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChhYmkuc3RydWN0cykge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgYmFzZSwgZmllbGRzIH0gb2YgYWJpLnN0cnVjdHMpIHtcbiAgICAgICAgICAgIHR5cGVzLnNldChuYW1lLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIGJhc2VOYW1lOiBiYXNlLFxuICAgICAgICAgICAgICAgIGZpZWxkczogZmllbGRzLm1hcCgoeyBuYW1lOiBuLCB0eXBlIH0pID0+ICh7IG5hbWU6IG4sIHR5cGVOYW1lOiB0eXBlLCB0eXBlOiBudWxsIH0pKSxcbiAgICAgICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVN0cnVjdCxcbiAgICAgICAgICAgICAgICBkZXNlcmlhbGl6ZTogZGVzZXJpYWxpemVTdHJ1Y3QsXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGFiaS52YXJpYW50cykge1xuICAgICAgICBmb3IgKGNvbnN0IHsgbmFtZSwgdHlwZXM6IHQgfSBvZiBhYmkudmFyaWFudHMpIHtcbiAgICAgICAgICAgIHR5cGVzLnNldChuYW1lLCBjcmVhdGVUeXBlKHtcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIGZpZWxkczogdC5tYXAoKHMpID0+ICh7IG5hbWU6IHMsIHR5cGVOYW1lOiBzLCB0eXBlOiBudWxsIH0pKSxcbiAgICAgICAgICAgICAgICBzZXJpYWxpemU6IHNlcmlhbGl6ZVZhcmlhbnQsXG4gICAgICAgICAgICAgICAgZGVzZXJpYWxpemU6IGRlc2VyaWFsaXplVmFyaWFudCxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtuYW1lLCB0eXBlXSBvZiB0eXBlcykge1xuICAgICAgICBpZiAodHlwZS5iYXNlTmFtZSkge1xuICAgICAgICAgICAgdHlwZS5iYXNlID0gZ2V0VHlwZSh0eXBlcywgdHlwZS5iYXNlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiB0eXBlLmZpZWxkcykge1xuICAgICAgICAgICAgZmllbGQudHlwZSA9IGdldFR5cGUodHlwZXMsIGZpZWxkLnR5cGVOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHlwZXM7XG59IC8vIGdldFR5cGVzRnJvbUFiaVxuXG4vKiogVEFQb1M6IFJldHVybiB0cmFuc2FjdGlvbiBmaWVsZHMgd2hpY2ggcmVmZXJlbmNlIGByZWZCbG9ja2AgYW5kIGV4cGlyZSBgZXhwaXJlU2Vjb25kc2AgYWZ0ZXIgYHJlZkJsb2NrLnRpbWVzdGFtcGAgKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2FjdGlvbkhlYWRlcihyZWZCbG9jazogQmxvY2tUYXBvc0luZm8sIGV4cGlyZVNlY29uZHM6IG51bWJlcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIGV4cGlyYXRpb246IHRpbWVQb2ludFNlY1RvRGF0ZShkYXRlVG9UaW1lUG9pbnRTZWMocmVmQmxvY2sudGltZXN0YW1wKSArIGV4cGlyZVNlY29uZHMpLFxuICAgICAgICByZWZfYmxvY2tfbnVtOiByZWZCbG9jay5ibG9ja19udW0gJiAweGZmZmYsXG4gICAgICAgIHJlZl9ibG9ja19wcmVmaXg6IHJlZkJsb2NrLnJlZl9ibG9ja19wcmVmaXgsXG4gICAgfTtcbn1cblxuLyoqIENvbnZlcnQgYWN0aW9uIGRhdGEgdG8gc2VyaWFsaXplZCBmb3JtIChoZXgpICovXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplQWN0aW9uRGF0YShjb250cmFjdDogQ29udHJhY3QsIGFjY291bnQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkYXRhOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RW5jb2RlcjogVGV4dEVuY29kZXIsIHRleHREZWNvZGVyOiBUZXh0RGVjb2Rlcik6IHN0cmluZyB7XG4gICAgY29uc3QgYWN0aW9uID0gY29udHJhY3QuYWN0aW9ucy5nZXQobmFtZSk7XG4gICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGFjdGlvbiAke25hbWV9IGluIGNvbnRyYWN0ICR7YWNjb3VudH1gKTtcbiAgICB9XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFNlcmlhbEJ1ZmZlcih7IHRleHRFbmNvZGVyLCB0ZXh0RGVjb2RlciB9KTtcbiAgICBhY3Rpb24uc2VyaWFsaXplKGJ1ZmZlciwgZGF0YSk7XG4gICAgcmV0dXJuIGFycmF5VG9IZXgoYnVmZmVyLmFzVWludDhBcnJheSgpKTtcbn1cblxuLyoqIFJldHVybiBhY3Rpb24gaW4gc2VyaWFsaXplZCBmb3JtICovXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplQWN0aW9uKGNvbnRyYWN0OiBDb250cmFjdCwgYWNjb3VudDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb246IEF1dGhvcml6YXRpb25bXSwgZGF0YTogYW55LCB0ZXh0RW5jb2RlcjogVGV4dEVuY29kZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHREZWNvZGVyOiBUZXh0RGVjb2Rlcik6IFNlcmlhbGl6ZWRBY3Rpb24ge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFjY291bnQsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIGF1dGhvcml6YXRpb24sXG4gICAgICAgIGRhdGE6IHNlcmlhbGl6ZUFjdGlvbkRhdGEoY29udHJhY3QsIGFjY291bnQsIG5hbWUsIGRhdGEsIHRleHRFbmNvZGVyLCB0ZXh0RGVjb2RlciksXG4gICAgfTtcbn1cblxuLyoqIERlc2VyaWFsaXplIGFjdGlvbiBkYXRhLiBJZiBgZGF0YWAgaXMgYSBgc3RyaW5nYCwgdGhlbiBpdCdzIGFzc3VtZWQgdG8gYmUgaW4gaGV4LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc2VyaWFsaXplQWN0aW9uRGF0YShjb250cmFjdDogQ29udHJhY3QsIGFjY291bnQ6IHN0cmluZywgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBzdHJpbmcgfCBVaW50OEFycmF5IHwgbnVtYmVyW10sIHRleHRFbmNvZGVyOiBUZXh0RW5jb2RlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dERlY29kZXI6IFRleHREZWNvZGVyKTogYW55IHtcbiAgICBjb25zdCBhY3Rpb24gPSBjb250cmFjdC5hY3Rpb25zLmdldChuYW1lKTtcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZGF0YSA9IGhleFRvVWludDhBcnJheShkYXRhKTtcbiAgICB9XG4gICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGFjdGlvbiAke25hbWV9IGluIGNvbnRyYWN0ICR7YWNjb3VudH1gKTtcbiAgICB9XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFNlcmlhbEJ1ZmZlcih7IHRleHREZWNvZGVyLCB0ZXh0RW5jb2RlciB9KTtcbiAgICBidWZmZXIucHVzaEFycmF5KGRhdGEpO1xuICAgIHJldHVybiBhY3Rpb24uZGVzZXJpYWxpemUoYnVmZmVyKTtcbn1cblxuLyoqIERlc2VyaWFsaXplIGFjdGlvbi4gSWYgYGRhdGFgIGlzIGEgYHN0cmluZ2AsIHRoZW4gaXQncyBhc3N1bWVkIHRvIGJlIGluIGhleC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXNlcmlhbGl6ZUFjdGlvbihjb250cmFjdDogQ29udHJhY3QsIGFjY291bnQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBhdXRob3JpemF0aW9uOiBBdXRob3JpemF0aW9uW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogc3RyaW5nIHwgVWludDhBcnJheSB8IG51bWJlcltdLCB0ZXh0RW5jb2RlcjogVGV4dEVuY29kZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dERlY29kZXI6IFRleHREZWNvZGVyKTogQWN0aW9uIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhY2NvdW50LFxuICAgICAgICBuYW1lLFxuICAgICAgICBhdXRob3JpemF0aW9uLFxuICAgICAgICBkYXRhOiBkZXNlcmlhbGl6ZUFjdGlvbkRhdGEoY29udHJhY3QsIGFjY291bnQsIG5hbWUsIGRhdGEsIHRleHRFbmNvZGVyLCB0ZXh0RGVjb2RlciksXG4gICAgfTtcbn1cbiIsIi8vIGh0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vd2x6bGEwMDAvYmFjODNkZjZkM2M1MTkxNmM0ZGQwYmM5NDdlNDY5NDcvcmF3LzdlZTM0NjJiMDk1YWIyMjU4MGRkYWYxOTFmNDRhNTkwZGE2ZmUzM2IvUklQRU1ELTE2MC5qc1xuXG4vKlxuXHRSSVBFTUQtMTYwLmpzXG5cblx0XHRkZXZlbG9wZWRcblx0XHRcdGJ5IEsuIChodHRwczovL2dpdGh1Yi5jb20vd2x6bGEwMDApXG5cdFx0XHRvbiBEZWNlbWJlciAyNy0yOSwgMjAxNyxcblxuXHRcdGxpY2Vuc2VkIHVuZGVyXG5cblxuXHRcdHRoZSBNSVQgbGljZW5zZVxuXG5cdFx0Q29weXJpZ2h0IChjKSAyMDE3IEsuXG5cblx0XHQgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cblx0XHRvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuXHRcdGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dFxuXHRcdHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLFxuXHRcdGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuXHRcdHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG5cdFx0U29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcblx0XHRjb25kaXRpb25zOlxuXG5cdFx0IFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG5cdFx0aW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblx0XHQgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcblx0XHRFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcblx0XHRPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuXHRcdE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUXG5cdFx0SE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksXG5cdFx0V0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG5cdFx0RlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuXHRcdE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiovXG5cblwidXNlIHN0cmljdFwiO1xuXG5jbGFzcyBSSVBFTUQxNjBcbntcblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0Ly8gaHR0cHM6Ly93ZWJjYWNoZS5nb29nbGV1c2VyY29udGVudC5jb20vc2VhcmNoP3E9Y2FjaGU6Q25MT2dvbFRIWUVKOmh0dHBzOi8vd3d3LmNvc2ljLmVzYXQua3VsZXV2ZW4uYmUvcHVibGljYXRpb25zL2FydGljbGUtMzE3LnBkZlxuXHRcdC8vIGh0dHA6Ly9zaG9kaGdhbmdhLmluZmxpYm5ldC5hYy5pbi9iaXRzdHJlYW0vMTA2MDMvMjI5NzgvMTMvMTNfYXBwZW5kaXgucGRmXG5cdH1cblxuXHRzdGF0aWMgZ2V0X25fcGFkX2J5dGVzKG1lc3NhZ2Vfc2l6ZSAvKiBpbiBieXRlcywgMSBieXRlIGlzIDggYml0cy4gKi8pXG5cdHtcblx0XHQvLyAgT2J0YWluIHRoZSBudW1iZXIgb2YgYnl0ZXMgbmVlZGVkIHRvIHBhZCB0aGUgbWVzc2FnZS5cblx0XHQvLyBJdCBkb2VzIG5vdCBjb250YWluIHRoZSBzaXplIG9mIHRoZSBtZXNzYWdlIHNpemUgaW5mb3JtYXRpb24uXG5cdFx0Lypcblx0XHRcdGh0dHBzOi8vd2ViY2FjaGUuZ29vZ2xldXNlcmNvbnRlbnQuY29tL3NlYXJjaD9xPWNhY2hlOkNuTE9nb2xUSFlFSjpodHRwczovL3d3dy5jb3NpYy5lc2F0Lmt1bGV1dmVuLmJlL3B1YmxpY2F0aW9ucy9hcnRpY2xlLTMxNy5wZGZcblxuXHRcdFx0VGhlIENyeXB0b2dyYXBoaWMgSGFzaCBGdW5jdGlvbiBSSVBFTUQtMTYwXG5cblx0XHRcdHdyaXR0ZW4gYnlcblx0XHRcdFx0QmFydCBQcmVuZWVsLFxuXHRcdFx0XHRIYW5zIERvYmJlcnRpbixcblx0XHRcdFx0QW50b29uIEJvc3NlbGFlcnNcblx0XHRcdGluXG5cdFx0XHRcdDE5OTcuXG5cblx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRcdMKnNSAgICAgRGVzY3JpcHRpb24gb2YgUklQRU1ELTE2MFxuXG5cdFx0XHQuLi4uLi5cblxuXHRcdFx0IEluIG9yZGVyIHRvIGd1YXJhbnRlZSB0aGF0IHRoZSB0b3RhbCBpbnB1dCBzaXplIGlzIGFcblx0XHRcdG11bHRpcGxlIG9mIDUxMiBiaXRzLCB0aGUgaW5wdXQgaXMgcGFkZGVkIGluIHRoZSBzYW1lXG5cdFx0XHR3YXkgYXMgZm9yIGFsbCB0aGUgbWVtYmVycyBvZiB0aGUgTUQ0LWZhbWlseTogb25lXG5cdFx0XHRhcHBlbmRzIGEgc2luZ2xlIDEgZm9sbG93ZWQgYnkgYSBzdHJpbmcgb2YgMHMgKHRoZVxuXHRcdFx0bnVtYmVyIG9mIDBzIGxpZXMgYmV0d2VlbiAwIGFuZCA1MTEpOyB0aGUgbGFzdCA2NCBiaXRzXG5cdFx0XHRvZiB0aGUgZXh0ZW5kZWQgaW5wdXQgY29udGFpbiB0aGUgYmluYXJ5IHJlcHJlc2VudGF0aW9uXG5cdFx0XHRvZiB0aGUgaW5wdXQgc2l6ZSBpbiBiaXRzLCBsZWFzdCBzaWduaWZpY2FudCBieXRlIGZpcnN0LlxuXHRcdCovXG5cdFx0Lypcblx0XHRcdGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvcmZjL3JmYzExODYudHh0XG5cblx0XHRcdFJGQyAxMTg2OiBNRDQgTWVzc2FnZSBEaWdlc3QgQWxnb3JpdGhtLlxuXG5cdFx0XHR3cml0dGVuIGJ5XG5cdFx0XHRcdFJvbmFsZCBMaW5uIFJpdmVzdFxuXHRcdFx0aW5cblx0XHRcdFx0T2N0b2JlciAxOTkwLlxuXG5cdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0XHTCpzMgICAgIE1ENCBBbGdvcml0aG0gRGVzY3JpcHRpb25cblxuXHRcdFx0Li4uLi4uXG5cblx0XHRcdFN0ZXAgMS4gQXBwZW5kIHBhZGRpbmcgYml0c1xuXG5cdFx0XHQgVGhlIG1lc3NhZ2UgaXMgXCJwYWRkZWRcIiAoZXh0ZW5kZWQpIHNvIHRoYXQgaXRzIGxlbmd0aFxuXHRcdFx0KGluIGJpdHMpIGlzIGNvbmdydWVudCB0byA0NDgsIG1vZHVsbyA1MTIuIFRoYXQgaXMsIHRoZVxuXHRcdFx0bWVzc2FnZSBpcyBleHRlbmRlZCBzbyB0aGF0IGl0IGlzIGp1c3QgNjQgYml0cyBzaHkgb2Zcblx0XHRcdGJlaW5nIGEgbXVsdGlwbGUgb2YgNTEyIGJpdHMgbG9uZy4gUGFkZGluZyBpcyBhbHdheXNcblx0XHRcdHBlcmZvcm1lZCwgZXZlbiBpZiB0aGUgbGVuZ3RoIG9mIHRoZSBtZXNzYWdlIGlzIGFscmVhZHlcblx0XHRcdGNvbmdydWVudCB0byA0NDgsIG1vZHVsbyA1MTIgKGluIHdoaWNoIGNhc2UgNTEyIGJpdHMgb2Zcblx0XHRcdHBhZGRpbmcgYXJlIGFkZGVkKS5cblxuXHRcdFx0IFBhZGRpbmcgaXMgcGVyZm9ybWVkIGFzIGZvbGxvd3M6IGEgc2luZ2xlIFwiMVwiIGJpdCBpc1xuXHRcdFx0YXBwZW5kZWQgdG8gdGhlIG1lc3NhZ2UsIGFuZCB0aGVuIGVub3VnaCB6ZXJvIGJpdHMgYXJlXG5cdFx0XHRhcHBlbmRlZCBzbyB0aGF0IHRoZSBsZW5ndGggaW4gYml0cyBvZiB0aGUgcGFkZGVkXG5cdFx0XHRtZXNzYWdlIGJlY29tZXMgY29uZ3J1ZW50IHRvIDQ0OCwgbW9kdWxvIDUxMi5cblxuXHRcdFx0U3RlcCAyLiBBcHBlbmQgbGVuZ3RoXG5cblx0XHRcdCBBIDY0LWJpdCByZXByZXNlbnRhdGlvbiBvZiBiICh0aGUgbGVuZ3RoIG9mIHRoZSBtZXNzYWdlXG5cdFx0XHRiZWZvcmUgdGhlIHBhZGRpbmcgYml0cyB3ZXJlIGFkZGVkKSBpcyBhcHBlbmRlZCB0byB0aGVcblx0XHRcdHJlc3VsdCBvZiB0aGUgcHJldmlvdXMgc3RlcC4gSW4gdGhlIHVubGlrZWx5IGV2ZW50IHRoYXRcblx0XHRcdGIgaXMgZ3JlYXRlciB0aGFuIDJeNjQsIHRoZW4gb25seSB0aGUgbG93LW9yZGVyIDY0IGJpdHNcblx0XHRcdG9mIGIgYXJlIHVzZWQuIChUaGVzZSBiaXRzIGFyZSBhcHBlbmRlZCBhcyB0d28gMzItYml0XG5cdFx0XHR3b3JkcyBhbmQgYXBwZW5kZWQgbG93LW9yZGVyIHdvcmQgZmlyc3QgaW4gYWNjb3JkYW5jZVxuXHRcdFx0d2l0aCB0aGUgcHJldmlvdXMgY29udmVudGlvbnMuKVxuXG5cdFx0XHQgQXQgdGhpcyBwb2ludCB0aGUgcmVzdWx0aW5nIG1lc3NhZ2UgKGFmdGVyIHBhZGRpbmcgd2l0aFxuXHRcdFx0Yml0cyBhbmQgd2l0aCBiKSBoYXMgYSBsZW5ndGggdGhhdCBpcyBhbiBleGFjdCBtdWx0aXBsZVxuXHRcdFx0b2YgNTEyIGJpdHMuIEVxdWl2YWxlbnRseSwgdGhpcyBtZXNzYWdlIGhhcyBhIGxlbmd0aFxuXHRcdFx0dGhhdCBpcyBhbiBleGFjdCBtdWx0aXBsZSBvZiAxNiAoMzItYml0KSB3b3Jkcy4gTGV0XG5cdFx0XHRNWzAgLi4uIE4tMV0gZGVub3RlIHRoZSB3b3JkcyBvZiB0aGUgcmVzdWx0aW5nIG1lc3NhZ2UsXG5cdFx0XHR3aGVyZSBOIGlzIGEgbXVsdGlwbGUgb2YgMTYuXG5cdFx0Ki9cblx0XHQvLyBodHRwczovL2NyeXB0by5zdGFja2V4Y2hhbmdlLmNvbS9hLzMyNDA3LzU0NTY4XG5cdFx0Lypcblx0XHRcdEV4YW1wbGUgY2FzZSAgIyAxXG5cdFx0XHRcdFswIGJpdDogbWVzc2FnZS5dXG5cdFx0XHRcdFsxIGJpdDogMS5dXG5cdFx0XHRcdFs0NDcgYml0czogMC5dXG5cdFx0XHRcdFs2NCBiaXRzOiBtZXNzYWdlIHNpemUgaW5mb3JtYXRpb24uXVxuXG5cdFx0XHRFeGFtcGxlIGNhc2UgICMgMlxuXHRcdFx0XHRbNTEyLWJpdHM6IG1lc3NhZ2VdXG5cdFx0XHRcdFsxIGJpdDogMS5dXG5cdFx0XHRcdFs0NDcgYml0czogMC5dXG5cdFx0XHRcdFs2NCBiaXRzOiBtZXNzYWdlIHNpemUgaW5mb3JtYXRpb24uXVxuXG5cdFx0XHRFeGFtcGxlIGNhc2UgICMgM1xuXHRcdFx0XHRbKDUxMiAtIDY0ID0gNDQ4KSBiaXRzOiBtZXNzYWdlLl1cblx0XHRcdFx0WzEgYml0OiAxLl1cblx0XHRcdFx0WzUxMSBiaXRzOiAwLl1cblx0XHRcdFx0WzY0IGJpdHM6IG1lc3NhZ2Ugc2l6ZSBpbmZvcm1hdGlvbi5dXG5cblx0XHRcdEV4YW1wbGUgY2FzZSAgIyA0XG5cdFx0XHRcdFsoNTEyIC0gNjUgPSA0NDcpIGJpdHM6IG1lc3NhZ2UuXVxuXHRcdFx0XHRbMSBiaXQ6IDEuXVxuXHRcdFx0XHRbMCBiaXQ6IDAuXVxuXHRcdFx0XHRbNjQgYml0czogbWVzc2FnZSBzaXplIGluZm9ybWF0aW9uLl1cblx0XHQqL1xuXHRcdC8vIFRoZSBudW1iZXIgb2YgcGFkZGluZyB6ZXJvIGJpdHM6XG5cdFx0Ly8gICAgICA1MTEgLSBbeyhtZXNzYWdlIHNpemUgaW4gYml0cykgKyA2NH0gKG1vZCA1MTIpXVxuXHRcdHJldHVybiA2NCAtICgobWVzc2FnZV9zaXplICsgOCkgJiAwYjAwMTExMTExIC8qIDYzICovKTtcblx0fVxuXHRzdGF0aWMgcGFkKG1lc3NhZ2UgLyogQW4gQXJyYXlCdWZmZXIuICovKVxuXHR7XG5cdFx0Y29uc3QgbWVzc2FnZV9zaXplID0gbWVzc2FnZS5ieXRlTGVuZ3RoO1xuXHRcdGNvbnN0IG5fcGFkID0gUklQRU1EMTYwLmdldF9uX3BhZF9ieXRlcyhtZXNzYWdlX3NpemUpO1xuXG5cdFx0Ly8gIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAgaXMgKCgyICoqIDUzKSAtIDEpIGFuZFxuXHRcdC8vIGJpdHdpc2Ugb3BlcmF0aW9uIGluIEphdmFzY3JpcHQgaXMgZG9uZSBvbiAzMi1iaXRzIG9wZXJhbmRzLlxuXHRcdGNvbnN0IGRpdm1vZCA9IChkaXZpZGVuZCwgZGl2aXNvcikgPT4gW1xuXHRcdFx0TWF0aC5mbG9vcihkaXZpZGVuZCAvIGRpdmlzb3IpLFxuXHRcdFx0ZGl2aWRlbmQgJSBkaXZpc29yXG5cdFx0XTtcblx0XHQvKlxuVG8gc2hpZnRcblxuICAgMDAwMDAwMDAgMDAwPz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0IG9cbiAgIDAwMDAwMDAwID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/MDAwXG5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbk1ldGhvZCAjMVxuXG4gICAgMDAwMDAwMDAgMDAwPz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/XG4gICBbMDAwMDAwMDAgMDAwQUFBQUEgQUFBQUFBQUEgQUFBQUFBQUFdICg8QT4gY2FwdHVyZWQpXG4gICBbMDAwMDAwMDAgQUFBQUFBQUEgQUFBQUFBQUEgQUFBQUEwMDBdICg8QT4gc2hpZnRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAoPEI+IGNhcHR1cmVkKSBbQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkJdXG4gICAgICAgICAgICAgICAgICAgICAoPEI+IHNoaWZ0ZWQpIFtCQkJdW0JCQkJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCIEJCQkJCMDAwXVxuICAgWzAwMDAwMDAwIEFBQUFBQUFBIEFBQUFBQUFBIEFBQUFBQkJCXSAoPEE+ICYgPEJfMj4gbWVyZ2VkKVxuICAgWzAwMDAwMDAwIEFBQUFBQUFBIEFBQUFBQUFBIEFBQUFBQkJCXVtCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQjAwMF1cbiAgICAwMDAwMDAwMCA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/PyAgPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8wMDBcblxuXHRcdGNvbnN0IHVpbnQzMl9tYXhfcGx1c18xID0gMHgxMDAwMDAwMDA7IC8vICgyICoqIDMyKVxuXHRcdGNvbnN0IFtcblx0XHRcdG1zZ19ieXRlX3NpemVfbW9zdCwgLy8gVmFsdWUgcmFuZ2UgWzAsICgyICoqIDIxKSAtIDFdLlxuXHRcdFx0bXNnX2J5dGVfc2l6ZV9sZWFzdCAvLyBWYWx1ZSByYW5nZSBbMCwgKDIgKiogMzIpIC0gMV0uXG5cdFx0XSA9IGRpdm1vZChtZXNzYWdlX3NpemUsIHVpbnQzMl9tYXhfcGx1c18xKTtcblx0XHRjb25zdCBbXG5cdFx0XHRjYXJyeSwgLy8gVmFsdWUgcmFuZ2UgWzAsIDddLlxuXHRcdFx0bXNnX2JpdF9zaXplX2xlYXN0IC8vIFZhbHVlIHJhbmdlIFswLCAoMiAqKiAzMikgLSA4XS5cblx0XHRdID0gZGl2bW9kKG1lc3NhZ2VfYnl0ZV9zaXplX2xlYXN0ICogOCwgdWludDMyX21heF9wbHVzXzEpO1xuXHRcdGNvbnN0IG1lc3NhZ2VfYml0X3NpemVfbW9zdCA9IG1lc3NhZ2VfYnl0ZV9zaXplX21vc3QgKiA4XG5cdFx0XHQrIGNhcnJ5OyAvLyBWYWx1ZSByYW5nZSBbMCwgKDIgKiogMjQpIC0gMV0uXG5cbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbk1ldGhvZCAjMlxuICAgIDAwMDAwMDAwIDAwMD8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ICA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/PyA/Pz8/Pz8/P1xuICAgICAgWzAwMDAwIDAwMEFBQUFBIEFBQUFBQUFBIEFBQUFBQUFBICBBQUFdICg8QT4gY2FwdHVyZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgKDxCPiBjYXB0dXJlZCkgWzAwMEJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCIEJCQkJCQkJCXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoPEI+IHNoaWZ0ZWQpIFtCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQkJCQiBCQkJCQjAwMF1cbiAgIFswMDAwMDAwMCBBQUFBQUFBQSBBQUFBQUFBQSBBQUFBQUFBQV1bQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkJCQkIgQkJCQkIwMDBdXG4gICAgMDAwMDAwMDAgPz8/Pz8/Pz8gPz8/Pz8/Pz8gPz8/Pz8/Pz8gID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/Pz8/ID8/Pz8/MDAwXG5cblx0XHQqL1xuXHRcdGNvbnN0IFtcblx0XHRcdG1zZ19iaXRfc2l6ZV9tb3N0LFxuXHRcdFx0bXNnX2JpdF9zaXplX2xlYXN0XG5cdFx0XSA9IGRpdm1vZChtZXNzYWdlX3NpemUsIDUzNjg3MDkxMiAvKiAoMiAqKiAyOSkgKi8pXG5cdFx0XHQubWFwKCh4LCBpbmRleCkgPT4gKGluZGV4ID8gKHggKiA4KSA6IHgpKTtcblxuXHRcdC8vIGBBcnJheUJ1ZmZlci50cmFuc2ZlcigpYCBpcyBub3Qgc3VwcG9ydGVkLlxuXHRcdGNvbnN0IHBhZGRlZCA9IG5ldyBVaW50OEFycmF5KG1lc3NhZ2Vfc2l6ZSArIG5fcGFkICsgOCk7XG5cdFx0cGFkZGVkLnNldChuZXcgVWludDhBcnJheShtZXNzYWdlKSwgMCk7XG5cdFx0Y29uc3QgZGF0YV92aWV3ID0gbmV3IERhdGFWaWV3KHBhZGRlZC5idWZmZXIpO1xuXHRcdGRhdGFfdmlldy5zZXRVaW50OChtZXNzYWdlX3NpemUsIDBiMTAwMDAwMDApO1xuXHRcdGRhdGFfdmlldy5zZXRVaW50MzIoXG5cdFx0XHRtZXNzYWdlX3NpemUgKyBuX3BhZCxcblx0XHRcdG1zZ19iaXRfc2l6ZV9sZWFzdCxcblx0XHRcdHRydWUgLy8gTGl0dGxlLWVuZGlhblxuXHRcdCk7XG5cdFx0ZGF0YV92aWV3LnNldFVpbnQzMihcblx0XHRcdG1lc3NhZ2Vfc2l6ZSArIG5fcGFkICsgNCxcblx0XHRcdG1zZ19iaXRfc2l6ZV9tb3N0LFxuXHRcdFx0dHJ1ZSAvLyBMaXR0bGUtZW5kaWFuXG5cdFx0KTtcblxuXHRcdHJldHVybiBwYWRkZWQuYnVmZmVyO1xuXHR9XG5cblx0c3RhdGljIGYoaiwgeCwgeSwgeilcblx0e1xuXHRcdGlmKDAgPD0gaiAmJiBqIDw9IDE1KVxuXHRcdHsgLy8gRXhjbHVzaXZlLU9SXG5cdFx0XHRyZXR1cm4geCBeIHkgXiB6O1xuXHRcdH1cblx0XHRpZigxNiA8PSBqICYmIGogPD0gMzEpXG5cdFx0eyAvLyBNdWx0aXBsZXhpbmcgKG11eGluZylcblx0XHRcdHJldHVybiAoeCAmIHkpIHwgKH54ICYgeik7XG5cdFx0fVxuXHRcdGlmKDMyIDw9IGogJiYgaiA8PSA0Nylcblx0XHR7XG5cdFx0XHRyZXR1cm4gKHggfCB+eSkgXiB6O1xuXHRcdH1cblx0XHRpZig0OCA8PSBqICYmIGogPD0gNjMpXG5cdFx0eyAvLyBNdWx0aXBsZXhpbmcgKG11eGluZylcblx0XHRcdHJldHVybiAoeCAmIHopIHwgKHkgJiB+eik7XG5cdFx0fVxuXHRcdGlmKDY0IDw9IGogJiYgaiA8PSA3OSlcblx0XHR7XG5cdFx0XHRyZXR1cm4geCBeICh5IHwgfnopO1xuXHRcdH1cblx0fVxuXHRzdGF0aWMgSyhqKVxuXHR7XG5cdFx0aWYoMCA8PSBqICYmIGogPD0gMTUpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIDB4MDAwMDAwMDA7XG5cdFx0fVxuXHRcdGlmKDE2IDw9IGogJiYgaiA8PSAzMSlcblx0XHR7XG5cdFx0XHQvLyBNYXRoLmZsb29yKCgyICoqIDMwKSAqIE1hdGguU1FSVDIpXG5cdFx0XHRyZXR1cm4gMHg1QTgyNzk5OTtcblx0XHR9XG5cdFx0aWYoMzIgPD0gaiAmJiBqIDw9IDQ3KVxuXHRcdHtcblx0XHRcdC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5zcXJ0KDMpKVxuXHRcdFx0cmV0dXJuIDB4NkVEOUVCQTE7XG5cdFx0fVxuXHRcdGlmKDQ4IDw9IGogJiYgaiA8PSA2Mylcblx0XHR7XG5cdFx0XHQvLyBNYXRoLmZsb29yKCgyICoqIDMwKSAqIE1hdGguc3FydCg1KSlcblx0XHRcdHJldHVybiAweDhGMUJCQ0RDO1xuXHRcdH1cblx0XHRpZig2NCA8PSBqICYmIGogPD0gNzkpXG5cdFx0e1xuXHRcdFx0Ly8gTWF0aC5mbG9vcigoMiAqKiAzMCkgKiBNYXRoLnNxcnQoNykpXG5cdFx0XHRyZXR1cm4gMHhBOTUzRkQ0RTtcblx0XHR9XG5cdH1cblx0c3RhdGljIEtQKGopIC8vIEsnXG5cdHtcblx0XHRpZigwIDw9IGogJiYgaiA8PSAxNSlcblx0XHR7XG5cdFx0XHQvLyBNYXRoLmZsb29yKCgyICoqIDMwKSAqIE1hdGguY2JydCgyKSlcblx0XHRcdHJldHVybiAweDUwQTI4QkU2O1xuXHRcdH1cblx0XHRpZigxNiA8PSBqICYmIGogPD0gMzEpXG5cdFx0e1xuXHRcdFx0Ly8gTWF0aC5mbG9vcigoMiAqKiAzMCkgKiBNYXRoLmNicnQoMykpXG5cdFx0XHRyZXR1cm4gMHg1QzRERDEyNDtcblx0XHR9XG5cdFx0aWYoMzIgPD0gaiAmJiBqIDw9IDQ3KVxuXHRcdHtcblx0XHRcdC8vIE1hdGguZmxvb3IoKDIgKiogMzApICogTWF0aC5jYnJ0KDUpKVxuXHRcdFx0cmV0dXJuIDB4NkQ3MDNFRjM7XG5cdFx0fVxuXHRcdGlmKDQ4IDw9IGogJiYgaiA8PSA2Mylcblx0XHR7XG5cdFx0XHQvLyBNYXRoLmZsb29yKCgyICoqIDMwKSAqIE1hdGguY2JydCg3KSlcblx0XHRcdHJldHVybiAweDdBNkQ3NkU5O1xuXHRcdH1cblx0XHRpZig2NCA8PSBqICYmIGogPD0gNzkpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIDB4MDAwMDAwMDA7XG5cdFx0fVxuXHR9XG5cdHN0YXRpYyBhZGRfbW9kdWxvMzIoLyogLi4uLi4uICovKVxuXHR7XG5cdFx0Ly8gMS4gIE1vZHVsbyBhZGRpdGlvbiAoYWRkaXRpb24gbW9kdWxvKSBpcyBhc3NvY2lhdGl2ZS5cblx0XHQvLyAgICBodHRwczovL3Byb29md2lraS5vcmcvd2lraS9Nb2R1bG9fQWRkaXRpb25faXNfQXNzb2NpYXRpdmVcbiBcdFx0Ly8gMi4gIEJpdHdpc2Ugb3BlcmF0aW9uIGluIEphdmFzY3JpcHRcblx0XHQvLyAgICBpcyBkb25lIG9uIDMyLWJpdHMgb3BlcmFuZHNcblx0XHQvLyAgICBhbmQgcmVzdWx0cyBpbiBhIDMyLWJpdHMgdmFsdWUuXG5cdFx0cmV0dXJuIEFycmF5XG5cdFx0XHQuZnJvbShhcmd1bWVudHMpXG5cdFx0XHQucmVkdWNlKChhLCBiKSA9PiAoYSArIGIpLCAwKSB8IDA7XG5cdH1cblx0c3RhdGljIHJvbDMyKHZhbHVlLCBjb3VudClcblx0eyAvLyBDeWNsaWMgbGVmdCBzaGlmdCAocm90YXRlKSBvbiAzMi1iaXRzIHZhbHVlLlxuXHRcdHJldHVybiAodmFsdWUgPDwgY291bnQpIHwgKHZhbHVlID4+PiAoMzIgLSBjb3VudCkpO1xuXHR9XG5cdHN0YXRpYyBoYXNoKG1lc3NhZ2UgLyogQW4gQXJyYXlCdWZmZXIuICovKVxuXHR7XG5cdFx0Ly8vLy8vLy8vLyAgICAgICBQYWRkaW5nICAgICAgIC8vLy8vLy8vLy9cblxuXHRcdC8vIFRoZSBwYWRkZWQgbWVzc2FnZS5cblx0XHRjb25zdCBwYWRkZWQgPSBSSVBFTUQxNjAucGFkKG1lc3NhZ2UpO1xuXG5cdFx0Ly8vLy8vLy8vLyAgICAgQ29tcHJlc3Npb24gICAgIC8vLy8vLy8vLy9cblxuXHRcdC8vIE1lc3NhZ2Ugd29yZCBzZWxlY3RvcnMuXG5cdFx0Y29uc3QgciA9IFtcblx0XHRcdDAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsXG5cdFx0XHQ3LCA0LCAxMywgMSwgMTAsIDYsIDE1LCAzLCAxMiwgMCwgOSwgNSwgMiwgMTQsIDExLCA4LFxuXHRcdFx0MywgMTAsIDE0LCA0LCA5LCAxNSwgOCwgMSwgMiwgNywgMCwgNiwgMTMsIDExLCA1LCAxMixcblx0XHRcdDEsIDksIDExLCAxMCwgMCwgOCwgMTIsIDQsIDEzLCAzLCA3LCAxNSwgMTQsIDUsIDYsIDIsXG5cdFx0XHQ0LCAwLCA1LCA5LCA3LCAxMiwgMiwgMTAsIDE0LCAxLCAzLCA4LCAxMSwgNiwgMTUsIDEzXG5cdFx0XTtcblx0XHRjb25zdCByUCA9IFsgLy8gcidcblx0XHRcdDUsIDE0LCA3LCAwLCA5LCAyLCAxMSwgNCwgMTMsIDYsIDE1LCA4LCAxLCAxMCwgMywgMTIsXG5cdFx0XHQ2LCAxMSwgMywgNywgMCwgMTMsIDUsIDEwLCAxNCwgMTUsIDgsIDEyLCA0LCA5LCAxLCAyLFxuXHRcdFx0MTUsIDUsIDEsIDMsIDcsIDE0LCA2LCA5LCAxMSwgOCwgMTIsIDIsIDEwLCAwLCA0LCAxMyxcblx0XHRcdDgsIDYsIDQsIDEsIDMsIDExLCAxNSwgMCwgNSwgMTIsIDIsIDEzLCA5LCA3LCAxMCwgMTQsXG5cdFx0XHQxMiwgMTUsIDEwLCA0LCAxLCA1LCA4LCA3LCA2LCAyLCAxMywgMTQsIDAsIDMsIDksIDExXG5cdFx0XTtcblxuXHRcdC8vIEFtb3VudHMgZm9yICdyb3RhdGUgbGVmdCcgb3BlcmF0aW9uLlxuXHRcdGNvbnN0IHMgPSBbXG5cdFx0XHQxMSwgMTQsIDE1LCAxMiwgNSwgOCwgNywgOSwgMTEsIDEzLCAxNCwgMTUsIDYsIDcsIDksIDgsXG5cdFx0XHQ3LCA2LCA4LCAxMywgMTEsIDksIDcsIDE1LCA3LCAxMiwgMTUsIDksIDExLCA3LCAxMywgMTIsXG5cdFx0XHQxMSwgMTMsIDYsIDcsIDE0LCA5LCAxMywgMTUsIDE0LCA4LCAxMywgNiwgNSwgMTIsIDcsIDUsXG5cdFx0XHQxMSwgMTIsIDE0LCAxNSwgMTQsIDE1LCA5LCA4LCA5LCAxNCwgNSwgNiwgOCwgNiwgNSwgMTIsXG5cdFx0XHQ5LCAxNSwgNSwgMTEsIDYsIDgsIDEzLCAxMiwgNSwgMTIsIDEzLCAxNCwgMTEsIDgsIDUsIDZcblx0XHRdO1xuXHRcdGNvbnN0IHNQID0gWyAvLyBzJ1xuXHRcdFx0OCwgOSwgOSwgMTEsIDEzLCAxNSwgMTUsIDUsIDcsIDcsIDgsIDExLCAxNCwgMTQsIDEyLCA2LFxuXHRcdFx0OSwgMTMsIDE1LCA3LCAxMiwgOCwgOSwgMTEsIDcsIDcsIDEyLCA3LCA2LCAxNSwgMTMsIDExLFxuXHRcdFx0OSwgNywgMTUsIDExLCA4LCA2LCA2LCAxNCwgMTIsIDEzLCA1LCAxNCwgMTMsIDEzLCA3LCA1LFxuXHRcdFx0MTUsIDUsIDgsIDExLCAxNCwgMTQsIDYsIDE0LCA2LCA5LCAxMiwgOSwgMTIsIDUsIDE1LCA4LFxuXHRcdFx0OCwgNSwgMTIsIDksIDEyLCA1LCAxNCwgNiwgOCwgMTMsIDYsIDUsIDE1LCAxMywgMTEsIDExXG5cdFx0XTtcblxuXHRcdC8vIFRoZSBzaXplLCBpbiBieXRlcywgb2YgYSB3b3JkLlxuXHRcdGNvbnN0IHdvcmRfc2l6ZSA9IDQ7XG5cblx0XHQvLyBUaGUgc2l6ZSwgaW4gYnl0ZXMsIG9mIGEgMTYtd29yZHMgYmxvY2suXG5cdFx0Y29uc3QgYmxvY2tfc2l6ZSA9IDY0O1xuXG5cdFx0Ly8gVGhlIG51bWJlciBvZiB0aGUgMTYtd29yZHMgYmxvY2tzLlxuXHRcdGNvbnN0IHQgPSBwYWRkZWQuYnl0ZUxlbmd0aCAvIGJsb2NrX3NpemU7XG5cblx0XHQvLyAgVGhlIG1lc3NhZ2UgYWZ0ZXIgcGFkZGluZyBjb25zaXN0cyBvZiB0IDE2LXdvcmQgYmxvY2tzIHRoYXRcblx0XHQvLyBhcmUgZGVub3RlZCB3aXRoIFhfaVtqXSwgd2l0aCAw4omkaeKJpCh0IOKIkiAxKSBhbmQgMOKJpGriiaQxNS5cblx0XHRjb25zdCBYID0gKG5ldyBBcnJheSh0KSlcblx0XHRcdC5maWxsKHVuZGVmaW5lZClcblx0XHRcdC5tYXAoKF8sIGkpID0+IG5ldyBQcm94eShcblx0XHRcdFx0bmV3IERhdGFWaWV3KFxuXHRcdFx0XHRcdHBhZGRlZCwgaSAqIGJsb2NrX3NpemUsIGJsb2NrX3NpemVcblx0XHRcdFx0KSwge1xuXHRcdFx0XHRnZXQoYmxvY2tfdmlldywgailcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBibG9ja192aWV3LmdldFVpbnQzMihcblx0XHRcdFx0XHRcdGogKiB3b3JkX3NpemUsXG5cdFx0XHRcdFx0XHR0cnVlIC8vIExpdHRsZS1lbmRpYW5cblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KSk7XG5cblx0XHQvLyAgVGhlIHJlc3VsdCBvZiBSSVBFTUQtMTYwIGlzIGNvbnRhaW5lZCBpbiBmaXZlIDMyLWJpdCB3b3Jkcyxcblx0XHQvLyB3aGljaCBmb3JtIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgYWxnb3JpdGhtLiBUaGUgZmluYWxcblx0XHQvLyBjb250ZW50IG9mIHRoZXNlIGZpdmUgMzItYml0IHdvcmRzIGlzIGNvbnZlcnRlZCB0byBhIDE2MC1iaXRcblx0XHQvLyBzdHJpbmcsIGFnYWluIHVzaW5nIHRoZSBsaXR0bGUtZW5kaWFuIGNvbnZlbnRpb24uXG5cdFx0bGV0IGggPSBbXG5cdFx0XHQweDY3NDUyMzAxLCAvLyBoXzBcblx0XHRcdDB4RUZDREFCODksIC8vIGhfMVxuXHRcdFx0MHg5OEJBRENGRSwgLy8gaF8yXG5cdFx0XHQweDEwMzI1NDc2LCAvLyBoXzNcblx0XHRcdDB4QzNEMkUxRjAgIC8vIGhfNFxuXHRcdF07XG5cblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdDsgKytpKVxuXHRcdHtcblx0XHRcdGxldCBBID0gaFswXSwgQiA9IGhbMV0sIEMgPSBoWzJdLCBEID0gaFszXSwgRSA9IGhbNF07XG5cdFx0XHRsZXQgQVAgPSBBLCBCUCA9IEIsIENQID0gQywgRFAgPSBELCBFUCA9IEU7XG5cdFx0XHRmb3IobGV0IGogPSAwOyBqIDwgODA7ICsrailcblx0XHRcdHtcblx0XHRcdFx0Ly8gTGVmdCByb3VuZHNcblx0XHRcdFx0bGV0IFQgPSBSSVBFTUQxNjAuYWRkX21vZHVsbzMyKFxuXHRcdFx0XHRcdFJJUEVNRDE2MC5yb2wzMihcblx0XHRcdFx0XHRcdFJJUEVNRDE2MC5hZGRfbW9kdWxvMzIoXG5cdFx0XHRcdFx0XHRcdEEsXG5cdFx0XHRcdFx0XHRcdFJJUEVNRDE2MC5mKGosIEIsIEMsIEQpLFxuXHRcdFx0XHRcdFx0XHRYW2ldW3Jbal1dLFxuXHRcdFx0XHRcdFx0XHRSSVBFTUQxNjAuSyhqKVxuXHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdHNbal1cblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdEVcblx0XHRcdFx0KTtcblx0XHRcdFx0QSA9IEU7XG5cdFx0XHRcdEUgPSBEO1xuXHRcdFx0XHREID0gUklQRU1EMTYwLnJvbDMyKEMsIDEwKTtcblx0XHRcdFx0QyA9IEI7XG5cdFx0XHRcdEIgPSBUO1xuXG5cdFx0XHRcdC8vIFJpZ2h0IHJvdW5kc1xuXHRcdFx0XHRUID0gUklQRU1EMTYwLmFkZF9tb2R1bG8zMihcblx0XHRcdFx0XHRSSVBFTUQxNjAucm9sMzIoXG5cdFx0XHRcdFx0XHRSSVBFTUQxNjAuYWRkX21vZHVsbzMyKFxuXHRcdFx0XHRcdFx0XHRBUCxcblx0XHRcdFx0XHRcdFx0UklQRU1EMTYwLmYoXG5cdFx0XHRcdFx0XHRcdFx0NzkgLSBqLFxuXHRcdFx0XHRcdFx0XHRcdEJQLFxuXHRcdFx0XHRcdFx0XHRcdENQLFxuXHRcdFx0XHRcdFx0XHRcdERQXG5cdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFhbaV1bclBbal1dLFxuXHRcdFx0XHRcdFx0XHRSSVBFTUQxNjAuS1Aoailcblx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRzUFtqXVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0RVBcblx0XHRcdFx0KTtcblx0XHRcdFx0QVAgPSBFUDtcblx0XHRcdFx0RVAgPSBEUDtcblx0XHRcdFx0RFAgPSBSSVBFTUQxNjAucm9sMzIoQ1AsIDEwKTtcblx0XHRcdFx0Q1AgPSBCUDtcblx0XHRcdFx0QlAgPSBUO1xuXHRcdFx0fVxuXHRcdFx0bGV0IFQgPSBSSVBFTUQxNjAuYWRkX21vZHVsbzMyKGhbMV0sIEMsIERQKTtcblx0XHRcdGhbMV0gPSBSSVBFTUQxNjAuYWRkX21vZHVsbzMyKGhbMl0sIEQsIEVQKTtcblx0XHRcdGhbMl0gPSBSSVBFTUQxNjAuYWRkX21vZHVsbzMyKGhbM10sIEUsIEFQKTtcblx0XHRcdGhbM10gPSBSSVBFTUQxNjAuYWRkX21vZHVsbzMyKGhbNF0sIEEsIEJQKTtcblx0XHRcdGhbNF0gPSBSSVBFTUQxNjAuYWRkX21vZHVsbzMyKGhbMF0sIEIsIENQKTtcblx0XHRcdGhbMF0gPSBUO1xuXHRcdH1cblxuXHRcdC8vICBUaGUgZmluYWwgb3V0cHV0IHN0cmluZyB0aGVuIGNvbnNpc3RzIG9mIHRoZSBjb25jYXRlbmF0YXRpb25cblx0XHQvLyBvZiBoXzAsIGhfMSwgaF8yLCBoXzMsIGFuZCBoXzQgYWZ0ZXIgY29udmVydGluZyBlYWNoIGhfaSB0byBhXG5cdFx0Ly8gNC1ieXRlIHN0cmluZyB1c2luZyB0aGUgbGl0dGxlLWVuZGlhbiBjb252ZW50aW9uLlxuXHRcdGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheUJ1ZmZlcigyMCk7XG5cdFx0Y29uc3QgZGF0YV92aWV3ID0gbmV3IERhdGFWaWV3KHJlc3VsdCk7XG5cdFx0aC5mb3JFYWNoKChoX2ksIGkpID0+IGRhdGFfdmlldy5zZXRVaW50MzIoaSAqIDQsIGhfaSwgdHJ1ZSkpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFJJUEVNRDE2MFxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==