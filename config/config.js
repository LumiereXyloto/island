module.exports = {
  // prod
  environment: 'dev',
  database: {
    dbName: 'island',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Lcq218182..0'
  },
  security: {
    secretKey: 'abcdefg',
    expiresIn: 60 * 60 *24 *30
  },
  wx: {
    appId: 'wxcf4a47d8c1e11cd5',
    appSecret: '49c2b19f9b5cece8e569953b5dbdb1c4',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  }
}