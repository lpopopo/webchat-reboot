const { Configuration, OpenAIApi } = require('openai')
/** config */
const openAiConfig = require("./config/openAi.json")
const {
    AI_MODEL_ENUM
} = require("./utils/ai_model")


const configuration = new Configuration(openAiConfig);
const OpenaiRobot = new OpenAIApi(configuration);


const requestAi = async (model, content) => {
    switch (model) {
        case AI_MODEL_ENUM.CHAT:
            const aiRes = await OpenaiRobot.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "user", "content": content }],
            })
            const respone = aiRes.data.choices.filter(choice => choice.finish_reason === "stop")
            return respone[0] ? respone[0].message.content : 'error'
        case AI_MODEL_ENUM.IMAGE:
            const aiImagesRes = await OpenaiRobot.createImage({
                prompt: content,
                n: 1,
                size: "512x512"
            })
            return aiImagesRes.data.data
        default:
            return "mode error"
    }
}

module.exports = {
    requestAi: requestAi
}