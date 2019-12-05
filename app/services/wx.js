const util = require('util')
const axios = require('axios')
const {User} = require('../models/user')
const {generateToken} = require('../../core/util')
const { Auth } = require('../../middlewares/auth')

class WXManager {
  static async codeToToken(code) {
    const url = util.format(global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code)
    
    const result = await axios.get(url)
    console.log(result.data)
    // 网络原因请求失败
    if (result.status !== 200) {
      throw new global.errs.AuthFailed('openid获取失败')
    }
    
    // 返回200但是code无效
    const errcode = result.data.errcode
    const errmsg = result.data.errmsg
    if (errcode) {
      throw new global.errs.AuthFailed('openid获取失败:' + errmsg)
    }

    // code合法
    // 拿到openID生成档案
    let user = await User.getUserByOpenId(result.data.openid)
    if (!user) {
      user = await User.registerByOpenid(result.data.openid)
    }
    return generateToken(user.id, Auth.USER)
  }
}

module.exports = {
  WXManager
}