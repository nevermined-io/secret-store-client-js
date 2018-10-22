import fetch from "node-fetch"
import HexHelpler from "./HexHelpler"
import RetrievedKey from "./keys/RetrievedKey"

export default class SecretStoreClient {

    private threshold: number
    private url: string

    constructor(config: { url: string, threshold?: number }) {
        this.url = config.url
        this.threshold = config.threshold || 1
    }

    public async generateServerKey(serverKeyId: string, serverKeyIdSig: string): Promise<string> {

        const url = [
            this.url, "shadow", serverKeyId,
            HexHelpler.removeLeading0xPrefix(serverKeyIdSig),
            this.threshold,
        ].join("/")

        // Logger.log("url", url)

        const result = await fetch(url, {
            method: "POST",
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

    public async storeDocumentKey(serverKeyId: string, serverKeyIdSig: string,
                                  commonPoint: string, encryptedPoint: string): Promise<boolean> {
        const url = [this.url, "shadow", serverKeyId, HexHelpler.removeLeading0xPrefix(serverKeyIdSig),
            HexHelpler.removeLeading0xPrefix(commonPoint), HexHelpler.removeLeading0xPrefix(encryptedPoint)]
            .join("/")

        // Logger.log("url", url)

        const result = await fetch(url, {
            method: "POST",
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

    public async retrieveDocumentKey(serverKeyId, serverKeyIdSig): Promise<RetrievedKey> {

        const url = [this.url, "shadow", serverKeyId, HexHelpler.removeLeading0xPrefix(serverKeyIdSig)]
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
