const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')

const router = new Router({
  prefix: '/v1/user'
})

router.post('/register', async (ctx, next) => {
  // 路径
  // 接收参数, 参数校验
  const v = new RegisterValidator().validate(ctx)
})

module.exports = router

