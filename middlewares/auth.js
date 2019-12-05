const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')

class Auth {
  constructor(level) {
    // api级别
    this.level = level || 1
    Auth.USER = 8
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
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

      if (decode.scope < this.level) {
        errMsg = '权限不足'
        throw new global.errs.Forbidden(errMsg)
      }
      
      // token 合法 将uid,scope放在ctx中方便后面使用
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }

      // 触发后续中间件
      await next()
    }
  }
}

module.exports = {
  Auth
}