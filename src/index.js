const Koa = require("koa")
const Router = require('@koa/router');
const Axios = require("axios")
const bodyParser = require('koa-bodyparser');

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
    if (AI_MODEL.includes(text.content.slice("@chat-robot".length).trim())) {
        model_status = getModelStatus(text.content.slice("@chat-robot".length).trim())
        await Axios.post(webhookUrl, {
            "msgtype": "text",
            "text": {
                "content": `已选择${model_status}模式`
            }
        })
        return
    } else {
        // 根据model 调用不同的openai 接口
        const respone =  await requestAi(model_status, text.content.slice("@chat-robot".length))
        if (model_status === AI_MODEL_ENUM.CHAT) {
            Axios.post(webhookUrl, {
                "msgtype": "markdown",
                "markdown": {
                    "content": respone
                }
            })
        } else {
            Axios.post(webhookUrl, {
                "msgtype": "markdown",
                "markdown": {
                    "content": `
                    [生成的图片链接](${respone[0].url})
                    `
                }
            })
        }
    }
    // const aiRes = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [{ "role": "user", "content": text.content.slice("@chat-robot".length) }],
    // })
    // aiRes.data.choices.forEach(choice => {
    //     if (choice.finish_reason === "stop") {
    //         Axios.post(webhookUrl, {
    //             "msgtype": "text",
    //             "text": {
    //                 "content": choice ? choice.message.content : 'error'
    //             }
    //         })
    //     }
    // })
})

app.listen(3003, () => {
    console.log("service is running 3003")
});