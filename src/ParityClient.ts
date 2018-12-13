import fetch from "node-fetch"
import GeneratedKey from "./models/keys/GeneratedKey"
import ParityClientConfig from "./models/ParityClientConfig"
import HexHelper from "./tools/HexHelper"

export default class ParityClient {

    private address: string
    private password: string
    private url: string

    constructor(config: ParityClientConfig) {
        this.password = config.password
        this.address = config.address
        this.url = config.url
    }

    /**
     * Sign the keyId with given password and address in the underlying parity node
     * @param keyId the keyId to sign
     */
    public async signKeyId(keyId): Promise<string> {
        return this.sendJsonRpcRequest(
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
        return this.sendJsonRpcRequest(
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
        const documentString = JSON.stringify(document, null, 2)
        const documentHexed = HexHelper.add0xPrefix(Buffer.from(documentString).toString("hex"))
        return this.sendJsonRpcRequest(
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
        return this.sendJsonRpcRequest(
            "secretstore_shadowDecrypt",
            [this.address, this.password, decryptedSecret,
                commonPoint, decryptShadows, encryptedDocument])
            .then((result: string) => {
                let documentString: string = Buffer
                    .from(HexHelper.removeLeading0xPrefix(result), "hex")
                    .toString("utf8")

                try {
                    documentString = JSON.parse(documentString)
                } catch {
                    // just a probe
                }

                return documentString
            })
    }

    private sendJsonRpcRequest(methodName: string, paramsList: any[]) {

        return fetch(this.url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: methodName,
                params: paramsList,
                id: 1,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`Calling method "${methodName}" on parity client failed with ${response.statusText}`)
            })
            .then((result) => {
                if (result.result) {
                    return result.result
                }
                throw new Error(`Parity node returned an error ${result.error.message} ${result.error.data}`)
            })
            .catch((err) => {
                throw new Error(`Calling method "${methodName}" on parity client failed. ${err}`)
            })
    }
}
