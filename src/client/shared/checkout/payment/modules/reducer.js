import { INIT_PAYMENT_METHOD, PAYMENT_METHOD_SELECT } from './actions'

// ------------------------------------
// Selectors
// ------------------------------------

export const getPaymentState = (state) => state.sections.payment

export const getPaymentMethod = (state) =>
  getPaymentState(state).paymentMethod || getDefaultPaymentMethod(state.settings.format || state.format)

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [INIT_PAYMENT_METHOD]: (state, action) => {
    return {
      ...state,
      paymentMethod: action.paymentMethod
    }
  },
  [PAYMENT_METHOD_SELECT]: (state, action) => {
    return {
      ...state,
      paymentMethod: action.paymentMethod
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}

export default function paymentReducer(state = { ...initialState }, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
