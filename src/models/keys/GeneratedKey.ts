import KeyBase from "./KeyBase"

export default abstract class GeneratedKey extends KeyBase {
    public encryptedKey: string
    public encryptedPoint: string
}
