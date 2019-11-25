const { HttpException } = require('../core/http-exception')

// 全局异常捕获中间件
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 开发环境
    if ( global.config.environment === 'dev' ) {
      throw error
    }

    // 生产环境
    if (error instanceof HttpException) {
      // 如果是已知错误
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      ctx.body = {
        msg: 'unknown mistake',
        error_code: 999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError