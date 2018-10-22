import * as jayson from "jayson"
import {Client} from "jayson"
import {URL} from "url"
import HexHelpler from "./HexHelpler"
import GeneratedKey from "./keys/GeneratedKey"

export default class ParityClient {

    private address: string
    private password: string
    private rpcClient: Client

    constructor(config: { url: string, address: string, password: string }) {
        this.password = config.password
        this.address = config.address
        this.rpcClient = jayson.Client.http(new URL(config.url))
    }

    public async signKeyId(keyId): Promise<string> {
        return this.sendJsonRpcRequest(this.rpcClient,
            "secretstore_signRawHash",
            [this.address, this.password, HexHelpler.add0xPrefix(keyId)])
            .then((result: string) => {
                return result
            })
    }

    public async generateDocumentKeyFromKey(serverKey: string): Promise<any> {
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

    public encryptDocument(encryptedKey: string, document: any): Promise<string> {
        // `document` must be encoded in hex when sent to encryption
        const documentString = JSON.stringify(document)
        const documentHexed = HexHelpler.add0xPrefix(new Buffer(documentString).toString("hex"))
        return this.sendJsonRpcRequest(this.rpcClient,
            "secretstore_encrypt",
            [this.address, this.password, encryptedKey, documentHexed])
            .then((result: string) => {
                return result
            })
    }

    public decryptDocument(decryptedSecret: string, commonPoint: string,
                           decryptShadows: string[], encryptedDocument: string): Promise<any> {
        return this.sendJsonRpcRequest(this.rpcClient,
            "secretstore_shadowDecrypt",
            [this.address, this.password, decryptedSecret,
                commonPoint, decryptShadows, encryptedDocument])
            .then((result: string) => {
                const documentString = new Buffer(HexHelpler.removeLeading0xPrefix(result), "hex").toString("utf8")
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
