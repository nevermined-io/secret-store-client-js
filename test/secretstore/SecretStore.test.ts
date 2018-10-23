import BigNumber from "bignumber.js"
import {assert} from "chai"
import SecretStore from "../../src/SecretStore"
import * as ConsumerAccount from "./secrets/ConsumerAccount.json"
import * as PublisherAccount from "./secrets/PublisherAccount.json"

const parityUri = "http://localhost:9545"
const ssUrl = "https://secret-store.dev-ocean.com"

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
    threshold: 2,
})

function generateRandomId(): string {
    const id: string = BigNumber.random(64).toString().replace("0.", "")

    // sometimes it only generates 63 digits
    return id.length === 63 ? id + "0" : id
}

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

            const encryptedDocument: string = await secretStore.encryptDocument(serverKeyId, testDocument)
            assert(encryptedDocument)

            const newSecretStore: SecretStore = new SecretStore({
                secretStoreUri: ssUrl, parityUri,
                address: ConsumerAccount.address, password: ConsumerAccount.password,
                threshold: 2,
            })

            const decryptedDocument: any = await newSecretStore.decryptDocument(serverKeyId, encryptedDocument)
            assert(decryptedDocument)

            assert(testDocument.soWow === decryptedDocument.soWow)
            assert(testDocument.i === decryptedDocument.i)
        })
    })
})
