import CartSummary from './containers/CartSummaryContainer'
import createMakeStore from '../../store/configureStore'
import { withReduxComponent } from '../../../lib/ssr-redux'
import { withIntl } from '../../../common/intl/index'
import { hello } from '../../reducers/featureToggle'

import { combineReducers } from 'redux'

import settings from '../../reducers/settings'
import cart from '../../reducers/cart'

// this is the function that is failing
hello()

export const CartSummaryPage = (props) => {
  return withIntl(CartSummary, props)
}

const reducer = combineReducers({
  cart,
  settings
})

export const makeStore = createMakeStore(reducer)
export const ssrReduxConfig = {
  storeKey: 'SUMMARY_STORE_KEY'
}
export default { Component: withReduxComponent(makeStore, ssrReduxConfig)(CartSummaryPage) }
