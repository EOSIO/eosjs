import * as ser from './eosjs-serialize';

export class WasmAbiProvider implements WasmAbiProvider {
    /** WASM Abis */
    public wasmAbis = new Map<string, WasmAbi>();

    /** Set an array of wasmAbi objects, existing entries overwritten */
    public async setWasmAbis(wasmAbis: WasmAbi[]) {
        await Promise.all(wasmAbis.map(async (wasmAbi) => {
            await wasmAbi.reset();
            this.wasmAbis.set(wasmAbi.account, wasmAbi);
        }));
    }
}

interface WasmAbiOptions {
    account: string;
    mod: any;
    textEncoder: any;
    textDecoder: any;
    memoryThreshold: number;
    print?: (s: string) => void;
}

export class WasmAbi { // tslint:disable-line max-classes-per-file
    public account: string;
    public mod: any;
    public textEncoder: any;
    public textDecoder: any;
    public memoryThreshold: number;
    public print: (s: string) => void;

    public inputData: Uint8Array;
    public outputData0: Uint8Array;
    public outputData1: Uint8Array;
    public inst: any;
    public primitives: any;
    public actions: any;

    constructor({ account, mod, textEncoder, textDecoder, memoryThreshold, print }: WasmAbiOptions) {
        this.mod = mod;
        this.textEncoder = textEncoder;
        this.textDecoder = textDecoder;
        this.account = account;
        this.memoryThreshold = memoryThreshold;
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
                        e = new Error(
                            'assert failed with message: ' +
                            textDecoder.decode(new Uint8Array(self.inst.exports.memory.buffer, begin, len))
                        );
                    } catch (x) {
                        e = new Error('assert failed');
                    }
                    throw e;
                }
            },
            eosio_assert_code(test: number, error_code: number) { // tslint:disable-line variable-name
                if (!test) {
                    throw new Error('assert failed with code: ' + error_code);
                }
            },
            prints_l(begin: number, len: number) {
                if (len && self.print) {
                    self.print(textDecoder.decode(new Uint8Array(self.inst.exports.memory.buffer, begin, len)));
                }
            },
            get_input_data(ptr: number, size: number) {
                const input_data = self.inputData; // tslint:disable-line variable-name
                if (!size) {
                    return input_data.length;
                }
                const copy_size = Math.min(input_data.length, size); // tslint:disable-line variable-name
                const dest = new Uint8Array(self.inst.exports.memory.buffer, ptr, copy_size);
                for (let i = 0; i < copy_size; ++i) {
                    dest[i] = input_data[i];
                }
                return copy_size;
            },
            set_output_data(ptr: number, size: number) {
                self.outputData1 = self.outputData0;
                self.outputData0 = Uint8Array.from(new Uint8Array(self.inst.exports.memory.buffer, ptr, size));
            },
        };
    }

    public action_args_json_to_bin(action: string, ...args: any[]) {
        this.inputData = this.textEncoder.encode(JSON.stringify([action, [...args]]));
        this.inst.exports.action_args_json_to_bin();
        const buf = new ser.SerialBuffer(
            { textDecoder: this.textDecoder, textEncoder: this.textEncoder, array: this.outputData1 }
        );
        return { bin: this.outputData0, shortName: buf.getName() };
    }

    public action_args_bin_to_json(shortName: string, bin: Uint8Array) {
        const buf = new ser.SerialBuffer({ textDecoder: this.textDecoder, textEncoder: this.textEncoder });
        buf.pushName(shortName);
        buf.pushArray(bin);
        this.inputData = buf.asUint8Array();
        this.inst.exports.action_args_bin_to_json();
        return JSON.parse(this.textDecoder.decode(this.outputData0));
    }

    public action_ret_bin_to_json(shortName: string, bin: Uint8Array) {
        const buf = new ser.SerialBuffer({ textDecoder: this.textDecoder, textEncoder: this.textEncoder });
        buf.pushName(shortName);
        buf.pushArray(bin);
        this.inputData = buf.asUint8Array();
        this.inst.exports.action_ret_bin_to_json();
        return JSON.parse(this.textDecoder.decode(this.outputData0));
    }

    /**
     * User must call this before first use. If this object is long-lived, then user should call this
     * periodically to garbage collect wasm memory
     */
    public async reset() {
        this.inst = await (this.getGlobal() as any).WebAssembly.instantiate(this.mod, { env: this.primitives });
        this.inst.exports.initialize();
        if (!this.actions) {
            this.inst.exports.get_actions();
            this.actions = {};
            const actions = JSON.parse(this.textDecoder.decode(this.outputData0)) as string[];
            for (const actionName of actions) {
                this.actions[actionName] = (authorization: ser.Authorization, ...args: any[]) => {
                    const { bin, shortName } = this.action_args_json_to_bin(actionName, ...args);
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

    /**
     * Support for global in node.js envs & window for browser based envs
     */
    private getGlobal() {
        return (typeof self === 'object' && self.self === self && self) ||
            (typeof global === 'object' && global.global === global && global);
    }
}
