const Koa = require("koa")
const Router = require('@koa/router');
const Axios = require("axios")
const bodyParser = require('koa-bodyparser');
const https = require('https');
const crypto = require('crypto');
const url = require('url');
const Buffer = require('buffer').Buffer;

const {
    AI_MODEL,
    AI_MODEL_ENUM,
    getModelStatus
} = require("./utils/ai_model")
const { requestAi } = require("./ai_request")

const router = new Router();
const app = new Koa();
const morgan = require('koa-morgan');
const fs = require("fs")

const accessLogStream = fs.createWriteStream(__dirname + '/access.log',
    { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))

app.use(bodyParser());
app.use(router.routes());

let model_status = AI_MODEL_ENUM.CHAT

router.post("/chat", async (ctx) => {
    const postData = ctx.request.body;
    const { webhookUrl, text, image, from } = postData
    if (AI_MODEL.includes(text.content.slice("@问答小助手".length).trim())) {
        model_status = getModelStatus(text.content.slice("@问答小助手".length).trim())
        await Axios.post(webhookUrl, {
            "msgtype": "text",
            "text": {
                "content": `已选择${model_status}模式`
            }
        })
        return
    } else {
        // 根据model 调用不同的openai 接口
        const respone = await requestAi(model_status, text.content.slice("@问答小助手".length))
        if (model_status === AI_MODEL_ENUM.CHAT) {
            Axios.post(webhookUrl, {
                "msgtype": "markdown",
                "markdown": {
                    "content": respone
                }
            })
        } else {
            // 发送https请求
            const parsedUrl = url.parse(respone[0].url);
            const options = {
                hostname: parsedUrl.hostname,
                port: 443,
                path: parsedUrl.path,
                method: 'GET'
            };
            https.get(options, (res) => {
                // 定义一个空的Buffer对象，用于存放数据块
                let rawData = Buffer.from('');

                res.on('data', (chunk) => {
                    // 每次有数据块返回时，将其拼接到rawData中
                    rawData = Buffer.concat([rawData, chunk]);
                });

                res.on('end', () => {
                    // 计算图片数据块的md5值
                    const md5sum = crypto.createHash('md5');
                    md5sum.update(rawData);
                    const md5Img = md5sum.digest('hex');

                    const base64Img = rawData.toString('base64').replaceAll("\n", "");
                    Axios.post(webhookUrl, {
                        "msgtype": "image",
                        "image": {
                            "base64": base64Img,
                            "md5": md5Img
                        }
                    })
                });
            }).on('error', (err) => {
                console.error(err);
            });
        }
    }
})

app.listen(3003, () => {
    console.log("service is running 3003")
});