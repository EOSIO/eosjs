import { Api } from './eosjs-api';
import { TransactConfig } from './eosjs-api-interfaces';
import * as ser from './eosjs-serialize';

interface ContextFreeIndexes {
    cfd: number;
    cfa: number;
}

interface ContextFreeGroup {
    action?: Promise<any>;
    contextFreeAction?: Promise<any>;
    contextFreeData?: any;
}

export class Api2 {
    private api: Api;
    private accountName: string;
    public actions: Array<Promise<any>>;
    public contextFreeGroups: Array<() => object>;
    constructor(args: {
        api: Api
    }) {
        this.api = args.api;
    }

    public addActions(actions: Array<Promise<any>>) {
        this.actions = [...this.actions, ...actions];
        return this;
    }

    public associateContextFree(contextFreeGroups: Array<() => object>) {
        this.contextFreeGroups = [...this.contextFreeGroups, ...contextFreeGroups];
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
            })
                .catch(() => {
                    throw new Error(`ABI could not be found: ${this.accountName}`);
                });
        }
    }

    public async send(config?: TransactConfig) {
        let contextFreeDataSet: any[] = [];
        let contextFreeActions: any[] = [];
        let actions = await Promise.all(this.actions.map(async (action) => await action));
        await Promise.all(this.contextFreeGroups.map(
            async (contextFreeCallback: (indexes: ContextFreeIndexes) => ContextFreeGroup) => {
                const { action, contextFreeAction, contextFreeData } = contextFreeCallback({
                    cfd: contextFreeDataSet.length,
                    cfa: contextFreeActions.length
                });
                if (action) {
                    actions = [...actions, await action];
                }
                if (contextFreeAction) {
                    contextFreeActions = [...contextFreeActions, await contextFreeAction];
                }
                if (contextFreeData) {
                    contextFreeDataSet = [...contextFreeDataSet, contextFreeData];
                }
            }
        ));
        try {
            const transaction = await this.api.transact({contextFreeDataSet, contextFreeActions, actions}, config);
            this.contextFreeGroups = [];
            this.actions = [];
            return transaction;
        } catch {
            throw new Error('Unable to construct and send transaction');
        }
    }
}
