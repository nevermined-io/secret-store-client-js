import BigNumber from "bignumber.js"
import {assert} from "chai"
import SecretStore from "../../src/SecretStore"
import * as testAccount from "./secrets/testAccount.json"

const parityUrl = "http://localhost:9545"
const ssUrl = "https://secret-store.dev-ocean.com"

const testDocument = {
    so: "ocean",
    soWow: true,
    many: "text is nice to have",
    i: "blow up this document with blind text",
}

const secretStore: SecretStore = new SecretStore({
    secretStoreUrl: ssUrl, parityUrl,
    address: testAccount.address, password: testAccount.password,
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
    })
})
