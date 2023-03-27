const Axios = require("axios")
const managerConfig = require("../config/manager")
const rebootConfig = require("../config/reboot")
const { encryptionData } = require("./index")


console


const data = `<xml>
    <managerid><![CDATA[${managerConfig.id}]]></managerid>
</xml>`

Axios.post(`https://chatbot.weixin.qq.com/openapi/publish/${rebootConfig.token}`, {
    headers: {
        'content-type': 'application/json'
    },
    data: {
        encrypt: encryptionData(data)
    }
}).then(res => {
    console.log("res-------->", res.data)
})