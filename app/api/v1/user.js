const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')
const { User } = require('../../models/user')
const { success } = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/user'
})

router.post('/register', async (ctx, next) => {
  // 路径
  // 接收参数, 参数校验
  // 校验器中包含了await对promise求值导致校验器变成了异步函数，为了防止异步导致校验器失效，要加await变成同步
  const v = await new RegisterValidator().validate(ctx)

  const user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname')
  }
  const r = await User.create(user)
  
  // 可以借助工具函数的形式来抛出异常，也可以直接抛出异常来表示操作成功
  // throw new global.errs.Success(msg, errorCode)
  success()
  
})

module.exports = router

