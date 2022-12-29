import { RECEIVE_FEATURE_TOGGLES } from '../actions/featureToggle'

// ------------------------------------
// Selectors

export const getToggles = (state) => {
  return state.toggles || {}
}

export const hello = () => {
  console.log('test')
}

const featureToggleReducer = (state = {}, action = {}) => {
  const { type, toggles } = action

  switch (type) {
    case RECEIVE_FEATURE_TOGGLES:
      return {
        ...state,
        ...toggles
      }
    default:
      return state
  }
}

export default featureToggleReducer
