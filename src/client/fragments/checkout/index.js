import CheckoutContainer from './containers/CheckoutContainer'
import createMakeStore from '../../store/configureStore'
import { withReduxComponent } from '../../../lib/ssr-redux'

import { combineReducers } from 'redux'

import settings from '../../reducers/settings'
import toggles from '../../reducers/featureToggle'
import ui from './modules/reducer'

// cannot remove any reducers
const reducer = combineReducers({
  settings,
  toggles,
  ui
})

export const makeStore = createMakeStore(reducer)
export const ssrReduxConfig = {
  storeKey: 'CHECKOUT_STORE_KEY'
}
// cannot remove withRedux..
export default { Component: withReduxComponent(makeStore, ssrReduxConfig)(CheckoutContainer) }
