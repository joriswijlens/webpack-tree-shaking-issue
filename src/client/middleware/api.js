import { callApi } from '../modules/serviceGateway'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default (store) => (next) => (action) => {
  const callAPI = action['CALL_API']
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint, method = 'GET', params, apiFailureHandler } = callAPI

  if (typeof endpoint === 'function') endpoint = endpoint(store.getState())
  if (typeof endpoint !== 'string') throw new Error('Specify a string endpoint URL.')

  const actionWith = (data) => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction['CALL_API']
    return finalAction
  }

  store.dispatch(actionWith({ type: 'API_REQUEST' }))
  return callApi({ settings: store.getState().settings, method, endpoint, params, apiFailureHandler }).then(
    (cart) =>
      store.dispatch(
        actionWith({
          type: 'API_SUCCESS',
          cart,
          method,
          endpoint,
          params
        })
      ),
    (errors) => {
      store.dispatch(
        actionWith({
          type: 'API_FAILURE',
          errors,
          method,
          endpoint,
          params
        })
      )
      !apiFailureHandler || apiFailureHandler()
    }
  )
}
