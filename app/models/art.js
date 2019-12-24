// 期刊查询逻辑
const { flatten } = require('lodash')
const { Op } = require('sequelize')
const {
  Movie,
  Sentence,
  Music
} = require('./classic')

class Art {

  constructor(art_id, type) {
    this.art_id = art_id
    this.type = type
  }

  async getDetail(uid) {
    const { Favor } = require('./favor') //不能放在顶部，会造成循环导入
    // console.log(this.art_id, this.type, uid)
    const art = await Art.getData(this.art_id, this.type)
    if (!art) {
      throw new global.errs.NotFound()
    }
    const like = await Favor.userLikeIt(this.art_id, this.type, uid)
    return {
      art,
      like_status: like
    }
  }

  static async getData(artId, type) {
    let art = null
    const finder = {
      where: {
        id: artId
      }
    }
    switch (type) {
      case 100:
        art = await Movie.findOne(finder)
        break
      case 200:
        art = await Music.findOne(finder)
        break
      case 300:
        art = await Sentence.findOne(finder)
        break
      case 400:
        break
      default:
        break
    }
    return art
  }

  static async getList(artInfoList) {
    // 分三次in查询
    const artInfoObj = {
      100: [],
      200: [],
      300: []
    }
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.artId)
    }
    // 所有结果
    const arts = []
    for (let key in artInfoObj) {
      // key就是art的type，取得某种type的id数组
      const ids = artInfoObj[key]
      if (!ids.length) {
        continue
      }
      // 该种type的type,对象里面的key取得的type，是字符串，要转换
      key = parseInt(key)
      arts.push(await Art._getListByType(ids, key))
    }
    return flatten(arts)
  }

  static async _getListByType(ids, type) {
    let arts = []
    const finder = {
      where: {
        id: {
          [Op.in]: ids
        }
      }
    }
    switch (type) {
      case 100:
        arts = await Movie.findAll(finder)
        break
      case 200:
        arts = await Music.findAll(finder)
        break
      case 300:
        arts = await Sentence.findAll(finder)
        break
      case 400:
        break
      default:
        break
    }
    return arts
  }
}

module.exports = {
  Art
}