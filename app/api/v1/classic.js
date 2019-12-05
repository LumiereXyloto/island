const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { Flow } = require('../../models/flow')
const { Art } = require('../../models/art')
// const { Favor } = require('../../model/favor')

const router = new Router({
  prefix: '/v1/classic'
})

// m是属性，所以不用加括号
// 找到最新期刊，index最大就是最新一期
router.get('/latest',new Auth().m, async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })
  const art = await Art.getData(flow.artId, flow.type)
  // const likeLatest = await Favor.userLikeIt(flow.artId, flow.type, ctx.auth.uid)
  // art.setDataValue('index', flow.index)
  // art.setDataValue('likeStatus', likeLatest)
  // 下面一句等同于art.dataValue.index = flow.index，为什么koa会知道去返回art.dataValue的序列化json呢
  // 是sequelize框架告诉koa去序列化art.dataValue的
  art.setDataValue('index', flow.index)
  ctx.body = art
})

module.exports = router