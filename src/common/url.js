import { LANGUAGE_NL, LANGUAGE_NL_BE } from '../../constants'


import { FORMAT_CODE_Y, FORMAT_CODE_X, isX } from './model/format'


import { isDevelopment } from './environments'

import { remove as removeDiacritics } from 'diacritics'

const getContextPath = (format) => {
  switch (format) {
    case FORMAT_CODE_Y:
      return 'makers'
    case FORMAT_CODE_X:
    default:
      return 'voordemakers'
  }
}

/**
 *
 * @param {*} format
 * @param {*} lang
 */
const getPrefix = (format, lang) => {
  return getUrlPrefix(format, lang) + '/' + getContextPath(format)
}

/**
 *
 * @param {*} format
 * @param {*} lang
 */
const getUrlPrefix = (format, lang) => {
  if (!lang || lang === LANGUAGE_NL || isX(format)) return ''
  return `/${lang.slice(0, 2)}`
}

/**
 * Generate the Supplier URL
 * @param {*} param0
 */
const generateSupplierUrl = ({ format, lang, name }) => {
  name = name.toLowerCase()
  name = removeDiacritics(name)
  if (isX(format)) {
    return `/service/${name.replace(/\s/g, '')}`
  } else {
    name = name.replace(/\s/g, '-')
    const prefix = getUrlPrefix(format, lang)
    if (LANGUAGE_NL_BE === lang) {
      return `${prefix}/service/thuislevering-${name}`
    } else {
      return `${prefix}/service/livraison-a-domicile-${name}`
    }
  }
}

/**
 * Get the Domain Name
 * @param {*} format
 * @returns {string}
 */
const getDomainName = (format) => (isX(format) ? 'x' : 'y')

const getProtocol = () => {
  return isDevelopment() ? 'http' : 'https'
}

const getDomainUrl = (format) => {
  const domainName = getDomainName(format)
  return `${getProtocol()}://${domainName}`
}

/**
 * Get the checkout base URL
 * @param {*} ctx
 * @returns {string}
 */
function getCheckoutBaseUrl(ctx, isNew, isClickAndCollect) {
  const { format, lang } = ctx.state
  const baseUrl = `${getProtocol()}://${getDomainName(format)}${getPrefix(format, lang)}${getCheckoutPostfix(
    isNew,
    isClickAndCollect
  )}`
  return `${baseUrl}`
}

/**
 * @param {*} isNew
 * @param {*} isClickAndCollect
 * @returns {string} /checkout-cr, /checkout-new, /checkout
 */
const getCheckoutPostfix = (isNew, isClickAndCollect) => {
  if (isClickAndCollect) {
    return '/checkout-cr'
  } else {
    if (isNew) {
      return '/checkout-new'
    }
    return '/checkout'
  }
}

const getSummaryLoginUrl = (prefix, isNew, isClickAndCollect) => {
  const loginUrl =
    `${prefix}/login?redirectUrl=` + encodeURIComponent(`${prefix}${getCheckoutPostfix(isNew, isClickAndCollect)}`)
  return `${loginUrl}`
}

const getAddToCartUrl = ({ format, lang }) => {
  return `${getUrlPrefix(format, lang)}/cart/add/`
}

module.exports = {
  getPrefix,
  getUrlPrefix,
  generateSupplierUrl,
  getDomainName,
  getCheckoutBaseUrl,
  getCheckoutPostfix,
  getSummaryLoginUrl,
  getContextPath,
  getAddToCartUrl,
  getProtocol,
  getDomainUrl
}
