const { Configuration, OpenAIApi } = require('openai')
const openAiConfig = require("../config/openAi.json")

const url = require("url")
const https = require("https")

const configuration = new Configuration(openAiConfig);
const iamgeOpenai = new OpenAIApi(configuration);

// iamgeOpenai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{ "role": "user", "content": "你好" }],
// }).then(res => {
//     console.log("res------->", res.data.choices.map(c => {
//         console.log("message----->\n", c.message)
//     }))
// })

iamgeOpenai.createImage({
    prompt: "小仙女",
    n: 1,
    size: "1024x1024"
}).then(res => {
    const respone = res.data.data
    console.log("respone------>", respone)
    const parsedUrl = url.parse(respone[0].url);
    const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: 'GET'
    };
    https.get(options, (res) => {
        let rawData = Buffer.from('');

        res.on('data', (chunk) => {
            rawData = Buffer.concat([rawData, chunk]);
        });

        res.on('end', () => {
            // 计算图片数据块的md5值
            const md5sum = crypto.createHash('md5');
            md5sum.update(rawData);
            const md5Img = md5sum.digest('hex');

            const base64Img = rawData.toString('base64').replaceAll("\n", "");
            console.log("base64Img------>", base64Img)
            // Axios.post(webhookUrl, {
            //     "msgtype": "image",
            //     "image": {
            //         "base64": base64Img,
            //         "md5": md5Img
            //     }
            // })
        });
    }).on('error', (err) => {
        console.error(err);
    });
})