const Koa = require("koa")
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const router = new Router();
const app = new Koa();

app.use(bodyParser());
app.use(router.routes());

router.post("/chat", async (ctx) => {
    const postData = ctx.request.body;
    console.log("postData-------->", postData)

    ctx.body = 'ok'
    ctx.status = 200
})

app.listen(3003, () => {
    console.log("service is running 3003")
});







