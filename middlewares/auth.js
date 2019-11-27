const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
  constructor() {

  }
  get m() {
    return async (ctx, next) => {
      const userToken = basicAuth(ctx.req)
      let errMsg = 'token不合法'
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbidden(errMsg)
      }
      try {
        // 校验失败会抛出错误
        var decode = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch (error) {
        // token不合法
        if (error.name === 'TokenExpiredError') {
          errMsg = 'token已过期'
        }
        throw new global.errs.Forbidden(errMsg)
        // token过期
      }
      
      // token 合法 将uid,scope放在ctx中方便后面使用
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }

      await next()
    }
  }
}

module.exports = {
  Auth
}