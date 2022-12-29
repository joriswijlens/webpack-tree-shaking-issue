
export const PAYMENT_METHOD_SELECT = '@@PAYMENT/PAYMENT_METHOD_SELECT'
export const INIT_PAYMENT_METHOD = '@@PAYMENT/INIT_PAYMENT_METHOD'

const saveUserPaymentMethod = (paymentMethod) => {
  if (paymentMethod.code === 'IDEAL_CODE') {
  } else {
  }
}

const loadUserPaymentMethod = () => {
  const paymentMethod = {}
  if (!paymentMethod.code) return
  if (paymentMethod.code === 'IDEAL_CODE') {
  }
  return paymentMethod
}

const selectPaymentMethod = (paymentMethod) => {
  saveUserPaymentMethod(paymentMethod)
  return {
    type: PAYMENT_METHOD_SELECT,
    paymentMethod
  }
}

const initPaymentMethod = () => (dispatch, getState) => {
  dispatch({
    type: INIT_PAYMENT_METHOD,
    format: getState().settings.format,
    paymentMethod: loadUserPaymentMethod()
  })
}

export const actions = { selectPaymentMethod, initPaymentMethod }
