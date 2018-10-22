import KeyBase from "./KeyBase"

export default class RetrievedKey extends KeyBase {
    public decryptedSecret: string
    public decryptShadows: string[]
}
