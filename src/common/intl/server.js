import Backend from 'i18next-sync-fs-backend'

import path from 'path'

import { createLogger } from '../log'

const log = createLogger('intl/server')

const getI18nBackend = () => {
  const loadPath = path.join(process.cwd(), 'locales/{{lng}}/{{ns}}.json')
  const addPath = path.join(process.cwd(), 'locales/{{lng}}/{{ns}}.missing.json')
  log.trace({ loadPath, addPath }, 'Getting i18n backend')

  return {
    plugin: Backend,
    options: {
      loadPath,
      addPath
    }
  }
}

module.exports = { getI18nBackend }
