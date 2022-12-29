import { createLogger } from './log'

const log = createLogger('modules/sourcing')
const CHECKOUT_ERROR = 'CheckoutError'
export const SOURCING_FATAL_ERROR = 'sourcingFatalError'
const WRONG_SOURCING_RESPONSE_ERROR = 'WrongSourcingResponseError'

const CHECKOUT_ERROR_MAPPING = {
  sourcingQuantity: 'SourcingError002',
  sourcingCombination: 'SourcingError003',
  sourcingDistance: 'SourcingError001',
  sourcingNoStock: 'SourcingError004',
  sourcingError: WRONG_SOURCING_RESPONSE_ERROR,
  offerNotFound: 'OfferInactive',
  [SOURCING_FATAL_ERROR]: WRONG_SOURCING_RESPONSE_ERROR
}

export const enhanceSourcingErrors = (errors) => {
  if (errors && errors.length && errors[0]?.type === CHECKOUT_ERROR) {
    return errors
  } else {
    return errors
  }
}

const convertCheckoutMessage = (message) => {
  const { code, ...rest } = message
  const props = sanitizeProps(rest)
  let convertedCode = CHECKOUT_ERROR_MAPPING[code]
  if (!convertedCode) {
    log.error({ message }, 'Checkout message with unknown code received')
    convertedCode = WRONG_SOURCING_RESPONSE_ERROR
  }
  return { type: CHECKOUT_ERROR, code: convertedCode, props }
}

const sanitizeProps = (props) =>
  Object.entries(props)
    .map(([k, v]) => [k, escapeHtml(v)])
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

const escapeHtml = (val) => {
  if (isString(val)) return escapeStr(val)
  if (Array.isArray(val)) return escapeArray(val)
  if (isObject(val)) return escapeObject(val)
  return val
}

const escapeStr = (val) => val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeArray = (val) => val.map(escapeHtml)
const escapeObject = (val) => sanitizeProps(val)

const isString = (val) => typeof val === 'string' || val instanceof String
const isObject = (val) => typeof val === 'object' && val !== null

