const { HttpException } = require('../core/http-exception')

// 全局异常捕获中间件
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    
    // 开发环境下，未知错误，在控制台输出进行调试
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment === 'dev'
    if ( isDev && !isHttpException ) {
      throw error
    }

    // 生产环境，已知错误
    if (isHttpException) {
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      // 未知错误
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