import { Base64 } from 'js-base64'

import { enhanceSourcingErrors } from './sourcing'

import { getPrefix } from './url'

import { createLogger } from './log'


const log = createLogger('modules/exception')
const HYBRIS_ERROR_NAME = 'Hybris Error'
const ERRORS = 'ERRORS'
const BLOCKING = 'BLOCKING'
const NON_BLOCKING = 'NON_BLOCKING'
const INSUFFICIENT_STOCK_ERROR = 'InsufficientStockError'
const CAR_BACKEND_DOWN_ERROR = 'CARBackendDownError'
const WRONG_SOURCING_RESPONSE_ERROR = 'WrongSourcingResponseError'
const CHECKOUT_ERROR = 'CheckoutError'
const UNKNOWN_IDENTIFIER_ERROR = 'UnknownIdentifierError'
const INSUFFICIENT_POS_STOCK = 'InsufficientPosStock'
const POS_MISMATCH_ERROR = 'PosMismatchError'
const ORDER_AMOUNT_TOO_LOW = 'OrderAmountTooLow'
const ILLEGAL_ARGUMENT_ERROR = 'IllegalArgumentError'
const NUMBER_FORMAT_ERROR = 'NumberFormatError'
const DEFAULT_ERROR = 'DefaultError'
const CALL_API = 'Call API'
const SET_QUANTITY = 'SET_QUANTITY'

const createHybrisError = (error) => {
  let error_ = []
  if (error instanceof Array) {
    error_ = error
  } else {
    error_.push(error)
  }
  return { name: HYBRIS_ERROR_NAME, errors: error_ }
}

const createHybrisErrorForResponse = (properties, response, responseBody) => {
  const e = new Error(
    `${properties.method} ${properties.path} failed: ${response.statusCode} - ${response.statusMessage}`
  )
  const hybrisError = {
    ...e,
    name: HYBRIS_ERROR_NAME,
    status: response.statusCode,
    errors: responseBody.errors || [],
    stack: e.stack,
    message: e.message
  }

  log.info({ hybrisError }, 'Created hybris error')
  return hybrisError
}

const isHybrisException = (error) => {
  return error.name === HYBRIS_ERROR_NAME
}

const isCartNotFoundException = (e) => {
  if (isHybrisException(e)) {
    const firstError = e.errors && e.errors[0]
    return (
      !!firstError &&
      firstError.type === 'CartError' &&
      firstError.reason === 'notFound' &&
      firstError.subjectType === 'cart'
    )
  } else {
    return false
  }
}

const errorHandlers = [
  {
    id: '401Handler',
    canHandle: function (ctx, error) {
      return error.status === 401 || error.status === 403
    },
    handle: function (ctx, error) {
      const uri = `${getPrefix(ctx.state.format, ctx.state.lang)}/login?redirectUrl=${ctx.req.url}`
      log.info({ uri }, 'Handling auth error')
      ctx.status = 307
      ctx.redirect(uri)
    }
  },
  {
    id: 'HybrisErrorJsonHandler',
    canHandle: function (ctx, error) {
      return isHybrisException(error) && ctx.req.headers.accept === 'application/json'
    },
    handle: function (ctx, error) {
      log.info({ hybrisError: error }, 'Handling hybris error with json response')
      ctx.body = JSON.stringify(error.errors)
      ctx.status = 400
    }
  },
  {
    id: 'HybrisErrorRedirectHandler',
    canHandle: function (ctx, error) {
      return isHybrisException(error)
    },
    handle: function (ctx, error) {
      log.info({ hybrisError: error }, 'Handling hybris error with redirect')
      ctx.redirect(
        `${getPrefix(ctx.state.format, ctx.state.lang)}/cart?errors=${Base64.encodeURI(JSON.stringify(error.errors))}`
      )
    }
  },
  {
    id: 'VatResultErrorHandler',
    canHandle: function (ctx, error) {
      return error.vatResult
    },
    handle: function (ctx, error) {
      const vatResult = error.vatResult
      log.info({ vatResult }, 'Handling vat validation error')
      ctx.body = JSON.stringify([
        {
          message: error.vatResult.code,
          subject: 'vatID'
        }
      ])
      ctx.status = 400
    }
  }
]

const isExcludedUrl = (ctx) => {
  return !ctx.url.includes('payments/push')
}

const getErrorHandler = (ctx, error) => {
  if (isExcludedUrl(ctx)) {
    return errorHandlers.find((handler) => handler.canHandle(ctx, error))
  } else {
    return undefined
  }
}

// ------------------------------------
// Action creator
// ------------------------------------
const errors = (name, errors, cart) => ({
  type: getActionName(name),
  errors,
  cart
})

