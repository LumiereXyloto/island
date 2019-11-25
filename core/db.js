const Sequelize = require('sequelize')
const { dbName, host, port, user, password } = require('../config/config').database

// 需要提前安装mysql驱动npm包mysql2
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: true,
  timezone: '+08:00',
  define: {

  }
})

module.exports = {
  db: sequelize
}
