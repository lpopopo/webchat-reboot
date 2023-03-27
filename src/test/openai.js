const { Configuration, OpenAIApi } = require('openai')
const openAiConfig = require("../config/openAi")

const configuration = new Configuration(openAiConfig);

const openai = new OpenAIApi(configuration);

openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ "role": "user", "content": "写一个动滑轮 定滑轮的教案" }],
}).then(res => {
    console.log("res------->", res.data.choices.map(c => {
        console.log("message----->\n", c.message)
    }))
})