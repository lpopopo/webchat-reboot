const jwt = require("jsonwebtoken")

const axios = require("axios")

const signature = jwt.encode(
    EncodingAESKey,
    {
        username: "some persone",
        userid: "alsjdasf12",
        avatar:
            "https://res.wx.qq.com/a/wx_fed/weixin_portal/res/static/img/1L3ryyg.png",
    },
    "HS256",
);