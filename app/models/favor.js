const { sequelize } = require('../../core/db')
const {
  Sequelize,
  Model
} = require('sequelize')
const {
  Art
} = require('./art')

class Favor extends Model {
  static async like(artId, type, uid) {
    // 1 添加记录
    // 2 fav_nums
    const favor = await Favor.findOne({
      where: {
        artId,
        type,
        uid
      }
    })
    // 记录存在，用户已经点过赞
    if (favor) {
      throw new global.errs.LikeError()
    }
    // 没有点过赞
    // 事务操作, 一定要return
    return sequelize.transaction(async t => {
      // 创建记录
      await Favor.create({
        artId,
        type,
        uid
      }, {
        transaction: t // t是回调函数中的t
      })
      // 得到点赞对象的记录，fav_nums加1
      const art = await Art.getData(artId, type, false)
      await art.increment('favNums', {
        by: 1,
        transaction: t
      })
    })
  }

  static async dislike(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        artId,
        type,
        uid
      }
    })
    if (!favor) {
      throw new global.errs.DislikeError()
    }
    return sequelize.transaction(async t => {
      await favor.destroy({
        force: true, // 物理删除，false软删除插入时间戳
        transaction: t
      })
      const art = await Art.getData(artId, type, false)
      await art.decrement('favNums', {
        by: 1,
        transaction: t
      })
    })
  }

  static async userLikeIt(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        uid,
        artId,
        type,
      }
    })
    return favor ? true : false
  }

  static async getMyClassicFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          [Op.not]: 400
        }
      }
    })
    if (!arts) {
      throw new global.errs.NotFound()
    }
    return await Art.getList(arts)
  }

  static async getBookFavor(bookId, uid) {
    const favorNums = await Favor.count({
      where: {
        artId: bookId,
        type: 400
      }
    })
    const myFavor = await Favor.findOne({
      where: {
        uid,
        artId: bookId,
        type: 400
      }
    })
    return {
      favNums: favorNums,
      likeStatus: myFavor ? 1 : 0
    }
  }
}

Favor.init({
  uid: Sequelize.INTEGER,
  artId: Sequelize.INTEGER,
  type: Sequelize.INTEGER
}, {
  sequelize,
  tableName: 'favor'
})

module.exports = {
  Favor
}