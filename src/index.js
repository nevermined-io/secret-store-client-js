import SecretStore from './core/SecretStore'
import ParityClient from './core/ParityClient'

export default class SecretStoreDocumentHandler {
    constructor(ssUrl, evmUrl, address, password) {
        this.secretStore = SecretStore(ssUrl, 1),
        this.parityClient = ParityClient(evmUrl, address, password)
    }

    createDocumentStore(documentId, document, threshold) {
        return ''
    }

    decryptDocument(documentId, encryptedDocument) {
        return ''
    }
}
