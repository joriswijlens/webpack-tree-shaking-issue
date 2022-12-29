const { getI18nBackend } = require('../../../common/intl/server')
/**
 * Initialize i18n middleware.
 *
 */
module.exports = async (ctx, next) => {
  ctx.state.i18nBackend = getI18nBackend()
  await next()
}
