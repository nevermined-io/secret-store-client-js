import BigNumber from "bignumber.js"
import {assert} from "chai"
import GeneratedKey from "../../src/keys/GeneratedKey"
import ParityClient from "../../src/ParityClient"
import * as GeneratedKeyMaterial from "./secrets/GeneratedKey.json"
import * as RetrievedKeyMaterial from "./secrets/RetrievedKey.json"
import * as ServerKey from "./secrets/ServerKey.json"
import * as testAccount from "./secrets/testAccount.json"

const parityUrl = "http://localhost:9545"

const testDocument = {
    so: "secure",
    soWow: true,
}

const parityClient: ParityClient = new ParityClient({
    url: parityUrl,
    address: testAccount.address,
    password: testAccount.password,
})

function generateRandomId(): string {
    const id: string = BigNumber.random(64).toString().replace("0.", "")

    // sometimes it only generates 63 digits
    return id.length === 63 ? id + "0" : id
}

describe("ParityClient", () => {

    describe("#signKeyId()", () => {
        it("should generate sig from given key", async () => {

            const keyId = generateRandomId()
            const keyIdSig = await parityClient.signKeyId(keyId)

            assert(keyIdSig)
        })
    })

    describe("#generateDocumentKeyFromKey()", () => {
        it("should generate a document key from a server key", async () => {

            const documentKey = await parityClient.generateDocumentKeyFromKey(ServerKey)
            assert(documentKey)
        })
    })

    describe("#encryptDocument()", () => {
        it("should encrypt an document", async () => {

            const documentKey: GeneratedKey = await parityClient.generateDocumentKeyFromKey(ServerKey)
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
