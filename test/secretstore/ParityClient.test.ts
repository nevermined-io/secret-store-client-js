import {assert} from "chai"
import GeneratedKey from "../../src/models/keys/GeneratedKey"
import ParityClient from "../../src/ParityClient"
import {generateRandomId} from "../generateRandomId"
import * as GeneratedKeyMaterial from "./secrets/GeneratedKey.json"
import * as PublisherAccount from "./secrets/PublisherAccount.json"
import * as RetrievedKeyMaterial from "./secrets/RetrievedKey.json"
import * as ServerKey from "./secrets/ServerKey.json"

const parityUri = "http://localhost:9545"

const testDocument = {
    so: "secure",
    soWow: true,
}

const parityClient: ParityClient = new ParityClient({
    url: parityUri,
    address: PublisherAccount.address,
    password: PublisherAccount.password,
})

describe("ParityClient", () => {

    describe("#signKeyId()", () => {
        it("should generate sig from given key", async () => {

            const keyId = generateRandomId()
            const keyIdSig = await parityClient.signKeyId(keyId)

            assert(keyIdSig)
        })
    })

    describe("#generateDocumentKeyFromServerKey()", () => {
        it("should generate a document key from a server key", async () => {

            const documentKey = await parityClient.generateDocumentKeyFromServerKey(ServerKey)
            assert(documentKey)
        })
    })

    describe("#encryptDocument()", () => {
        it("should encrypt an document", async () => {

            const documentKey: GeneratedKey = await parityClient.generateDocumentKeyFromServerKey(ServerKey)
            const encryptedDocument = await parityClient.encryptDocument(documentKey.encryptedKey, testDocument)
            assert(encryptedDocument)
        })
    })

    describe("#decryptDocument()", () => {
        it("should decrypt an document", async () => {

            const encryptedDocument: string =
                await parityClient.encryptDocument(GeneratedKeyMaterial.encryptedKey, testDocument)
            assert(encryptedDocument)

            const decryptedDocument: any = await parityClient.decryptDocument(
                RetrievedKeyMaterial.decryptedSecret, RetrievedKeyMaterial.commonPoint,
                RetrievedKeyMaterial.decryptShadows, encryptedDocument)
            assert(decryptedDocument)

            assert(testDocument.soWow === decryptedDocument.soWow)
        })
    })
})
