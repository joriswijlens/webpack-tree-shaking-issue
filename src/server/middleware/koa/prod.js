/**
 * Koa middleware which wraps the given middleware
 * which should only be executed for non-development requests.
 */
module.exports = (middleware) => {
  return async (ctx, next) => {
    if (!ctx.url.includes('/_next') && !ctx.url.includes('/favicon')) await middleware(ctx, next)
    else await next()
  }
}
