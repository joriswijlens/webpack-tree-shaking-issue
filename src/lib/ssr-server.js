import React from 'react'
import reactServer from 'react-dom/server'
import { getStateName } from './ssr-common'
import { createLogger } from '../common/log'
import fs from 'fs'

const log = createLogger('ssr-server')

const scriptsCache = {}
const renderFragment = (html, preloadedState, fragmentName, bundleLocation, scripts) => {
  return `<html>
      <body>
        <div id="${fragmentName}">${html}</div>
        <script>
          window.${getStateName(fragmentName)} = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        ${scripts}
      </body>
     <html>`
}

export const addSsr = (server, route, assetPrefix) => {
  server.use(
    route.get('/fragments/:fragmentName', async (ctx, fragmentName) => {
      const req = ctx.request
      log.trace({ req, cartId: ctx.state.cartId, fragmentName }, `handle fragment request ${fragmentName}`)
      let fragment = null
      let serverFragment = null
      let scripts

      const fragmentsRegister = require('../client/fragments/register').default
      const fragmentsRegisterElement = fragmentsRegister[fragmentName]

      if (fragmentsRegisterElement) {
        fragment = fragmentsRegisterElement.index
        serverFragment = fragmentsRegisterElement.server
      }
      scripts = scriptsCache[fragmentName]
      if (scripts == null) {
        const contents = fs.readFileSync(`./dist/client/${fragmentName}-client-scripts.html`, { encoding: 'utf8' })
        scripts = contents.replace(/REPLACE_WITH_ASSET_PATH/g, assetPrefix)
        scriptsCache[fragmentName] = scripts
      }

      const props = serverFragment && serverFragment.getInitialProps ? await serverFragment.getInitialProps(ctx) : {}
      const html = reactServer.renderToString(<fragment.Component {...props} />)
      props.isServer = false
      ctx.body = renderFragment(html, props, fragmentName, assetPrefix, scripts)
    })
  )
}


