import GeneratedKey from "./keys/GeneratedKey"
import RetrievedKey from "./keys/RetrievedKey"
import ParityClient from "./ParityClient"
import SecretStoreClient from "./SecretStoreClient"

export default class SecretStore {

    private partiyClient: ParityClient
    private secretStoreClient: SecretStoreClient

    constructor(config: { secretStoreUrl: string, parityUrl: string, address: string, password: string }) {

        this.partiyClient = new ParityClient({
            url: config.parityUrl, address: config.address,
            password: config.password,
        })
        this.secretStoreClient = new SecretStoreClient({url: config.secretStoreUrl})
    }

    public async encryptDocument(serverKeyId: string, document: any): Promise<string> {
        const serverKey = await this.generateServerKey(serverKeyId)

        // generate document key
        const documentKey: GeneratedKey = await this.generateDocumentKey(serverKey)

        // store the document key in secret store
        await this.storeDocumentKey(serverKeyId, documentKey)

        // encrypt document
        const encryptedDocument =
            await this.partiyClient.encryptDocument(documentKey.encryptedKey, document)
        return encryptedDocument
    }

    public async decryptDocument(serverkeyId: string, encryptedDocument: string): Promise<any> {

        // get document key from secret store
        const documentKey: RetrievedKey = await this.retrieveDocumentKey(serverkeyId)

        const decryptDocument: any = await this.partiyClient.decryptDocument(
            documentKey.decryptedSecret, documentKey.commonPoint,
            documentKey.decryptShadows, encryptedDocument)

        return decryptDocument
    }

    private async generateServerKey(serverKeyId: string): Promise<string> {

        // sign server key id
        const serverKeyIdSig = await this.partiyClient.signKeyId(serverKeyId)

        // Logger.log("serverKeyId:", serverKeyId, "serverKeyIdSig:", serverKeyIdSig)

        // generate server key
        const serverKey = await this.secretStoreClient.generateServerKey(serverKeyId, serverKeyIdSig)

        return serverKey
    }

    private async generateDocumentKey(serverKey: string): Promise<GeneratedKey> {
        // generate document key from server key
        const documentKeys: GeneratedKey = await this.partiyClient.generateDocumentKeyFromKey(serverKey)
        return documentKeys
    }

    private async storeDocumentKey(serverKeyId: string, documentKeys: GeneratedKey): Promise<boolean> {

        // sign server key id
        const serverKeyIdSig = await this.partiyClient.signKeyId(serverKeyId)

        // store document key in secret store
        await this.secretStoreClient.storeDocumentKey(serverKeyId, serverKeyIdSig,
            documentKeys.commonPoint, documentKeys.encryptedPoint)

        return true
    }

    private async retrieveDocumentKey(serverKeyId: string): Promise<RetrievedKey> {

        // sign server key id
        const serverKeyIdSig = await this.partiyClient.signKeyId(serverKeyId)

        // Logger.log("serverKeyId:", serverKeyId, "serverKeyIdSig:", serverKeyIdSig)

        // retrieve document key from secret store
        const documentKeys: RetrievedKey = await this.secretStoreClient.retrieveDocumentKey(serverKeyId, serverKeyIdSig)
        return documentKeys
    }

}
