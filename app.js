const Koa = require('koa')

const app = new Koa()


app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  const axios = require('axios')
  const res = await axios.get('http://7yue.pro')
  next()
  console.log(4)
})

app.listen(3000)
