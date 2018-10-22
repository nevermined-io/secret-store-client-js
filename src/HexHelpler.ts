export default class HexHelpler {
    public static removeLeading0xPrefix(key) {
        return key.startsWith("0x") ? key.replace("0x", "") : key
    }

    public static add0xPrefix(key) {
        return key.startsWith("0x") ? key : "0x" + key
    }

}
