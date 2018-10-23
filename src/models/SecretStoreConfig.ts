export default class Config {
    /* Secret Store Config */
    // the uri of the secret store to connect to
    public secretStoreUri: string
    // the uri of the parity node to connect to
    public parityUri: string
    // the password of the account in the local parity node to sign the serverKeyId
    public password: string
    // the address of the account in the local parity node to sign the serverKeyId
    public address: string
    // the number of nodes in the secret store that have to agree on changes
    public threshold: number
}
