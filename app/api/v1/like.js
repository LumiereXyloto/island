const Router = require('koa-router')
const { success } = require('../../lib/helper')
const { LikeValidator } = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { Favor } = require('../../models/favor')

const router = new Router({
  prefix: '/v1/like'
})


router.post('/', new Auth().m, async ctx => {
  console.log(ctx.request.body)
  const v = await new LikeValidator().validate(ctx, {
    id: 'artId'
  })

  // uid在auth中间件放进了令牌，所以不用前端每次传了
  await Favor.like(v.get('body.artId'), v.get('body.type'), ctx.auth.uid)
  success()
})

router.post('/cancel', new Auth().m, async ctx => {
  const v = await new LikeValidator().validate(ctx, {
    id: 'artId'
  })

  await Favor.dislike(v.get('body.artId'), v.get('body.type'), ctx.auth.uid)
  success()
})

module.exports = router
