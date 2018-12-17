import {assert} from "chai"
import SecretStore from "../../src/SecretStore"
import {generateRandomId} from "./generateRandomId"
import * as ConsumerAccount from "./secrets/ConsumerAccount.json"
import * as PublisherAccount from "./secrets/PublisherAccount.json"

const parityUri = "http://localhost:8545"
const ssUrl = "http://localhost:12001"
const testThreshold = 0

const testDocument = {
    so: "ocean",
    soWow: true,
    many: "text is nice to have",
    i: "blow up this document with blind text",
}

const secretStore: SecretStore = new SecretStore({
    secretStoreUri: ssUrl, parityUri,
    address: PublisherAccount.address,
    password: PublisherAccount.password,
    threshold: testThreshold,
})

describe("SecretStore", () => {

    describe("#encryptDocument()", () => {
        it("should encrypt an document", async () => {

            const serverKeyId = generateRandomId()

            const encryptedDocument = await secretStore.encryptDocument(serverKeyId, testDocument)
            assert(encryptedDocument)
        })
    })

    describe("#decryptDocument()", () => {
        it("should decrypt an document", async () => {

            const serverKeyId = generateRandomId()

            const encryptedDocument: string = await secretStore.encryptDocument(serverKeyId, testDocument)
            assert(encryptedDocument)

            const decryptedDocument: any = await secretStore.decryptDocument(serverKeyId, encryptedDocument)
            assert(decryptedDocument)

            assert(testDocument.soWow === decryptedDocument.soWow)
            assert(testDocument.i === decryptedDocument.i)
        })

        it("should decrypt an document encrypted by someone else", async () => {

            const serverKeyId = generateRandomId()

            const encryptSecretStore: SecretStore = new SecretStore({
                secretStoreUri: ssUrl, parityUri,
                address: PublisherAccount.address,
                password: PublisherAccount.password,
                threshold: testThreshold,
            })

            const encryptedDocument: string = await encryptSecretStore.encryptDocument(serverKeyId, testDocument)
            assert(encryptedDocument)

            const decrypSecretStore: SecretStore = new SecretStore({
                secretStoreUri: ssUrl, parityUri,
                address: ConsumerAccount.address, password: ConsumerAccount.password,
                threshold: testThreshold,
            })

            const decryptedDocument: any = await decrypSecretStore.decryptDocument(serverKeyId, encryptedDocument)
            assert(decryptedDocument)

            assert(testDocument.soWow === decryptedDocument.soWow)
            assert(testDocument.i === decryptedDocument.i)
        })
    })
})
