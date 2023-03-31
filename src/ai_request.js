const { Configuration, OpenAIApi } = require('openai')
/** config */
const openAiConfig = require("./config/openAi")
const {
    AI_MODEL_ENUM
} = require("./utils/ai_model")


/** 图片生成机器人 */
const imageConfiguration = new Configuration(openAiConfig.image);
const iamgeOpenaiRobot = new OpenAIApi(imageConfiguration);


const requestAi = async (model, content) => {
    switch (model) {
        case AI_MODEL_ENUM.CHAT:
            const aiRes = await iamgeOpenaiRobot.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "system", "content": content }],
            })
            const respone = aiRes.data.choices.filter(choice => choice.finish_reason === "stop")
            return respone[0] ? respone[0].message.content : 'error'
        case AI_MODEL_ENUM.IMAGE:
            const aiImagesRes = await iamgeOpenaiRobot.createImage({
                prompt: content,
                n: 1,
                size: "512x512"
            })
            return aiImagesRes.data
        default:
            return "mode error"
    }
}

module.exports = {
    requestAi: requestAi
}