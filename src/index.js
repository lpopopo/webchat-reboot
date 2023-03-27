const Koa = require("koa")
const Router = require('@koa/router');
const { Configuration, OpenAIApi } = require('openai')
const Axios = require("axios")
const bodyParser = require('koa-bodyparser');
const xml2js = require("xml2js")
const { decryptData, encryptionData } = require("./utils/index")

/** config */
const openAiConfig = require("./config/openAi")
const { token } = require("./config/reboot")

const configuration = new Configuration(openAiConfig);

const router = new Router();
const openai = new OpenAIApi(configuration);
const app = new Koa();
const morgan = require('koa-morgan');
const fs = require("fs")

const accessLogStream = fs.createWriteStream(__dirname + '/access.log',
    { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))

app.use(bodyParser());
app.use(router.routes());

const AI_MODEL = ['chat', 'image']

router.post("/chat", async (ctx) => {
    const postData = ctx.request.body;
    const { webhookUrl, text, image, from } = postData
    if (AI_MODE.include(text.content.slice("@chat-robot".length).trim())) {

    }
    const aiRes = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": text.content.slice("@chat-robot".length) }],
    })
    aiRes.data.choices.forEach(choice => {
        if (choice.finish_reason === "stop") {
            Axios.post(webhookUrl, {
                "msgtype": "text",
                "text": {
                    "content": choice ? choice.message.content : 'error'
                }
            })
        }
    })
})

app.listen(3003, () => {
    console.log("service is running 3003")
});