const getNotifications = (state, action) => {
  const errors = state.errors || action.errors

  const filterErrors = (errors) => {
    const errorsToFilterOut = [
      'JaloObjectNoLongerValidError',
      'CartEntryError',
      'ModelSavingError',
      'ModelRemovalError'
    ]
    return errors ? errors.filter((e) => !errorsToFilterOut.some((etfo) => e.type === etfo)) : errors
  }
  const filteredErrors = filterErrors(errors)
  const enhancedErrors = enhanceSourcingErrors(filteredErrors)
  return enhancedErrors ? convertErrorsToNotifications(enhancedErrors) : state.notifications
}

const convertErrorsToNotifications = (errors) =>
  errors.map((error) => ({
    message: getErrorMessage(error),
    arguments: getErrorArguments(error),
    type: isBlocking(error)
  }))

const getErrorMessage = (error) => {
  const type = error.type
  return type === CHECKOUT_ERROR ? error.code : type
}

const getErrorArguments = (error) => {
  const type = error.type
  switch (type) {
    case UNKNOWN_IDENTIFIER_ERROR:
      // return {productCode: error.message.replace(/\D+/g, '')}
      // we need to receive or look up productName from y5
      return { productName: '' }
    case INSUFFICIENT_STOCK_ERROR:
      // return {productCode: error.message.replace(/\D+/g, '')}
      // we need to receive or look up productName from y5
      return { productName: '' }
    case CAR_BACKEND_DOWN_ERROR:
      return {}
    case WRONG_SOURCING_RESPONSE_ERROR:
      return {}
    case CHECKOUT_ERROR: {
      return error.props
    }
    case INSUFFICIENT_POS_STOCK: {
      return error
    }
    case ORDER_AMOUNT_TOO_LOW: {
      const { type, ...others } = error
      return { ...others }
    }
    default:
      return { message: error.message }
  }
}

const isBlocking = (error) => {
  const type = error.type
  switch (type) {
    case UNKNOWN_IDENTIFIER_ERROR:
      return NON_BLOCKING
    case INSUFFICIENT_STOCK_ERROR:
      return BLOCKING
    case CAR_BACKEND_DOWN_ERROR:
      return NON_BLOCKING
    case WRONG_SOURCING_RESPONSE_ERROR:
      return NON_BLOCKING
    default:
      return NON_BLOCKING
  }
}

const getDelayedActions = (state, action) => {
  const errors = state.errors || action.errors
  const enhancedErrors = enhanceSourcingErrors(errors)
  const delayedActions = { list: [], confirm: false }

  if (enhancedErrors) {
    enhancedErrors.forEach((error) => {
      if (isMaximumExceededError(error)) {
        addDelayedSourcingAction(error, delayedActions.list)
      }
    })
  }
  delayedActions.confirm = delayedActions.list.length > 0

  if (errors?.some((e) => e.type === POS_MISMATCH_ERROR)) {
    delayedActions.list.push({ action: { type: 'OPEN_PICKUP_STORE_SELECTOR' } })
    delayedActions.confirm = !errors?.every((e) => e.type === POS_MISMATCH_ERROR)
  }

  return delayedActions
}

const addDelayedSourcingAction = (error, delayedActions) => {
  const entryNumber = error.entryNumber
  const maxq = parseInt(error.maxq)
  const quantity = parseInt(error.quantity)

  if (maxq < quantity) {
    if (maxq === 0) {
      delayedActions.push({
        action: {
          [CALL_API]: { method: 'DELETE', endpoint: `/entry/${entryNumber}` }
        }
      })
      delayedActions.push({ action: { type: 'DELETE_PRODUCT', entryNumber } })
    } else {
      delayedActions.push({
        action: {
          [CALL_API]: {
            method: 'PUT',
            endpoint: `/entry/${entryNumber}/${maxq}`
          }
        }
      })
      delayedActions.push({
        action: { type: SET_QUANTITY, entryNumber, quantity: maxq }
      })
    }
  }
}

const isMaximumExceededError = (error) =>
  (error.type === 'SourcingError' && error.number === '002') || error.type === INSUFFICIENT_POS_STOCK

const addErrorsActionHandler = (name, actionHandler) => {
  actionHandler[getActionName(name)] = (state, action) => {
    return Object.assign({}, state, {
      errors: action.errors
    })
  }
}

const getActionName = (name) => name + '/' + ERRORS

module.exports = {
  isCartNotFoundException,
  isHybrisException,
  getNotifications,
  getErrorHandler,
  createHybrisError,
  createHybrisErrorForResponse,
  errors,
  addErrorsActionHandler,
  getDelayedActions,
  BLOCKING,
  NON_BLOCKING,
  getActionName,
  INSUFFICIENT_STOCK_ERROR,
  CAR_BACKEND_DOWN_ERROR,
  WRONG_SOURCING_RESPONSE_ERROR,
  CHECKOUT_ERROR,
  UNKNOWN_IDENTIFIER_ERROR,
  ILLEGAL_ARGUMENT_ERROR,
  DEFAULT_ERROR,
  NUMBER_FORMAT_ERROR,
  INSUFFICIENT_POS_STOCK,
  POS_MISMATCH_ERROR,
  ORDER_AMOUNT_TOO_LOW,
  HYBRIS_ERROR_NAME
}
