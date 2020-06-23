// https://gist.githubusercontent.com/wlzla000/bac83df6d3c51916c4dd0bc947e46947/raw/7ee3462b095ab22580ddaf191f44a590da6fe33b/RIPEMD-160.js

/*
	RIPEMD-160.js

		developed
			by K. (https://github.com/wlzla000)
			on December 27-29, 2017,

		licensed under


		the MIT license

		Copyright (c) 2017 K.

		 Permission is hereby granted, free of charge, to any person
		obtaining a copy of this software and associated documentation
		files (the "Software"), to deal in the Software without
		restriction, including without limitation the rights to use,
		copy, modify, merge, publish, distribute, sublicense, and/or
		sell copies of the Software, and to permit persons to whom the
		Software is furnished to do so, subject to the following
		conditions:

		 The above copyright notice and this permission notice shall be
		included in all copies or substantial portions of the Software.

		 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
		EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
		OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
		HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
		WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
		FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
		OTHER DEALINGS IN THE SOFTWARE.
*/
/* eslint-disable */

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RIPEMD160 = function () {
    function RIPEMD160() {
        // https://webcache.googleusercontent.com/search?q=cache:CnLOgolTHYEJ:https://www.cosic.esat.kuleuven.be/publications/article-317.pdf
        // http://shodhganga.inflibnet.ac.in/bitstream/10603/22978/13/13_appendix.pdf

        _classCallCheck(this, RIPEMD160);
    }

    _createClass(RIPEMD160, null, [{
        key: "get_n_pad_bytes",
        value: function get_n_pad_bytes(message_size /* in bytes, 1 byte is 8 bits. */) {
            //  Obtain the number of bytes needed to pad the message.
            // It does not contain the size of the message size information.
            /*
           https://webcache.googleusercontent.com/search?q=cache:CnLOgolTHYEJ:https://www.cosic.esat.kuleuven.be/publications/article-317.pdf
             The Cryptographic Hash Function RIPEMD-160
             written by
             Bart Preneel,
             Hans Dobbertin,
             Antoon Bosselaers
           in
             1997.
             --------------------------------------------------
             §5     Description of RIPEMD-160
             ......
              In order to guarantee that the total input size is a
           multiple of 512 bits, the input is padded in the same
           way as for all the members of the MD4-family: one
           appends a single 1 followed by a string of 0s (the
           number of 0s lies between 0 and 511); the last 64 bits
           of the extended input contain the binary representation
           of the input size in bits, least significant byte first.
         */
            /*
           https://tools.ietf.org/rfc/rfc1186.txt
             RFC 1186: MD4 Message Digest Algorithm.
             written by
             Ronald Linn Rivest
           in
             October 1990.
             --------------------------------------------------
             §3     MD4 Algorithm Description
             ......
             Step 1. Append padding bits
              The message is "padded" (extended) so that its length
           (in bits) is congruent to 448, modulo 512. That is, the
           message is extended so that it is just 64 bits shy of
           being a multiple of 512 bits long. Padding is always
           performed, even if the length of the message is already
           congruent to 448, modulo 512 (in which case 512 bits of
           padding are added).
              Padding is performed as follows: a single "1" bit is
           appended to the message, and then enough zero bits are
           appended so that the length in bits of the padded
           message becomes congruent to 448, modulo 512.
             Step 2. Append length
              A 64-bit representation of b (the length of the message
           before the padding bits were added) is appended to the
           result of the previous step. In the unlikely event that
           b is greater than 2^64, then only the low-order 64 bits
           of b are used. (These bits are appended as two 32-bit
           words and appended low-order word first in accordance
           with the previous conventions.)
              At this point the resulting message (after padding with
           bits and with b) has a length that is an exact multiple
           of 512 bits. Equivalently, this message has a length
           that is an exact multiple of 16 (32-bit) words. Let
           M[0 ... N-1] denote the words of the resulting message,
           where N is a multiple of 16.
         */
            // https://crypto.stackexchange.com/a/32407/54568
            /*
           Example case  # 1
             [0 bit: message.]
             [1 bit: 1.]
             [447 bits: 0.]
             [64 bits: message size information.]
             Example case  # 2
             [512-bits: message]
             [1 bit: 1.]
             [447 bits: 0.]
             [64 bits: message size information.]
             Example case  # 3
             [(512 - 64 = 448) bits: message.]
             [1 bit: 1.]
             [511 bits: 0.]
             [64 bits: message size information.]
             Example case  # 4
             [(512 - 65 = 447) bits: message.]
             [1 bit: 1.]
             [0 bit: 0.]
             [64 bits: message size information.]
         */
            // The number of padding zero bits:
            //      511 - [{(message size in bits) + 64} (mod 512)]
            return 64 - (message_size + 8 & 63 /* 63 */);
        }
    }, {
        key: "pad",
        value: function pad(message /* An ArrayBuffer. */) {
            var message_size = message.byteLength;
            var n_pad = RIPEMD160.get_n_pad_bytes(message_size);

            //  `Number.MAX_SAFE_INTEGER` is ((2 ** 53) - 1) and
            // bitwise operation in Javascript is done on 32-bits operands.
            var divmod = function divmod(dividend, divisor) {
                return [Math.floor(dividend / divisor), dividend % divisor];
            };
            /*
         To shift
           00000000 000????? ???????? ???????? ???????? ???????? ???????? ????????
                                            t o
          00000000 ???????? ???????? ???????? ???????? ???????? ???????? ?????000
         --------------------------------------------------------------------------------
         Method #1
            00000000 000????? ???????? ????????  ???????? ???????? ???????? ????????
          [00000000 000AAAAA AAAAAAAA AAAAAAAA] (<A> captured)
          [00000000 AAAAAAAA AAAAAAAA AAAAA000] (<A> shifted)
                                (<B> captured) [BBBBBBBB BBBBBBBB BBBBBBBB BBBBBBBB]
                            (<B> shifted) [BBB][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
          [00000000 AAAAAAAA AAAAAAAA AAAAABBB] (<A> & <B_2> merged)
          [00000000 AAAAAAAA AAAAAAAA AAAAABBB][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
           00000000 ???????? ???????? ????????  ???????? ???????? ???????? ?????000
           const uint32_max_plus_1 = 0x100000000; // (2 ** 32)
         const [
           msg_byte_size_most, // Value range [0, (2 ** 21) - 1].
           msg_byte_size_least // Value range [0, (2 ** 32) - 1].
         ] = divmod(message_size, uint32_max_plus_1);
         const [
           carry, // Value range [0, 7].
           msg_bit_size_least // Value range [0, (2 ** 32) - 8].
         ] = divmod(message_byte_size_least * 8, uint32_max_plus_1);
         const message_bit_size_most = message_byte_size_most * 8
           + carry; // Value range [0, (2 ** 24) - 1].
         --------------------------------------------------------------------------------
         Method #2
           00000000 000????? ???????? ????????  ???????? ???????? ???????? ????????
             [00000 000AAAAA AAAAAAAA AAAAAAAA  AAA] (<A> captured)
                                (<B> captured) [000BBBBB BBBBBBBB BBBBBBBB BBBBBBBB]
                                 (<B> shifted) [BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
          [00000000 AAAAAAAA AAAAAAAA AAAAAAAA][BBBBBBBB BBBBBBBB BBBBBBBB BBBBB000]
           00000000 ???????? ???????? ????????  ???????? ???????? ???????? ?????000
           */

            var _divmod$map = divmod(message_size, 536870912 /* (2 ** 29) */).map(function (x, index) {
                  return index ? x * 8 : x;
              }),
              _divmod$map2 = _slicedToArray(_divmod$map, 2),
              msg_bit_size_most = _divmod$map2[0],
              msg_bit_size_least = _divmod$map2[1];

            // `ArrayBuffer.transfer()` is not supported.


            var padded = new Uint8Array(message_size + n_pad + 8);
            padded.set(new Uint8Array(message), 0);
            var data_view = new DataView(padded.buffer);
            data_view.setUint8(message_size, 128);
            data_view.setUint32(message_size + n_pad, msg_bit_size_least, true // Little-endian
            );
            data_view.setUint32(message_size + n_pad + 4, msg_bit_size_most, true // Little-endian
            );

            return padded.buffer;
        }
    }, {
        key: "f",
        value: function f(j, x, y, z) {
            if (0 <= j && j <= 15) {
                // Exclusive-OR
                return x ^ y ^ z;
            }
            if (16 <= j && j <= 31) {
                // Multiplexing (muxing)
                return x & y | ~x & z;
            }
            if (32 <= j && j <= 47) {
                return (x | ~y) ^ z;
            }
            if (48 <= j && j <= 63) {
                // Multiplexing (muxing)
                return x & z | y & ~z;
            }
            if (64 <= j && j <= 79) {
                return x ^ (y | ~z);
            }
        }
    }, {
        key: "K",
        value: function K(j) {
            if (0 <= j && j <= 15) {
                return 0x00000000;
            }
            if (16 <= j && j <= 31) {
                // Math.floor((2 ** 30) * Math.SQRT2)
                return 0x5A827999;
            }
            if (32 <= j && j <= 47) {
                // Math.floor((2 ** 30) * Math.sqrt(3))
                return 0x6ED9EBA1;
            }
            if (48 <= j && j <= 63) {
                // Math.floor((2 ** 30) * Math.sqrt(5))
                return 0x8F1BBCDC;
            }
            if (64 <= j && j <= 79) {
                // Math.floor((2 ** 30) * Math.sqrt(7))
                return 0xA953FD4E;
            }
        }
    }, {
        key: "KP",
        value: function KP(j) // K'
        {
            if (0 <= j && j <= 15) {
                // Math.floor((2 ** 30) * Math.cbrt(2))
                return 0x50A28BE6;
            }
            if (16 <= j && j <= 31) {
                // Math.floor((2 ** 30) * Math.cbrt(3))
                return 0x5C4DD124;
            }
            if (32 <= j && j <= 47) {
                // Math.floor((2 ** 30) * Math.cbrt(5))
                return 0x6D703EF3;
            }
            if (48 <= j && j <= 63) {
                // Math.floor((2 ** 30) * Math.cbrt(7))
                return 0x7A6D76E9;
            }
            if (64 <= j && j <= 79) {
                return 0x00000000;
            }
        }
    }, {
        key: "add_modulo32",
        value: function add_modulo32() /* ...... */{
            // 1.  Modulo addition (addition modulo) is associative.
            //    https://proofwiki.org/wiki/Modulo_Addition_is_Associative
            // 2.  Bitwise operation in Javascript
            //    is done on 32-bits operands
            //    and results in a 32-bits value.
            return Array.from(arguments).reduce(function (a, b) {
                return a + b;
            }, 0) | 0;
        }
    }, {
        key: "rol32",
        value: function rol32(value, count) {
            // Cyclic left shift (rotate) on 32-bits value.
            return value << count | value >>> 32 - count;
        }
    }, {
        key: "hash",
        value: function hash(message /* An ArrayBuffer. */) {
            //////////       Padding       //////////

            // The padded message.
            var padded = RIPEMD160.pad(message);

            //////////     Compression     //////////

            // Message word selectors.
            var r = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
            var rP = [// r'
                5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];

            // Amounts for 'rotate left' operation.
            var s = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
            var sP = [// s'
                8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];

            // The size, in bytes, of a word.
            var word_size = 4;

            // The size, in bytes, of a 16-words block.
            var block_size = 64;

            // The number of the 16-words blocks.
            var t = padded.byteLength / block_size;

            //  The message after padding consists of t 16-word blocks that
            // are denoted with X_i[j], with 0≤i≤(t − 1) and 0≤j≤15.
            var X = new Array(t).fill(undefined).map(function (_, i) {
                return function (j) {
                    return new DataView(padded, i * block_size, block_size).getUint32(j * word_size, true // Little-endian
                    );
                };
            });

            //  The result of RIPEMD-160 is contained in five 32-bit words,
            // which form the internal state of the algorithm. The final
            // content of these five 32-bit words is converted to a 160-bit
            // string, again using the little-endian convention.
            var h = [0x67452301, // h_0
                0xEFCDAB89, // h_1
                0x98BADCFE, // h_2
                0x10325476, // h_3
                0xC3D2E1F0 // h_4
            ];

            for (var i = 0; i < t; ++i) {
                var A = h[0],
                  B = h[1],
                  C = h[2],
                  D = h[3],
                  E = h[4];
                var AP = A,
                  BP = B,
                  CP = C,
                  DP = D,
                  EP = E;
                for (var j = 0; j < 80; ++j) {
                    // Left rounds
                    var _T = RIPEMD160.add_modulo32(RIPEMD160.rol32(RIPEMD160.add_modulo32(A, RIPEMD160.f(j, B, C, D), X[i](r[j]), RIPEMD160.K(j)), s[j]), E);
                    A = E;
                    E = D;
                    D = RIPEMD160.rol32(C, 10);
                    C = B;
                    B = _T;

                    // Right rounds
                    _T = RIPEMD160.add_modulo32(RIPEMD160.rol32(RIPEMD160.add_modulo32(AP, RIPEMD160.f(79 - j, BP, CP, DP), X[i](rP[j]), RIPEMD160.KP(j)), sP[j]), EP);
                    AP = EP;
                    EP = DP;
                    DP = RIPEMD160.rol32(CP, 10);
                    CP = BP;
                    BP = _T;
                }
                var T = RIPEMD160.add_modulo32(h[1], C, DP);
                h[1] = RIPEMD160.add_modulo32(h[2], D, EP);
                h[2] = RIPEMD160.add_modulo32(h[3], E, AP);
                h[3] = RIPEMD160.add_modulo32(h[4], A, BP);
                h[4] = RIPEMD160.add_modulo32(h[0], B, CP);
                h[0] = T;
            }

            //  The final output string then consists of the concatenatation
            // of h_0, h_1, h_2, h_3, and h_4 after converting each h_i to a
            // 4-byte string using the little-endian convention.
            var result = new ArrayBuffer(20);
            var data_view = new DataView(result);
            h.forEach(function (h_i, i) {
                return data_view.setUint32(i * 4, h_i, true);
            });
            return result;
        }
    }]);

    return RIPEMD160;
}();

module.exports = {
    RIPEMD160: RIPEMD160
};
