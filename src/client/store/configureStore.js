import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import thunk from 'redux-thunk'
import api from '../middleware/api'
import callApiMiddleware from '../middleware/callApiMiddleware'
import gtm from '../middleware/gtm'

const createMakeStore = (reducer, options) => {
  const middleware = options && options.middleware ? options.middleware : [thunk, callApiMiddleware, api, gtm]
  return (initialState) => {
    return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))
  }
}

export default createMakeStore
