// 期刊查询逻辑
const { flatten } = require('lodash')
const { Op } = require('sequelize')
const {
  Movie,
  Sentence,
  Music
} = require('./classic')

class Art {

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

  static async getDataScope(artId, type, useScope = true) {
    let art = null
    const finder = {
      where: {
        id: artId
      }
    }
    const scope = useScope ? 'bh' : null
    switch (type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder)
        break
      case 200:
        art = await Music.scope(scope).findOne(finder)
        break
      case 300:
        art = await Sentence.scope(scope).findOne(finder)
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
      // 取得某种type的id数组
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
    const scope = 'bh'
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findAll(finder)
        break
      case 200:
        arts = await Music.scope(scope).findAll(finder)
        break
      case 300:
        arts = await Sentence.scope(scope).findAll(finder)
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