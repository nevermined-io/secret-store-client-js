import BigNumber from "bignumber.js"
import {assert} from "chai"
import ConfigProvider from "../../../squid-js/src/ConfigProvider"
import Config from "../../../squid-js/src/models/Config"
import SecretStore from "../../src/SecretStore"

const parityUrl = "http://localhost:9545"
const ssUrl = "https://secret-store.dev-ocean.com"

ConfigProvider.configure({
    nodeUri: parityUrl,
} as Config)

const testDocument = {
    so: "ocean",
    soWow: true,
    many: "text is nice to have",
    i: "blow up this document with blind text",
}

const address = "0xa50f397644973dba99624404b2894825840aa03b"
const password = "unittest"

const secretStore: SecretStore = new SecretStore({
    secretStoreUrl: ssUrl, parityUrl,
    address, password,
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
        })
    })
})
