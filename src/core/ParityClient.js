import add0xPrefix from './util'
const jayson = require('jayson')

export default class ParityClient {
    constructor(host, port, address, password) {
        this.host = host
        this.port = port
        this.address = address
        this.password = password
        this.rpcClient = jayson.client.http({port: this.port})
    }

    signDocumentKeyId(documentKeyId) {
        return sendJsonRpcRequest(this.rpcClient, 'secretstore_signRawHash', [this.address, this.password, documentKeyId])
    }

    generateDocumentKeyFromKey(serverKey) {
        return sendJsonRpcRequest(this.rpcClient, 'secretstore_generateDocumentKey', [this.address, this.password, serverKey])

    }

    encryptDocument(encryptedKey, document) {
        // `document` must be encoded in hex when sent to encryption
        return sendJsonRpcRequest(this.rpcClient, 'secretstore_encrypt',
            [this.address, this.password, encryptedKey, add0xPrefix(Buffer(document).toString('hex'))])
    }

    decryptDocument(decryptedSecret, commonPoint, decryptShadows, encryptedDocument) {
        return sendJsonRpcRequest(this.rpcClient, 'secretstore_shadowDecrypt',
            [this.address, this.password,
             decryptedSecret, commonPoint, decryptShadows, encryptedDocument])
    }
}