import { FORMAT_CODE_X } from '../common/model/format'

import { LANGUAGE_NL, VENDOR_MOBILE, VENDOR_DESKTOP } from '../../constants'

// used to search entity in user-agent header
const DEEP_LINK_SUPPORTED_SIGNATURE = 'DeepLinkSupported'

// header names
const USER_AGENT_HEADER = 'user-agent'

// cookie names
const COUNTRY_COOKIE_NAME = 'country'
const STORE_ID_COOKIE_NAME = 'storeId'
export const USER_ID_COOKIE_NAME = 'userid'
const TOKEN_COOKIE_NAME = 'token'


export const getUserId = (ctx) => {
  const userId = ctx.cookies.get(USER_ID_COOKIE_NAME)
  if (!userId) return null
  if (!userId.includes('@') && !userId.includes('%40')) return null

  return userId
}

export const getStateFromKoaCtx = (ctx) => {
  const { format = FORMAT_CODE_X, lang = LANGUAGE_NL, paymentConfig } = ctx.query
  const userId = getUserId(ctx)
  const country = ctx.cookies.get(COUNTRY_COOKIE_NAME)
  const token = ctx.cookies.get(TOKEN_COOKIE_NAME)
  const storeId = ctx.cookies.get(STORE_ID_COOKIE_NAME)
  return {
    format,
    lang,
    paymentConfig,
    userId,
    country,
    token,
    storeId
  }
}

export const createSessionFromHttpRequest = async (ctx) => {
  const { format, userId, lang, } = getStateFromKoaCtx(ctx)
  const vendor = getVendor(ctx)
  const rawSessionData = {
    lang,
    format,
    userId,
    vendor
  }
  return {
    ...rawSessionData,
  }
}

export const getVendor = (ctx) => {
  const userAgent = ctx.headers && ctx.headers[USER_AGENT_HEADER] ? ctx.headers[USER_AGENT_HEADER] : ''
  return userAgent.search(DEEP_LINK_SUPPORTED_SIGNATURE) >= 0 ? VENDOR_MOBILE : VENDOR_DESKTOP
}


