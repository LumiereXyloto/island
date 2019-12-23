const {
  sequelize
} = require('../../core/db')

const {
  Sequelize,
  Model,
  Op
} = require('sequelize')

const {
  Favor
} = require('./favor')

class HotBook extends Model {
  static async getAll() {
    const books = await HotBook.findAll({
      order: ['index'] // 正序不需要加DESC
    })

    const ids = books.map(book => book.id) // 得到所有图书的id
    const favors = await Favor.findAll({
      where: {
        artId: {
          [Op.in]: ids
        },
        type: 400
      },
      group: ['artId'], // 根据artId分组查询，如果不分组查询a多个用户点赞同一个那么artId-uid就会出现很多条记录，需要对artId对应点赞数分别统计
      attributes: ['artId', [Sequelize.fn('COUNT', '*'), 'count']] // 结果包含字段
    })

    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors)
    })

    return books
  }

  static _getEachBookStatus(book, favors) {
    let count = 0
    favors.forEach(favor => {
      if (favor.artId === book.id) {
        count = favor.get('count')
      }
    })
    book.setDataValue('favNums', count)
    return book
  }
}

HotBook.init({
  index: Sequelize.INTEGER,
  image: Sequelize.STRING,
  author: Sequelize.STRING,
  title: Sequelize.STRING
}, {
  sequelize,
  tableName: 'hot_book'
})

module.exports = {
  HotBook
}