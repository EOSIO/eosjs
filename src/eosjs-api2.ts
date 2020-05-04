import { Api } from './eosjs-api';
import { TransactConfig } from './eosjs-api-interfaces';
import * as ser from './eosjs-serialize';

export class Api2 {
    private api: Api;
    private accountName: string;
    public actions: any[];
    public contextFreeActions: any[];
    public contextFreeData: any[];
    constructor(args: {
        api: Api
    }) {
        this.api = args.api;
    }

    public addActions(actions: Array<Promise<any>>) {
        this.actions = [...this.actions, actions];
        return this;
    }

    public addContextFreeActions(actions: Array<Promise<any>>) {
        this.contextFreeActions = [...this.contextFreeActions, actions];
        return this;
    }

    public addContextFreeData(dataSets: any[]) {
        this.contextFreeData = [...this.contextFreeData, dataSets];
        return this;
    }

    public with(accountName: string): Api2 {
        this.accountName = accountName;
        return this;
    }

    public as(actorName: string) {
        const returnObj: { [index: string]: any } = {};
        const wasmAbi = this.api.wasmAbiProvider.wasmAbis.get(this.accountName);
        if (wasmAbi) {
            Object.keys(wasmAbi.actions).forEach((action) => {
                returnObj[action] = async (...args: any[]) => {
                    if (wasmAbi.inst.exports.memory.buffer.length > wasmAbi.memoryThreshold) {
                        await wasmAbi.reset();
                    }
                    return wasmAbi.actions[action]([{ actor: actorName, permission: 'active'}], ...args);
                };
            });
            return returnObj;
        } else {
            this.api.getAbi(this.accountName).then((jsonAbi) => {
                const types = ser.getTypesFromAbi(ser.createInitialTypes(), jsonAbi);
                const actions = new Map<string, ser.Type>();
                for (const { name, type } of jsonAbi.actions) {
                    actions.set(name, ser.getType(types, type));
                }
                actions.forEach((type, name) => {
                    returnObj[name] = async (data: any) => {
                        return ser.serializeAction(
                            { types, actions },
                            this.accountName,
                            name,
                            [{ actor: actorName, permission: 'active'}],
                            data,
                            this.api.textEncoder,
                            this.api.textDecoder
                        );
                    };
                });
            });
        }
    }

    public async send(config?: TransactConfig) {
        return await this.api.transact({
            contextFreeData: this.contextFreeData,
            contextFreeActions: this.contextFreeActions,
            actions: this.actions
        }, config);
    }
}
