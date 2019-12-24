const Router = require('koa-router')
const { Book } = require('../../models/book')
const {
  SearchValidator,
  PositiveIntegerValidator,
} = require('../../validators/validator')
const router = new Router({
  prefix: '/v1/book'
})

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

module.exports = router