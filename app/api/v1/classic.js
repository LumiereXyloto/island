const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { Flow } = require('../../models/flow')
const { Art } = require('../../models/art')
const { ClassicValidator } = require('../../validators/validator')
const { Favor } = require('../../models/favor')

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

// 具体期刊点赞情况
router.get('/:type/:id/favor', new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  const art = await Art.getData(id, type)
  console.log(art)
  if (!art) {
    throw new global.errs.NotFound()
  }
  const like = await Favor.userLikeIt(id, type, ctx.auth.uid)
  ctx.body = {
    fav_nums: art.favNums,
    like_status: like
  }
})

// 所有喜欢
router.get('/favor', new Auth().m, async ctx => {
  const uid = ctx.auth.uid
  ctx.body = await Favor.getMyClassicFavors(uid)
})

module.exports = router