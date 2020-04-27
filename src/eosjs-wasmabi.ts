import * as ser from './eosjs-serialize';

export class WasmAbiProvider implements WasmAbiProvider {
    /** WASM Abis */
    public wasmAbis = new Map<string, WasmAbi>();

    /** Initialize/Reset and retrieve a wasmAbi object based on account name */
    public async getWasmAbi(accountName: string): Promise<WasmAbi> {
        const wasmAbi = this.wasmAbis.get(accountName);
        if (!wasmAbi) {
            throw new Error(`Missing wasm abi for ${accountName}, set with setWasmAbis()`)
        }
        if (!wasmAbi.inst || wasmAbi.inst.exports.memory.buffer.length > wasmAbi.memoryThreshold) {
            await wasmAbi.reset()
        }
        return wasmAbi;
    }

    /** Set an array of wasmAbi objects, existing entries overwritten */
    public setWasmAbis(wasmAbis: WasmAbi[]) {
        wasmAbis.forEach(wasmAbi => this.wasmAbis.set(wasmAbi.account, wasmAbi))
    }
}

export class WasmAbi {
    account: string;
    module: WebAssembly.Module;
    textEncoder: any;
    textDecoder: any;
    memoryThreshold: number;
    print: (s: string) => void;

    inputData: Uint8Array;
    outputData0: Uint8Array;
    outputData1: Uint8Array;
    inst: any;
    primitives: any;
    actions: any;

    constructor({ account, module, textEncoder, textDecoder, memoryThreshold, print }: { account: string, module: WebAssembly.Module, textEncoder: any, textDecoder: any, memoryThreshold: number, print?: (s: string) => void }) {
        this.module = module;
        this.textEncoder = textEncoder;
        this.textDecoder = textDecoder;
        this.account = account;
        this.memoryThreshold = memoryThreshold
        this.print = print;
        this.inputData = new Uint8Array(0);

        const self = this;
        this.primitives = {
            abort() {
                throw new Error('called abort');
            },
            eosio_assert_message(test: number, begin: number, len: number) {
                if (!test) {
                    let e;
                    try {
                        e = new Error('assert failed with message: ' + textDecoder.decode(new Uint8Array(self.inst.exports.memory.buffer, begin, len)));
                    }
                    catch (x) {
                        e = new Error('assert failed');
                    }
                    throw e;
                }
            },
            eosio_assert_code(test: number, error_code: number) {
                if (!test)
                    throw new Error('assert failed with code: ' + error_code);
            },
            prints_l(begin: number, len: number) {
                if (len && self.print)
                    self.print(textDecoder.decode(new Uint8Array(self.inst.exports.memory.buffer, begin, len)));
            },
            get_input_data(ptr: number, size: number) {
                const input_data = self.inputData;
                if (!size)
                    return input_data.length;
                const copy_size = Math.min(input_data.length, size);
                const dest = new Uint8Array(self.inst.exports.memory.buffer, ptr, copy_size);
                for (let i = 0; i < copy_size; ++i)
                    dest[i] = input_data[i];
                return copy_size;
            },
            set_output_data(ptr: number, size: number) {
                self.outputData1 = self.outputData0;
                self.outputData0 = Uint8Array.from(new Uint8Array(self.inst.exports.memory.buffer, ptr, size));
            },
        };
    }

    action_to_bin(action: string, ...args: any[]) {
        this.inputData = this.textEncoder.encode(JSON.stringify([action, [...args]]));
        this.inst.exports.action_to_bin();
        const buf = new ser.SerialBuffer({ textDecoder: this.textDecoder, textEncoder: this.textEncoder, array: this.outputData1 });
        return { bin: this.outputData0, shortName: buf.getName() };
    }

    /**
     * Support for global in node.js envs & window for browser based envs
     */
    getWindowOrGlobal() {
        const windowOrGlobal = (typeof self === 'object' && self.self === self && self) ||
            (typeof global === 'object' && global.global === global && global)

        return windowOrGlobal
    }

    /**
     * User must call this before first use. If this object is long-lived, then user should call this
     * periodically to garbage collect wasm memory
     **/
    async reset() {
        this.inst = await (this.getWindowOrGlobal() as any).WebAssembly.instantiate(this.module, { env: this.primitives });
        this.inst.exports.initialize();
        if (!this.actions) {
            this.inst.exports.get_actions();
            this.actions = {};
            const actions = JSON.parse(this.textDecoder.decode(this.outputData0)) as string[];
            for (let actionName of actions) {
                this.actions[actionName] = (authorization: ser.Authorization, ...args: any[]) => {
                    const { bin, shortName } = this.action_to_bin(actionName, ...args);
                    return {
                        account: this.account,
                        name: shortName,
                        authorization,
                        data: bin,
                    };
                };
            }
        }
    }
}
