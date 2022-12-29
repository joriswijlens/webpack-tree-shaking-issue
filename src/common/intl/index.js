import React from 'react'
import { I18nextProvider, translate } from 'react-i18next'
import i18next from 'i18next'

import { isDevelopment } from '../environments'

// If I change this to import bug disappears
const { createLogger } = require('../log')
const log = createLogger('modules/intl')

const intlInstances = new Map()

/**
 * Initializes the main i18n from which the other will be cloned. If we had
 * transpilation on the server side this would probably best go the internationalization
 * module.
 */
const getIntlInstance = (options, backend) => {
  log.trace({ options }, 'Getting intl instance')
  const instanceKey = options.defaultNS + options.lng
  let instance = intlInstances.get(instanceKey)
  if (!instance) {
    log.trace({ options }, 'Creating intl instance')
    instance = i18next.createInstance()
    instance.use(backend.plugin)
    instance.toJSON = () => null
    intlInstances.set(instanceKey, instance)
    try {
      options.backend = backend.options
      instance.init(options)
    } catch (e) {
      throw new Error('Error creating intl instance')
    }
  }
  return instance
}

/**
 * Function that inits an i18n for the client side so it can be put on the I18nextProvider.
 * For react only fragments without redux it can be accessed directly.
 * Redux fragments use the withIntl that uses this to create the i18n.
 *
 * @param props
 * @returns {*}
 */
export const getIntlInstanceOnClient = (props) => {
  const { i18nOptions } = props
  let { i18n } = props
  if (!i18n) {
    i18n = i18next
    i18n.init(i18nOptions)
  }
  return i18n
}

export const getStore = (i18n, i18nLang) => {
  return {
    lang: i18n.services.resourceStore.data[i18nLang]
  }
}

const getOptions = (fragment, lng, options) => {
  const defaultOptions = {
    defaultNS: fragment,
    lng,
    fallbackLng: isDevelopment() ? 'dev' : 'nl',
    ns: getNameSpaces(fragment),
    fallbackNS: ['common'],
    // allow keys to be phrases having `:`, `.`
    nsSeparator: false,
    keySeparator: false,
    initImmediate: false,
    preload: [lng],
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase()
        return value
      }
    }
  }

  return Object.assign(defaultOptions, options)
}
/**
 * Function that can be used to initialize the internalisation properties on the server side.
 *
 * @param context the context that is passed to the getInitialProps of the server.js of a fragment.
 * @param fragment for determining i18n namespaces.
 * @param options additional options that will be added to the i18n options.
 * @returns {{i18nOptions: *, initialI18nStore: {lang}, i18n: any}}
 */
export const getInitialProps = (context, fragment, options = {}) => {
  const state = context.req?.state ? context.req.state : context.state

  const { lang, i18nBackend } = state
  if (!lang) {
    throw new Error('lang should be set on state by state middleware')
  }
  if (!i18nBackend) {
    throw new Error('i18nBackend should be set on state by i18n middleware')
  }

  const initialLanguage = lang.replace('_', '-')
  const i18nOptions = getOptions(fragment, initialLanguage, options)

  const i18n = getIntlInstance(i18nOptions, i18nBackend)
  if (!i18n) {
    throw new Error('No i18n instance returned')
  }

  const initialI18nStore = getStore(i18n, initialLanguage)
  if (!initialI18nStore) {
    throw new Error('Store not found')
  }

  return {
    i18n,
    initialI18nStore,
    i18nOptions
  }
}

const getNameSpaces = (fragment) => {
  const namespaces = ['common']
  namespaces.push(fragment)
  return namespaces
}

const withIntlNoRecreate = (Component, props) => {
  const { initialI18nStore, i18nOptions, i18n, ...componentProps } = props
  const ComponentWithTranslate = translate()(Component)
  return (
    <I18nextProvider initialI18nStore={initialI18nStore} initialLanguage={i18nOptions.lng} i18n={i18n}>
      <ComponentWithTranslate {...componentProps} />
    </I18nextProvider>
  )
}
/**
 * Higher order component that adds internationalization to the root components.
 * ATTENTION at the moment it does not pass any props to the passed component.
 *
 * @param Component to decorate with internationalization.
 * @param props Properties added to the provider component.
 * @returns {*} The decorated component
 */
export const withIntl = (Component, props) => {
  const i18n = getIntlInstanceOnClient(props)
  return withIntlNoRecreate(Component, { ...props, i18n })
}
