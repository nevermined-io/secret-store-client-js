import SecretStore from './SecretStore'
import ParityClient from './ParityClient'

export default class DocumentManager {
    constructor(ssUrl, evmUrl, address, password) {
        this.secretStore = SecretStore(ssUrl, 1),
        this.parityClient = ParityClient(evmUrl, address, password)
    }

    publishDocument(documentId, document, threshold) {
        return ''
    }

    decryptDocument(documentId, encryptedDocument) {
        return ''
    }
}
