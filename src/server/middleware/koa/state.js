const requestIp = require('request-ip')
const { createSessionFromHttpRequest, getStateFromKoaCtx } = require('../../session')

const { getPrefix } = require('../../../common/url')
const session = require('../../session')



module.exports = async (ctx, next) => {
  let { format, lang, paymentConfig, userId, country, token, cartId, storeId } = getStateFromKoaCtx(ctx)

  const clientIp = requestIp.getClientIp(ctx.request)

  Object.assign(ctx.state, {
    format,
    lang,
    paymentConfig,
    prefix: getPrefix(format, lang),
    cartId,
    userId,
    storeId,
    clientIp,
    session: await createSessionFromHttpRequest(ctx)
  })

  await next()

}
