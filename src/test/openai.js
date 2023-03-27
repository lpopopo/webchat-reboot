const { Configuration, OpenAIApi } = require('openai')
const openAiConfig = require("../config/openAi")

const configuration = new Configuration(openAiConfig);

const openai = new OpenAIApi(configuration);

const imageConfig = {
    organization: "org-YBnhLiKGZYTvq4FdJqjVtUht",
    apiKey: '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',
}
const imageConfiguration = new Configuration(imageConfig);
const iamgeOpenai = new OpenAIApi(imageConfiguration);

iamgeOpenai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ "role": "user", "content": "你好" }],
}).then(res => {
    console.log("res------->", res.data.choices.map(c => {
        console.log("message----->\n", c.message)
    }))
})

iamgeOpenai.createImage({
    prompt: "一只猫咪",
    n: 1,
    size: "1024x1024"
}).then(res => console.log("res------>", res.data))