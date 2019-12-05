const Router = require('koa-router')
const { PositiveIntegerValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
  prefix: '/v1/classic'
})

// m是属性，所以不用加括号
router.get('/latest',new Auth(9).m, async (ctx, next) => {
  // const path = ctx.paramsß
  // const query = ctx.request.query
  // const headers = ctx.request.header
  // const body = ctx.request.body

  // const v = await new PositiveIntegerValidator().validate(ctx)
  // const id = v.get('path.id')
  ctx.body = {
    uid: ctx.auth.uid,
    scope: ctx.auth.scope
  }
})

module.exports = router