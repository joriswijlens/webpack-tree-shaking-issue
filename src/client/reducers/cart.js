import {
  PICKUP_STORE_SELECTED,
  SET_DELIVERY_MODE,
  DELETE_PRODUCT,
  SET_QUANTITY,
  APPLY_COUPON_SUCCESS,
  RELEASE_COUPON_SUCCESS,
  SELECT_MADE_TO_MEASURE_PRODUCT,
  OPEN_PICKUP_STORE_SELECTOR
} from '../actions'

export const EMPTY_CART = {}

const hasEntries = (cart) => !!cart.entries.length


const apiSuccessReducer = (state, cart) => {
  // delivery mode state is managed in redux and not by server state
  const deliveryMode = state.deliveryMode
  return {
    ...state,
    deliveryMode
  }
}
const ACTION_HANDLERS = {
  ['API_SUCCESS']: (state, action) => apiSuccessReducer(state, action.cart),
  [APPLY_COUPON_SUCCESS]: (state, action) => apiSuccessReducer(state, action.response),
  [RELEASE_COUPON_SUCCESS]: (state, action) => {
    const newState = apiSuccessReducer(state, action.response)
    delete newState.appliedVouchers
    return newState
  },
  [SET_DELIVERY_MODE]: (state, action) => {
    const { deliveryMode } = action
    return {
      ...state,
      deliveryMode: {
        code: deliveryMode
      }
    }
  },
  [DELETE_PRODUCT]: (state, action) => {
    return {
      ...state,
    }
  },
  [SET_QUANTITY]: (state, action) => {
    const index = action.entryNumber
    const entries = state.entries
    return {
      ...state,
      entries: [
        ...entries.slice(0, index),
        {
          ...entries[index],
          quantity: action.quantity
        },
        ...entries.slice(index + 1)
      ]
    }
  },
  [PICKUP_STORE_SELECTED]: (state, action) => {
    return {
      ...state,
    }
  },
  [SELECT_MADE_TO_MEASURE_PRODUCT]: (state, action) => {
    return {
      ...state,
    }
  },
  [OPEN_PICKUP_STORE_SELECTOR]: (state, action) => {
    if (hasEntries(state)) {
    }
    return state
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = Object.assign({}, EMPTY_CART)
const cartReducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

export default cartReducer
