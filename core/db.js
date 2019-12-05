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
    // console.log(str)
  },
  timezone: '+08:00',
  define: {
    timestamps: true,
    // 不从数据库中删除数据，而只是增加一个 deletedAt 标识当前时间
    // 属性只在启用 timestamps 时适用
    paranoid: true,
    // 定义在table中的名字
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    // 数据表中转换为下划线名称
    underscored: true
  }
})

sequelize.sync({
  force: false
})

module.exports = {
  sequelize
}
