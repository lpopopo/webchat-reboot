const WechatEncrypt = require('wechat-encrypt')

const rebootConfig = require("../config/reboot")

const wechatEncrypt = new WechatEncrypt({
    appId: rebootConfig.appid,
    encodingAESKey: rebootConfig.encodingKey,
    token: rebootConfig.token
})
function decryptData(encryptedData) {
    return wechatEncrypt.decode(encryptedData)
}

function encryptionData(data) {
    return wechatEncrypt.encode(data)
}

exports.decryptData = decryptData
exports.encryptionData = encryptionData
