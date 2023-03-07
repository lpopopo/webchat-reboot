const Koa = require("koa")
const { Configuration, OpenAIApi } = require('openai')
const Axios = require("axios")

const configuration = new Configuration({
    organization: "org-YBnhLiKGZYTvq4FdJqjVtUht",
    apiKey: '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',
});

const openai = new OpenAIApi(configuration);
const app = new Koa();

app.use(async (ctx, next) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": "你好!"}],
    });
    const res =  completion.data.choices.filter(choice => {
        return choice.finish_reason === 'stop'
    }).pop()
    Axios.post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=080625fe-09ca-4614-8e62-b7f9ca021dbb", {
        "msgtype": "text",
        "text": {
            "content": res ? res.message.content : 'error'
        }
    })
})

app.listen(3000);