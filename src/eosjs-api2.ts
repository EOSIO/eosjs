import { Api } from './eosjs-api';
import { TransactConfig } from './eosjs-api-interfaces';
import * as ser from './eosjs-serialize';

export class Api2 {
    private api: Api;
    private accountName: string;
    public actions: Array<Promise<any>>;
    public contextFreeActions: Array<Promise<any>>;
    public contextFreeData: any[];
    constructor(args: {
        api: Api
    }) {
        this.api = args.api;
    }

    public addActions(actions: Array<Promise<any>>) {
        this.actions = [...this.actions, ...actions];
        return this;
    }

    public addContextFreeActions(actions: Array<Promise<any>>) {
        this.contextFreeActions = [...this.contextFreeActions, ...actions];
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

    public as(actorName?: string) {
        const returnObj: { [index: string]: any } = {};
        let authorization: any[] = [];
        if (actorName) {
            authorization = [{ actor: actorName, permission: 'active'}];
        }
        const wasmAbi = this.api.wasmAbiProvider.wasmAbis.get(this.accountName);
        if (wasmAbi) {
            Object.keys(wasmAbi.actions).forEach((action) => {
                returnObj[action] = async (...args: any[]) => {
                    if (wasmAbi.inst.exports.memory.buffer.length > wasmAbi.memoryThreshold) {
                        await wasmAbi.reset();
                    }
                    return wasmAbi.actions[action](authorization, ...args);
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
                            authorization,
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
        const contextFreeData = this.contextFreeData;
        const contextFreeActions = await Promise.all(this.contextFreeActions.map(async (action) => await action));
        const actions = await Promise.all(this.actions.map(async (action) => await action));
        return await this.api.transact({contextFreeData, contextFreeActions, actions}, config);
    }

    private reset() {
        this.contextFreeData = [];
        this.contextFreeActions = [];
        this.actions = [];
    }
}
