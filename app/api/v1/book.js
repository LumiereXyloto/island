const Router = require('koa-router')
const { Book } = require('../../models/book')
const { Favor } = require('../../models/favor')
const {
  SearchValidator,
  PositiveIntegerValidator,
} = require('../../validators/validator')
const router = new Router({
  prefix: '/v1/book'
})
const { Auth } = require('../../../middlewares/auth')

const { HotBook } = require('../../models/hot-book')

router.get('/hot_list', async ctx => {
  const books = await HotBook.getAll()
  ctx.body = books
})

router.get('/:id/detail', async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = await Book.detail(v.get('path.id'))
  ctx.body = book
})

router.get('/search', async ctx => {
  const v = await new SearchValidator().validate(ctx)
  const result = await Book.searchFromYuShu(
    v.get('query.q'), v.get('query.start'), v.get('query.count'))
  ctx.body = result
})

router.get('/favor/count', new Auth().m, async ctx => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {
    count
  }
})

// 获取书籍点赞情况
router.get('/:bookId/favor', new Auth().m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'bookId'
  })
  const favor = await Favor.getBookFavor(
    ctx.auth.uid, v.get('path.bookId'))
  ctx.body = favor
})

module.exports = router