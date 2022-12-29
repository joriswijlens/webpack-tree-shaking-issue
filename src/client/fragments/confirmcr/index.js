import Section from './components/Section'
import createMakeStore from '../../store/configureStore'
import { withReduxComponent } from '../../../lib/ssr-redux'

import { combineReducers } from 'redux'

import settings from '../../reducers/settings'
import toggles from '../../reducers/featureToggle'
import ui from '../checkout/modules/reducer'

// cannot remove any reducers
const reducer = combineReducers({
  toggles,
  settings,
  ui
})

export const makeStore = createMakeStore(reducer)
export const ssrReduxConfig = {
  storeKey: 'CONFIRM_CR_STORE_KEY',
}
export default {
  // cannot remove withReduxComponent
  Component: withReduxComponent(makeStore, ssrReduxConfig)(Section)
}
