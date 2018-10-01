export default class SecretStore {
    constructor(url, threshold) {
        this.url = url
        this.threshold = threshold | 1
    }

    generateServerKey() {
        return ''
    }

    storeDocumentKey() {
        return ''
    }

    retrieveDocumentKey() {
        return ''
    }
}
