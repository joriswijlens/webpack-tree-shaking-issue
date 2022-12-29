// even this comment cannot be deleted
/*
 * **** NOTICE ****
 * Most of the functions declared here are cart-related, so we should try to reduce the dependency of other fragments to
 * these functions and move it to src/client/fragments/cart. Same with the cart reducer of 'src/client/reducers/cart.js'
 *
 * If the dependency is inevitable: Is better to import the action from the cart module than placing it in a top-level
 * folder like this one.
 */
export const PICKUP_STORE_SELECTED = 'PICKUP_STORE_SELECTED'
export const ADD_SETTINGS = 'ADD_SETTINGS'
export const SET_DELIVERY_MODE = 'SET_DELIVERY_MODE'
export const SET_QUANTITY = 'SET_QUANTITY'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const STORE_SELECTED = 'STORE_SELECTED'
export const SELECT_MADE_TO_MEASURE_PRODUCT = 'SELECT_MADE_TO_MEASURE_PRODUCT'
export const OPEN_PICKUP_STORE_SELECTOR = 'OPEN_PICKUP_STORE_SELECTOR'
export const PRODUCT_QTY_CHANGED = 'PRODUCT_QTY_CHANGED'
export const DATALAYER_DELIVERY_MODE_UPDATED = 'DATALAYER_DELIVERY_MODE_UPDATED'
export const CART_LOADED = 'CART_LOADED'
export const APPLY_COUPON_SUCCESS = '@COUPON/APPLY_COUPON_SUCCESS'
export const RELEASE_COUPON_SUCCESS = '@COUPON/RELEASE_COUPON_SUCCESS'

// Adds the settings for the given request
export const addSettings = (requestState) => ({
  type: ADD_SETTINGS,
  settings: {
    format: requestState.format,
    lang: requestState.lang,
    prefix: requestState.prefix,
    isUserLoggedIn: requestState.isUserLoggedIn
  }
})

export const cartLoaded = () => {
  return {
    type: CART_LOADED
  }
}
