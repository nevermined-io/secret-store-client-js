import fetch from "node-fetch"
import RetrievedKey from "./models/keys/RetrievedKey"
import SecretStoreClientConfig from "./models/SecretStoreClientConfig"
import HexHelper from "./tools/HexHelper"

export default class SecretStoreClient {

    private threshold: number
    private url: string

    constructor(config: SecretStoreClientConfig) {
        this.url = config.url
        // threshold of nodes that have to agree
        this.threshold = config.threshold
    }

    /**
     * Generates server key from serverKeyId and serverKeyIdSignature
     * @param serverKeyId the server key id
     * @param serverKeyIdSig the server key id, signed with the given account
     */
    public async generateServerKey(serverKeyId: string, serverKeyIdSig: string): Promise<string> {

        const url = [
            this.url, "shadow", serverKeyId,
            HexHelper.removeLeading0xPrefix(serverKeyIdSig),
            this.threshold,
        ].join("/")

        const result = await fetch(url, {
            method: "POST",
            mode: "cors",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw Error(`Unable to generate Server Key ${response.statusText}`)
            })
            .catch((error) => {
                throw Error(`Unable to generate Server Key: ${error.message}`)
            })

        if (!result) {
            throw Error(`Unable to generate Server Key`)
        }

        return result
    }

    /**
     * Stores document key in the secret store
     * @param serverKeyId the server key id
     * @param serverKeyIdSig the server key id, signed with the given account
     * @param commonPoint the common point created during generateDocumentKeyFromServerKey
     * @param encryptedPoint the encrypted point created during generateDocumentKeyFromServerKey
     */
    public async storeDocumentKey(serverKeyId: string, serverKeyIdSig: string,
                                  commonPoint: string, encryptedPoint: string): Promise<boolean> {
        const url = [this.url, "shadow", serverKeyId, HexHelper.removeLeading0xPrefix(serverKeyIdSig),
            HexHelper.removeLeading0xPrefix(commonPoint), HexHelper.removeLeading0xPrefix(encryptedPoint)]
            .join("/")

        // Logger.log("url", url)

        const result = await fetch(url, {
            method: "POST",
            mode: "cors",
        })
            .then((response) => {
                if (response.ok && response.status === 200) {
                    return true
                }
                throw Error(`Unable to store document Keys ${response.statusText}`)
            })
            .catch((error) => {
                throw Error(`Unable to store document keys: ${error.message}`)
            })

        if (!result) {
            throw Error(`Unable to store document Keys`)
        }

        return result
    }

    /**
     * Retrieves the document key from secret store using serverKeyId and serverKeyId signature
     * @param serverKeyId the server key id
     * @param serverKeyIdSig the server key id, signed with the given account
     */
    public async retrieveDocumentKey(serverKeyId, serverKeyIdSig): Promise<RetrievedKey> {

        const url = [this.url, "shadow", serverKeyId, HexHelper.removeLeading0xPrefix(serverKeyIdSig)]
            .join("/")

        // Logger.log("url", url)

        const result: RetrievedKey = await fetch(url, {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
                throw Error(`Unable to retrieve decryption Keys ${response.statusText}`)
            })
            .then((data) => {
                return {
                    commonPoint: data.common_point,
                    decryptedSecret: data.decrypted_secret,
                    decryptShadows: data.decrypt_shadows,
                } as RetrievedKey
            })
            .catch((e) => {
                throw Error(`Unable to retrieve decryption keys: ${e.message}`)
            })

        if (!result) {
            throw Error(`Unable to retrieve decryption Keys`)
        }

        return result
    }
}
