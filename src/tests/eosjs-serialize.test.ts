const { TextEncoder, TextDecoder } = require('util');
import { ec } from 'elliptic';

import { createInitialTypes, Type, SerialBuffer } from '../eosjs-serialize';

describe('Serialize', () => {
    let types: Map<string, Type>;

    beforeAll(() => {
        types = createInitialTypes();
    });

    it('should be able to createInitialTypes', () => {
        expect(types).toBeTruthy();
    });

    describe('pushAsset', () => {
        let serialBuffer: SerialBuffer;
        const genericValidSymbolCharacter = 'A';
        const invalidSymbolErrorMessage = 'Expected symbol to be A-Z and between one and seven characters';

        beforeEach(() => {
            serialBuffer = new SerialBuffer({
                textEncoder: new TextEncoder(),
                textDecoder: new TextDecoder()
            });
        });

        const expectSuccessForICharactersSymbol = (i: number) => {
            const symbol = genericValidSymbolCharacter.repeat(i);
            const asset = `10.000 ${symbol}`;

            serialBuffer.pushAsset(asset);

            expect(serialBuffer.length).not.toBe(0);
        };

        const expectExceptionThrown = (asset: string) => {
            let exceptionCaught = false;

            try {
                serialBuffer.pushAsset(asset);
            } catch (e) {
                expect(e.message).toBe(invalidSymbolErrorMessage);
                exceptionCaught = true;
            }

            expect(exceptionCaught).toBeTruthy();
        };

        for (let i = 1; i <= 7; i++) {
            it(`should be able to push asset with valid symbol of ${i} character(s)`, () => {
                expectSuccessForICharactersSymbol(i);
            });
        }

        it('should be able to push asset with valid EOS symbol "10.000 EOS"', () => {
            const asset = '10.000 EOS';

            serialBuffer.pushAsset(asset);

            expect(serialBuffer.length).not.toBe(0);
        });

        it('should not be able to push no symbol "10.000 "', () => {
            const asset = '10.000 ';

            expectExceptionThrown(asset);
        });

        it('should not be able to push symbol with 8 or more characters "10.000 AAAAAAAA"', () => {
            const asset = '10.000 AAAAAAAA';

            expectExceptionThrown(asset);
        });

        it('should not be able to push invalid lowercase symbol "10.000 eos"', () => {
            const asset = '10.000 eos';

            expectExceptionThrown(asset);
        });

        it('should not be able to push two symbols "10.000 EOS blah"', () => {
            const asset = '10.000 EOS blah';

            expectExceptionThrown(asset);
        });
    });

    describe('name', () => {
        let serialBuffer: SerialBuffer;
        const invalidNameErrorMessage = 'Name should be less than 13 characters, or less than 14 if last character is between 1-5 or a-j, and only contain the following symbols .12345abcdefghijklmnopqrstuvwxyz';

        beforeEach(() => {
            serialBuffer = new SerialBuffer({
                textEncoder: new TextEncoder(),
                textDecoder: new TextDecoder()
            });
        });

        it('should be able to push name with a valid account name', () => {
            const name = '.12345abcdefg';

            serialBuffer.pushName(name);

            expect(serialBuffer.getName()).toEqual(name);
        });

        it('should remove the `.` character from the end of the account name', () => {
            const name = 'abcd......';
            const expectedName = 'abcd';

            serialBuffer.pushName(name);
            expect(serialBuffer.getName()).toEqual(expectedName);
        });

        it('should not be able to push name with an account name too short', () => {
            const name = '';

            const shouldFail = () => serialBuffer.pushName(name);
            expect(shouldFail).toThrowError(invalidNameErrorMessage);
        });

        it('should not be able to push name with an account name too long', () => {
            const name = 'abcdabcdabcdab';

            const shouldFail = () => serialBuffer.pushName(name);
            expect(shouldFail).toThrowError(invalidNameErrorMessage);
        });

        it('should not be able to push name with an account name with invalid characters', () => {
            const name = '6789$/,';

            const shouldFail = () => serialBuffer.pushName(name);
            expect(shouldFail).toThrowError(invalidNameErrorMessage);
        });
    });

    describe('bool', () => {
        let boolType: Type;
        let mockedBuffer: SerialBuffer;

        const shouldThrowErrorForValue = (value: any) => {
            try {
                boolType.serialize(mockedBuffer, value);
            } catch (e) {
                expect(e.message).toBe('Expected boolean or number equal to 1 or 0');
            }
        };

        const shouldNotThrowErrorForValue = (value: any) => {
            expect(() => {
                boolType.serialize(mockedBuffer, value);
            }).not.toThrow();
        };

        beforeAll(() => {
            boolType = types.get('bool');
            mockedBuffer = Object.create(SerialBuffer);
            mockedBuffer.push = jest.fn().mockImplementation((value) => {
                return;
            });
        });

        it('should be able to create bool type', () => {
            expect(boolType).toBeTruthy();
        });

        it('should throw error when calling serialize when type is not boolean or number', () => {
            const dataValue = 'string';

            shouldThrowErrorForValue(dataValue);
        });

        it('should throw error when calling serialize when number that is not 1 or 0', () => {
            const dataValue = 10;

            shouldThrowErrorForValue(dataValue);
        });

        it('should not throw error when calling serialize with false', () => {
            const dataValue = false;

            shouldNotThrowErrorForValue(dataValue);
        });

        it('should not throw error when calling serialize with true', () => {
            const dataValue = true;

            shouldNotThrowErrorForValue(dataValue);
        });

        it('should not throw error when calling serialize with 0', () => {
            const dataValue = 0;

            shouldNotThrowErrorForValue(dataValue);
        });

        it('should not throw error when calling serialize with 1', () => {
            const dataValue = 1;

            shouldNotThrowErrorForValue(dataValue);
        });
    });
});
