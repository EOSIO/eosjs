const ecc = require('eosjs-ecc');
import { ecc as eccMigration } from '../eosjs-ecc-migration';

import { PrivateKey } from '../eosjs-key-conversions';

describe('ecc Migration', () => {
    const privateKeys = [
        '5Juww5SS6aLWxopXBAWzwqrwadiZKz7XpKAiktXTKcfBGi1DWg8',
        '5JnHjSFwe4r7xyqAUAaVs51G7HmzE86DWGa3VAA5VvQriGYnSUr',
        '5K4XZH5XR2By7Q5KTcZnPAmUMU5yjUNBdoKzzXyrLfmiEZJqoKE',
    ];
    const legacyPublicKeys = [
        'EOS7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhTU9ypi',
        'EOS8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es6aQk2F',
        'EOS7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw3wJEMu',
    ];

    it('verifies `initialize` returns console.error message', () => {
        console.error = jest.fn();
        eccMigration.initialize();
        expect(console.error).toHaveBeenCalledWith('Method deprecated');
    });

    it('verifies `unsafeRandomKey` returns console.error message', () => {
        console.error = jest.fn();
        eccMigration.unsafeRandomKey();
        expect(console.error).toHaveBeenCalledWith('Method deprecated');
    });

    it('verifies `randomKey` calls generateKeyPair', async () => {
        console.warn = jest.fn();
        const privateKey = await eccMigration.randomKey(0, { secureEnv: true });
        expect(console.warn).toHaveBeenCalledWith('Argument `cpuEntropyBits` is deprecated, ' +
            'use the options argument instead');
        expect(typeof privateKey).toEqual('string');
        expect(PrivateKey.fromString(privateKey).isValid()).toBeTruthy();
    });

    it('verifies `seedPrivate` returns console.error message', () => {
        console.error = jest.fn();
        eccMigration.seedPrivate();
        expect(console.error).toHaveBeenCalledWith('Method deprecated');
    });

    it('verifies `privateToPublic` function is consistent between ecc objects', () => {
        console.warn = jest.fn();
        const eccPublicKey = ecc.privateToPublic(privateKeys[0], 'EOS');
        const eccMigrationPublicKey = eccMigration.privateToPublic(privateKeys[0], 'EOS');
        expect(console.warn).toHaveBeenCalledWith('Argument `pubkey_prefix` is deprecated, ' +
            'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        expect(eccPublicKey).toEqual(eccMigrationPublicKey);
    });

    it('verifies `isValidPublic` function is consistent between ecc objects', () => {
        console.warn = jest.fn();
        const eccValid = ecc.isValidPublic(legacyPublicKeys[0], 'EOS');
        const eccMigrationValid = eccMigration.isValidPublic(legacyPublicKeys[0], 'EOS');
        expect(console.warn).toHaveBeenCalledWith('Argument `pubkey_prefix` is deprecated, ' +
            'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        expect(eccValid).toEqual(eccMigrationValid);
        expect(eccValid).toBeTruthy();
        expect(eccMigrationValid).toBeTruthy();
    });

    it('verifies `isValidPublic` function is consistent during an error', () => {
        console.warn = jest.fn();
        const eccValid = ecc.isValidPublic('publickey', 'EOS');
        const eccMigrationValid = eccMigration.isValidPublic('publickey', 'EOS');
        expect(console.warn).toHaveBeenCalledWith('Argument `pubkey_prefix` is deprecated, ' +
            'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        expect(eccValid).toEqual(eccMigrationValid);
        expect(eccValid).toBeFalsy();
        expect(eccMigrationValid).toBeFalsy();
    });

    it('verifies `isValidPrivate` function is consistent between ecc objects', () => {
        const eccValid = ecc.isValidPrivate(privateKeys[0]);
        const eccMigrationValid = eccMigration.isValidPrivate(privateKeys[0]);
        expect(eccValid).toEqual(eccMigrationValid);
        expect(eccValid).toBeTruthy();
        expect(eccMigrationValid).toBeTruthy();
    });

    it('verifies `isValidPrivate` function is consistent during an error', () => {
        const eccValid = ecc.isValidPrivate('privatekey');
        const eccMigrationValid = eccMigration.isValidPrivate('privatekey');
        expect(eccValid).toEqual(eccMigrationValid);
        expect(eccValid).toBeFalsy();
        expect(eccMigrationValid).toBeFalsy();
    });

    it('verifies `sign`, `recover`, and `verify` functions are consistent between ecc objects', () => {
        const dataAsString = 'some string';
        const eccSig = ecc.sign(dataAsString, privateKeys[0], 'utf8');
        const eccMigrationSig = eccMigration.sign(dataAsString, privateKeys[0], 'utf8');

        // signatures are different
        expect(eccSig).not.toEqual(eccMigrationSig);

        const eccKPub = ecc.recover(eccSig, dataAsString, 'utf8');
        const eccMigrationKPub = eccMigration.recover(eccMigrationSig, dataAsString, 'utf8');
        expect(eccKPub).toEqual(eccMigrationKPub);
    });

    it('verifies `signHash`, `recoverHash`, and `sha256` functions are consistent between ecc objects', () => {
        console.warn = jest.fn();
        const dataAsString = 'some string';

        const eccHash = Buffer.from(ecc.sha256(dataAsString), 'hex');
        const eccMigrationHash = Buffer.from(eccMigration.sha256(dataAsString, 'hex', 'utf8') as string, 'hex');
        expect(console.warn).toBeCalledWith('Argument `encoding` is deprecated');
        expect(console.warn).toBeCalledWith('Argument `resultEncoding` is deprecated');
        expect(eccHash).toEqual(eccMigrationHash);

        const eccSig = ecc.signHash(eccHash, privateKeys[0], 'utf8');
        const eccMigrationSig = eccMigration.signHash(eccMigrationHash, privateKeys[0], 'utf8');

        // signatures are different
        expect(eccSig).not.toEqual(eccMigrationSig);

        const eccKPub = ecc.recoverHash(eccSig, eccHash, 'utf8');
        const eccMigrationKPub = eccMigration.recoverHash(eccSig, eccMigrationHash, 'utf8');
        expect(eccKPub).toEqual(eccMigrationKPub);
    });
});
