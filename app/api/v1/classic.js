const Router = require('koa-router')
const router = new Router()

router.get('/v1/book/latest', (ctx, next) => {
  const query = ctx.request.query

  if (!query) {
    const error = new Error('??')
    error.error_code = 10001
    throw error
  }
  ctx.body = {
    key: 'book'
  }
})

module.exports = router