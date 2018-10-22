import BigNumber from "bignumber.js"
import {assert} from "chai"
import ConfigProvider from "../../../squid-js/src/ConfigProvider"
import Config from "../../../squid-js/src/models/Config"
import GeneratedKey from "../../src/keys/GeneratedKey"
import ParityClient from "../../src/ParityClient"
import * as GeneratedKeyMaterial from "./keys/GeneratedKey.json"
import * as RetrievedKeyMaterial from "./keys/RetrievedKey.json"
import * as ServerKey from "./keys/ServerKey.json"

const parityUrl = "http://localhost:8545"

ConfigProvider.configure({
    nodeUri: parityUrl,
} as Config)

const address = "0xa50f397644973dba99624404b2894825840aa03b"
const password = "unittest"
const testDocument = {
    so: "secure",
    soWow: true,
}

const parityClient: ParityClient = new ParityClient({
    url: parityUrl,
    address, password,
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
