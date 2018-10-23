import KeyBase from "./KeyBase"

export default abstract class RetrievedKey extends KeyBase {
    public decryptedSecret: string
    public decryptShadows: string[]
}
