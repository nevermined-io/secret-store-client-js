import GeneratedKey from "./models/keys/GeneratedKey"
import RetrievedKey from "./models/keys/RetrievedKey"
import ParityClientConfig from "./models/ParityClientConfig"
import SecretStoreClientConfig from "./models/SecretStoreClientConfig"
import SecretStoreConfig from "./models/SecretStoreConfig"
import ParityClient from "./ParityClient"
import SecretStoreClient from "./SecretStoreClient"

export default class SecretStore {

    private parityClient: ParityClient
    private secretStoreClient: SecretStoreClient

    constructor(config: SecretStoreConfig) {

        this.parityClient = new ParityClient({
            url: config.parityUri, address: config.address,
            password: config.password,
        } as ParityClientConfig)

        this.secretStoreClient = new SecretStoreClient({
            url: config.secretStoreUri,
            threshold: config.threshold,
        } as SecretStoreClientConfig)
    }

    /**
     * Encrypts a document based in the given serverKeyId
     * @param serverKeyId serverKeyId to use for the encryption
     * @param document document to encrypt
     */
    public async encryptDocument(serverKeyId: string, document: any): Promise<string> {
        const serverKey = await this.generateServerKey(serverKeyId)

        // generate document key
        const documentKey: GeneratedKey = await this.generateDocumentKey(serverKey)

        // store the document key in secret store
        await this.storeDocumentKey(serverKeyId, documentKey)

        // encrypt document
        const encryptedDocument =
            await this.parityClient.encryptDocument(documentKey.encryptedKey, document)
        return encryptedDocument
    }

    /**
     * Decrypts a document based in the given serverKeyId
     * @param serverKeyId serverKeyId to use for the decryption
     * @param encryptedDocument encrypted document to decrypt
     */
    public async decryptDocument(serverKeyId: string, encryptedDocument: string): Promise<any> {

        // get document key from secret store
        const documentKey: RetrievedKey = await this.retrieveDocumentKey(serverKeyId)

        const decryptDocument: any = await this.parityClient.decryptDocument(
            documentKey.decryptedSecret, documentKey.commonPoint,
            documentKey.decryptShadows, encryptedDocument)

        return decryptDocument
    }

    /**
     * Generates a server key based on the given serverKeyId
     * @param serverKeyId serverKeyId to use for the generation
     */
    private async generateServerKey(serverKeyId: string): Promise<string> {

        // sign server key id
        const serverKeyIdSig = await this.parityClient.signKeyId(serverKeyId)

        // Logger.log("serverKeyId:", serverKeyId, "serverKeyIdSig:", serverKeyIdSig)

        // generate server key
        const serverKey = await this.secretStoreClient.generateServerKey(serverKeyId, serverKeyIdSig)

        return serverKey
    }

    /**
     * Derives a document from the server key
     * @param serverKey the serverKey generated with generateServerKey
     */
    private async generateDocumentKey(serverKey: string): Promise<GeneratedKey> {
        // generate document key from server key
        const documentKeys: GeneratedKey = await this.parityClient.generateDocumentKeyFromServerKey(serverKey)
        return documentKeys
    }

    /**
     * Stores the document key in the secret store
     * @param serverKeyId serverKeyId to use for the storage
     * @param documentKeys document key generated with generateDocumentKeyFromServerKey
     */
    private async storeDocumentKey(serverKeyId: string, documentKeys: GeneratedKey): Promise<boolean> {

        // sign server key id
        const serverKeyIdSig = await this.parityClient.signKeyId(serverKeyId)

        // store document key in secret store
        await this.secretStoreClient.storeDocumentKey(serverKeyId, serverKeyIdSig,
            documentKeys.commonPoint, documentKeys.encryptedPoint)

        return true
    }

    /**
     * Retrieves the document key attached to the given serverKeyId from the secret store
     * @param serverKeyId serverKeyId to retrieve the document key
     */
    private async retrieveDocumentKey(serverKeyId: string): Promise<RetrievedKey> {

        // sign server key id
        const serverKeyIdSig = await this.parityClient.signKeyId(serverKeyId)

        // Logger.log("serverKeyId:", serverKeyId, "serverKeyIdSig:", serverKeyIdSig)

        // retrieve document key from secret store
        const documentKeys: RetrievedKey = await this.secretStoreClient.retrieveDocumentKey(serverKeyId, serverKeyIdSig)
        return documentKeys
    }

}
