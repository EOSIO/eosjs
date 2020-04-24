import { Authorization } from './eosjs-serialize'

export type WasmAction = { [key: string]: <T>(authorization: Authorization[], actionParams: T) => {} }
