declare module 'eosjs-ecc' {
  type EncodingOts = 'hex' | 'binary' | 'base64'

  export function privateToPublic(wif: string, pubkeyPrefix: string): string
  export function isValidPublic(pubKey: string, keyPrefix: string): boolean
  export function isValidPrivate(privKey: string): boolean
  export function sign(data: string | Buffer, privateKey: string, encoding?: string): string
  export function recover(signature: string | Buffer, data: string | Buffer, encoding?: string): string
  export function sha256(data: string | Buffer, resultEncoding?: EncodingOts): string
  export function signHash(dataSha256: string | Buffer, privateKey: string, encoding?: EncodingOts): string
  export function recoverHash(
    string: string | Buffer,
    dataSha256: string | Buffer,
    encoding?: EncodingOts
  ): string
  export function verify(
    signature: string,
    data: string | Buffer,
    pubkey: string,
    encoding?: string,
    hashData?: boolean
  ): boolean
}
