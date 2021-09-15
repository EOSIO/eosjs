import * as hash from 'hash.js';

export { PrivateKey } from './PrivateKey';
export { PublicKey } from './PublicKey';
export { Signature } from './Signature';
export {
    generateKeyPair,
    generateWebCryptoKeyPair,
    CryptoKeyPair,
} from './KeyUtil';

export const sha256 = (data: string|Buffer): number[]|string => {
    return hash.sha256().update(data).digest();
};
