import removeLeading0xPrefix from 'util'

export default class SecretStore {
    constructor(url, threshold) {
        this.url = url
        this.threshold = threshold | 1
    }

    generateServerKey(ssUrl, documentKey, signedDocKey) {
        const url = `${ssUrl}/shadow/${documentKey}/${removeLeading0xPrefix(signedDocKey)}/${this.threshold}`

        const result = fetch(url,
            {
                method: 'POST',
            })
            .then(response => {
                if (response.ok) {
                    return response
                }
                return ''
            })
            .catch(error => {
                throw Error(`Unable to generate Server Key: ${error.message}`)
            })
        if (!result) {
            throw Error(`Unable to generate Server Key`)
        }
        return result
    }

    storeDocumentKeys(documentKey, signedDocKey, commonPoint, encryptedPoint) {
        const url = [this.url, 'shadow', documentKey, removeLeading0xPrefix(signedDocKey),
            removeLeading0xPrefix(commonPoint), removeLeading0xPrefix(encryptedPoint)]
            .join('/')

        const result = fetch(url, {method: 'POST'})
            .then(response => {
                if (response.ok) {
                    return response
                }
                throw Error(`Unable to store document Keys`)
            })
            .catch(error => {
                throw Error(`Unable to store document keys: ${error.message}`)
            })
        if (!result) {
            throw Error(`Unable to store document Keys`)
        }
        return result
    }

    retrieveDocumentKeys(documentKey, signedDocKey) {
        const url = [this.url, 'shadow', documentKey, removeLeading0xPrefix(signedDocKey)]
            .join('/')

        const result = async () => {
            try {
                const response = await fetch(url, {method: 'GET'})
                return response.ok ? response.json() : ''
            } catch(e) {
                throw Error(`Unable to retrieve decryption keys: ${e.message}`)
            }
        }
        if (!result) {
            throw Error(`Unable to retrieve decryption Keys`)
        }
        // results should have (decrypted_secret, common_point, decrypt_shadows)
        return JSON.parse(result)
    }
}
