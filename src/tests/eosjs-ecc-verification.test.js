// eosjs-ecc stuff
const ecc = require('eosjs-ecc')

const { ec } = require('elliptic');

const { Signature, PrivateKey, PublicKey } = require('../eosjs-key-conversions');
const {
    JsSignatureProvider,
} = require('../eosjs-jssig');
const { KeyType } = require('../eosjs-numeric');
const { SignatureProviderArgs } = require('../eosjs-api-interfaces');

describe('JsSignatureProvider', () => {
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
    const k1FormatPublicKeys = [
        'PUB_K1_7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhYTBFvY',
        'PUB_K1_8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es7e7bRJ',
        'PUB_K1_7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw9RT8v2',
    ];
    const signatures = [
        'SIG_K1_HKkqi3zray76i63ZQwAHWMjoLk3wTa1ajZWPcUnrhgmSWQYEHDJsxkny6VDTWEmVdfktxpGoTA81qe6QuCrDmazeQndmxh',
        'SIG_K1_HCaY9Y9qdjnkRhE9hokAyp3pFtkMmjpxF6xTd514Vo8vLVSWKek5m5aHfCaka9TqZUbajkhhd4BfBLxSwCwZUEmy8cvt1x',
        'SIG_K1_GrZqp9ZkuhBeNpeQ5b2L2UWUUrNU1gHbTyMzkyWRhiXNkxPP84Aq9eziU399eBf9xJw8MqHHjz7R2wMTMXhXjHLgpZYFeA',
    ];
    const eccSignatures = [
        'SIG_K1_KeEyJFpkp63Qq5E1zRD9aNZtTjpStvdkdnL31Z7wVmhYtrKGtpVdMBJnXyEUXNkNEyo4d4i4Q79qmRpCUsCRdFqhV6KAeF',
        'SIG_K1_JvgMmFSDhipS1SeBLNBMdAxayAsWS3GuVGSHS7YQth5Z5ZpijxnZgaa23dYD1efQhpEgtEggdRfHMmp31RDXjmJdZYoKLm',
        'SIG_K1_JwMqV2nbEntHSq9AuG3Zq1JBc5YqD2SftMHCTGK4A8DYGn1VPQ8QAduwCNksT5JhYgAmGMzPyJdZ2Ws4p8TCvQ16LeNhrw',
    ];

    // These are simplified tests simply to verify a refactor didn't mess with existing code

    it('(NOTE: sigs are different): ensure elliptic does what eosjs-ecc used to do', () => {
        const ellipticEc = new ec('secp256k1');
        for (let idx=0; idx<privateKeys.length; idx++) {
            const KPriv = privateKeys[idx];
            const KPrivElliptic = PrivateKey.fromString(KPriv).toElliptic();
            const KPubK1 = new JsSignatureProvider([KPriv]).availableKeys[0];

            const dataAsString = 'some string';

            const eccHashedString = Buffer.from(ecc.sha256(dataAsString), 'hex');
            const ellipticHashedStringAsBuffer = Buffer.from(ellipticEc.hash().update(dataAsString).digest(), 'hex');
            expect(eccHashedString).toEqual(ellipticHashedStringAsBuffer);

            const eccSig = ecc.sign(dataAsString, KPriv);
            const ellipticSig = KPrivElliptic.sign(ellipticHashedStringAsBuffer);

            const eccKPub = ecc.recover(eccSig, dataAsString);
            const ellipticRecoveredKPub = ellipticEc.recoverPubKey(
                ellipticHashedStringAsBuffer,
                ellipticSig,
                ellipticSig.recoveryParam
            );
            const ellipticKPub = ellipticEc.keyFromPublic(ellipticRecoveredKPub);
            expect(PublicKey.fromElliptic(ellipticKPub, KeyType.k1).toString()).toEqual(k1FormatPublicKeys[idx]);

            const eccValid = ecc.verify(eccSig, dataAsString, eccKPub);
            const ellipticValid = ellipticEc.verify(
                ellipticHashedStringAsBuffer,
                ellipticSig,
                ellipticEc.keyFromPublic(ellipticKPub)
            );
            expect(eccValid).toEqual(true);
            expect(ellipticValid).toEqual(true);
        }
    });

    it('ensure elliptic verifies eosjs-ecc\'s Sigs', () => {
        const ellipticEc = new ec('secp256k1');
        for (let idx=0; idx<privateKeys.length; idx++) {
            const KPriv = privateKeys[idx];
            const KPrivElliptic = PrivateKey.fromString(KPriv).toElliptic();
            const KPubK1 = new JsSignatureProvider([KPriv]).availableKeys[0];

            const dataAsString = 'some string';

            const eccHashedString = Buffer.from(ecc.sha256(dataAsString), 'hex');
            const ellipticHashedStringAsBuffer = Buffer.from(ellipticEc.hash().update(dataAsString).digest(), 'hex');
            expect(eccHashedString).toEqual(ellipticHashedStringAsBuffer);

            const eccSig = ecc.sign(dataAsString, KPriv);

            const ellipticSig = Signature.fromString(eccSig).toElliptic();
            const recoveredKPub = ecc.recover(eccSig, dataAsString);
            const ellipticRecoveredKPub = ellipticEc.recoverPubKey(
                ellipticHashedStringAsBuffer,
                ellipticSig,
                ellipticSig.recoveryParam
            );

            const ellipticKPub = ellipticEc.keyFromPublic(ellipticRecoveredKPub);
            expect(PublicKey.fromElliptic(ellipticKPub, KeyType.k1).toString()).toEqual(PublicKey.fromString(recoveredKPub).toString());
            expect(PublicKey.fromElliptic(ellipticKPub, KeyType.k1).toString()).toEqual(k1FormatPublicKeys[idx]);

            const ellipticValid = ellipticEc.verify(
                ellipticHashedStringAsBuffer,
                ellipticSig,
                ellipticEc.keyFromPublic(ellipticKPub)
            );
            expect(ellipticValid).toEqual(true);
        }
    });

    it('ensure ecc verifies elliptic\'s Sigs', () => {
        const ellipticEc = new ec('secp256k1');
        for (let idx=0; idx<privateKeys.length; idx++) {
            const KPriv = privateKeys[idx];
            const KPrivElliptic = PrivateKey.fromString(KPriv).toElliptic();
            const KPubK1 = new JsSignatureProvider([KPriv]).availableKeys[0];

            const dataAsString = 'some string';

            const ellipticHashedStringAsBuffer = Buffer.from(ellipticEc.hash().update(dataAsString).digest(), 'hex');

            const ellipticSig = KPrivElliptic.sign(ellipticHashedStringAsBuffer);
            const ellipticSigAsString = Signature.fromElliptic(ellipticSig, KeyType.k1).toString();

            const recoveredKPub = ecc.recover(ellipticSigAsString, dataAsString);
            const ellipticRecoveredKPub = ellipticEc.recoverPubKey(
                ellipticHashedStringAsBuffer,
                ellipticSig,
                ellipticSig.recoveryParam
            );
            const ellipticKPub = ellipticEc.keyFromPublic(ellipticRecoveredKPub);
            expect(PublicKey.fromElliptic(ellipticKPub, KeyType.k1).toString()).toEqual(k1FormatPublicKeys[idx]);

            const eccValid = ecc.verify(ellipticSigAsString, dataAsString, recoveredKPub);
            expect(eccValid).toEqual(true);
        }
    });
});
