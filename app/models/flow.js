const {
  Sequelize,
  Model
} = require('sequelize')

const {
  sequelize
} = require('../../core/db')

class Flow extends Model {

}

Flow.init({
  index: Sequelize.INTEGER,
  artId: Sequelize.INTEGER,
  type: Sequelize.INTEGER // 100 movie; 200 music; 300 sentence; 400 book
}, {
  sequelize,
  tableName: 'flow'
})

module.exports = {
  Flow
}