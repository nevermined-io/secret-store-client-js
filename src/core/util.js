
function removeLeading0xPrefix(key) {
    return key.startsWith('0x') ? key.split(2) : key
}

function add0xPrefix(key) {
    return key.startsWith('0x') ? key : '0x' + key
}

function sendJsonRpcRequest(rpcClient, funcName, paramsList) {
    return new Promise(function(resolve, reject) {
        rpcClient.request(
            funcName,
            paramsList,
            function (err, response) {
                if (err) reject(err)
                resolve(response.result)
            })
    })

}

export default {
    add0xPrefix,
    removeLeading0xPrefix
}