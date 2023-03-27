const AI_MODEL_ENUM = {
    "CHAT": 'chat',
    "IMAGE" : 'image'
}
const AI_MODEL = [AI_MODEL_ENUM.CHAT, AI_MODEL_ENUM.IMAGE]

const getModelStatus = (context) => {
    switch (context) {
        case AI_MODEL_ENUM.CHAT:
            return AI_MODEL_ENUM.CHAT;
        case AI_MODEL_ENUM.IMAGE:
            return AI_MODEL_ENUM.IMAGE;
        default:
            return AI_MODEL_ENUM.CHAT;
    }
}

module.exports = {
    AI_MODEL_ENUM,
    AI_MODEL,
    getModelStatus
}



