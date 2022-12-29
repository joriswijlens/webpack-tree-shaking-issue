const { getErrorHandler } = require('../../../common/exception')
const { createLogger } = require('../../../common/log')
const log = createLogger('middleware/koa/exception')

/**
 * General exception handler.
 *
 */
module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    const errorHandler = getErrorHandler(ctx, err)
    if (errorHandler) {
      log.debug({ errorHandler }, 'Found handler for error')
      errorHandler.handle(ctx, err)
    } else {
      const cartId = ctx.request.header.cookie && ctx.request.header.cookie.cartId
      log.error({ cartId, err, ctx, oldMessage: 'Unexpected error' }, `${err.message}`)
      throw err
    }
  }
}
