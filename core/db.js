const Sequelize = require('sequelize')
const { dbName, host, port, user, password } = require('../config/config').database

// 需要提前安装mysql驱动npm包mysql2
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  dialectOptions: {
    socketPath: '/tmp/mysql.sock' // 指定套接字文件路径
  },
  host,
  port,
  logging: (str) => {
    console.log(str)
  },
  timezone: '+08:00',
  define: {
    timestamps: true,
    paranoid: true,
    // 定义在table中的名字
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true
  }
})

sequelize.sync({
  force: false
})

module.exports = {
  sequelize
}
