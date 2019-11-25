const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager{
  static initCore(app) {
    // 入口方法，传入koa实例
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
    InitManager.loadConfig()
  }

  static loadConfig(path='') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }

  static initLoadRouters() {
    // path config
    // 自动注册api文件下的所有路由
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, { 
      visit: whenLoadModule
    })
    
    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }

  // 将所有异常类都放在global对象上，就不用每次使用都导入，但是这种方案不是很好
  static loadHttpException() {
    const errors = require('./http-exception')
    global.errs = errors

  }
}

module.exports = InitManager
