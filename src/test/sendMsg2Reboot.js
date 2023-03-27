const Koa = require("koa")
const Router = require('@koa/router');
const Axios = require("axios")
const bodyParser = require('koa-bodyparser');
const xml2js = require("xml2js")
const { decryptData, encryptionData } = require("../utils/index")

/** config */
const { token } = require("../config/reboot")

const router = new Router();
const app = new Koa();

app.use(bodyParser());
app.use(router.routes());

router.post("/chat", async (ctx) => {
    const postData = ctx.request.body;
    const { encrypted } = postData
    const xmlData = await xml2js.parseStringPromise(decryptData(encrypted))
    if (xmlData.xml.from[0] === '0') {
        console.log("xmlData.xml------>", JSON.parse(JSON.stringify(xmlData.xml)))
        const data = `<xml>
                        <appid><![CDATA[${xmlData.xml.appid}]]></appid>
                        <openid><![CDATA[${xmlData.xml.userid}]]></openid>
                        <msg><![CDATA[test]]></msg>
                        <channel>${xmlData.xml.channel}</channel>
                    </xml>`
        const res = await Axios.post(`https://chatbot.weixin.qq.com/openapi/sendmsg/${token}`, {
            headers: {
                'content-type': 'application/json'
            },
            data: {
                encrypt: encryptionData(data)
            }
        })
        // console.log("encryptionData(data)------->", decryptData(encryptionData(data)))
        console.log("sendmsg res----->\n", res.status, res.data)
        ctx.status = res.status
        ctx.body = res.data
    }
})

app.listen(3003, () => {
    console.log("service is running 3003")
});