import { SET_CHECKOUT_ERROR, ADDRESS_UPDATED_AND_VALIDATED } from './actions'

// cannot remove this
const ACTION_HANDLERS = {
  [SET_CHECKOUT_ERROR]: (state, action) => {
    return {
      ...state,
      error: action.error
    }
  },
  [ADDRESS_UPDATED_AND_VALIDATED]: (state) => ({
    ...state,
    error: undefined
  })
}

const initialState = {}
export default (state = initialState, action) => state
