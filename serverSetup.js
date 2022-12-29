import 'babel-polyfill'
import route from 'koa-route'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'

import error from './src/server/middleware/koa/exception'
import prod from './src/server/middleware/koa/prod'
import state from './src/server/middleware/koa/state'
import i18n from './src/server/middleware/koa/i18n'

import { READINESS_PROBE_DELAY } from './constants'

import { addSsr } from './src/lib/ssr-server'


import { getAssetPrefix } from './src/server/assets'

import { createLogger } from './src/common/log'

const log = createLogger('serverSetup')

export const serverSetup = (server) => {
  server.silent = true

  // body parser
  server.use(
    koaBody({
      jsonLimit: '10kb',
      includeUnparsed: true
    })
  )

  server.use(error)
  server.use(prod(state))
  // add i18n
  server.use(prod(i18n))

  const assetPrefix = getAssetPrefix(server.port)
  addSsr(server, route, assetPrefix)
    server.use(koaStatic('./dist/client'))

  const serverPort = 3000
  return server.listen(serverPort, (err) => {
    if (err) throw err
  })
}

export const doServerSetup = (server) => {
  const _server = serverSetup(server)

  process.on('SIGTERM', () => {
    log.info('Got SIGTERM. Graceful shutdown initialized')
    setTimeout(() => {
      _server.close(process.exit)
    }, READINESS_PROBE_DELAY)
  })
}
