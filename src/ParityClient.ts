import * as jayson from "jayson"
import {Client} from "jayson"
import {URL} from "url"
import GeneratedKey from "./models/keys/GeneratedKey"
import ParityClientConfig from "./models/ParityClientConfig"
import HexHelper from "./tools/HexHelper"

export default class ParityClient {

    private address: string
    private password: string
    private rpcClient: Client

    constructor(config: ParityClientConfig) {
        this.password = config.password
        this.address = config.address
        this.rpcClient = jayson.Client.http(new URL(config.url))
    }

    /**
     * Sign the keyId with given password and address in the underlying parity node
     * @param keyId the keyId to sign
     */
    public async signKeyId(keyId): Promise<string> {
        return this.sendJsonRpcRequest(this.rpcClient,
            "secretstore_signRawHash",
            [this.address, this.password, HexHelper.add0xPrefix(keyId)])
            .then((result: string) => {
                return result
            })
    }

    /**
     * Derives a document key from a server key
     * @param serverKey the server key to derive from
     */
    public async generateDocumentKeyFromServerKey(serverKey: string): Promise<any> {
        return this.sendJsonRpcRequest(this.rpcClient,
            "secretstore_generateDocumentKey",
            [this.address, this.password, serverKey])
            .then((result: any) => {
                const generatedKey = {
                    commonPoint: result.common_point,
                    encryptedKey: result.encrypted_key,
                    encryptedPoint: result.encrypted_point,
                } as GeneratedKey
                return generatedKey
            })
    }

    /**
     * Uses the underlying parity node to encrypt a document with given keys
     * @param encryptedKey the encrypted key generated in generateDocumentKeyFromServerKey
     * @param document the document to encrypt
     */
    public encryptDocument(encryptedKey: string, document: any): Promise<string> {
        // `document` must be encoded in hex when sent to encryption
        const documentString = JSON.stringify(document)
        const documentHexed = HexHelper.add0xPrefix(new Buffer(documentString).toString("hex"))
        return this.sendJsonRpcRequest(this.rpcClient,
            "secretstore_encrypt",
            [this.address, this.password, encryptedKey, documentHexed])
            .then((result: string) => {
                return result
            })
    }

    /**
     * Decrypts a document based on the keys retrieved from the secret store
     * @param decryptedSecret the decryptedSecret returned from retrieveDocumentKey of secret store
     * @param commonPoint the commonPoint returned from retrieveDocumentKey of secret store
     * @param decryptShadows the commonPoint returned from retrieveDocumentKey of secret store
     * @param encryptedDocument the encrypted document to decrypt
     */
    public decryptDocument(decryptedSecret: string, commonPoint: string,
                           decryptShadows: string[], encryptedDocument: string): Promise<any> {
        return this.sendJsonRpcRequest(this.rpcClient,
            "secretstore_shadowDecrypt",
            [this.address, this.password, decryptedSecret,
                commonPoint, decryptShadows, encryptedDocument])
            .then((result: string) => {
                const documentString = new Buffer(HexHelper.removeLeading0xPrefix(result), "hex").toString("utf8")
                return JSON.parse(documentString)
            })
    }

    private sendJsonRpcRequest(rpcClient: Client, methodName: string, paramsList: any[]) {
        return new Promise((resolve, reject) => {
            rpcClient.request(methodName, paramsList,
                (err, response) => {
                    const error = err || response.error
                    if (error) {
                        return reject(error)
                    }
                    return resolve(response.result)
                })
        })
    }
}
