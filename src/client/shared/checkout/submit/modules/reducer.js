// ------------------------------------
// Selectors
// ------------------------------------
import { TOGGLE_LOADING } from './actions'
import { isY } from '../../../../../common/model/format'
import { LANGUAGE_FR } from '../../../../../../constants'
import { getUrlPrefix } from '../../../../../common/url'

export const getSubmitOrderState = (state) => state.sections.submitOrder

export const getLink = ({ format, lang }) => {
  if (isY(format)) {
    if (lang === LANGUAGE_FR || !lang)
      return `${getUrlPrefix(format, lang || LANGUAGE_FR)}/makers/foire-aux-questions-conditions-generales`
    else return `${getUrlPrefix(format, lang)}/makers/faq-algemene-verkoopsvoorwaarden`
  }
  return '/algemene-voorwaarden-thuiswinkel'
}

export const isLoading = (state) => getSubmitOrderState(state).loading

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TOGGLE_LOADING]: (state) => ({
    ...state,
    loading: !state.loading
  })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false
}

export default function submitOrderReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
