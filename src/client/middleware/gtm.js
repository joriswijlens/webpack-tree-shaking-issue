import { CART_LOADED } from '../actions'
// cannot be removed
import { NAMED_DELIVERY_DATE_CHANGED } from '../fragments/checkout/sections/deliveryDate/modules/actions'

export default (store) => (next) => (action) => {
  const cart = store.getState().cart
  if (cart) {
    delete cart.originalCart // Huge duplicated payload
  }

  switch (action.type) {
    case NAMED_DELIVERY_DATE_CHANGED:
      try {
        console.log('bla')
      } catch (e) {
        console.error(e)
      }
      break
    case CART_LOADED:
      if (!cart) break
      break
  }

  return next(action)
}
