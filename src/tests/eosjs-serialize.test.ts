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
