const url = require("url")

const testUrl = ''

const parsedUrl = url.parse(testUrl, true)

console.log("url query-------->", parsedUrl.query.key)