// with deleting almost everything here the bug does not occur anymore
import { Base64 } from 'js-base64'
import { createLogger } from '../../../../common/log'
import { scrollElementIntoView } from '../../../utils/domScrollUtil'
// allthough not used cannot be removed
import { sendPaymentRequestdd } from '../../../shared/checkout/sendPaymentRequest'
import { SOURCING_FATAL_ERROR } from '../../../../common/sourcing'

const log = createLogger('client/fragments/checkout/modules')

export const SET_CHECKOUT_ERROR = 'SET_CHECKOUT_ERROR'
export const ADDRESS_UPDATED_AND_VALIDATED = '@@checkout/ADDRESS_UPDATED_AND_VALIDATED'

export const setCheckoutError = (error) => {
  return {
    type: SET_CHECKOUT_ERROR,
    error
  }
}

export const publishAddressDeterminedEvent = (userId, addressId, { format, lang, api }, cb) => {
  const event = {
    type: 'ADDRESS_DETERMINED',
    userId,
    addressId
  }
  return fetch(`${api}/addressdeterminedevents?format=${format}&lang=${lang}`, {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(event),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(async (response) => {
    let json = []
    try {
      json = await response.json()
    } catch (e) {
      log.error('Unsuccessful response, but no error definition')
    }

    let errorResponse
    if (response.ok) {
      if (!json.messages) {
        // success, no sourcing messages
        if (cb) cb(json)
        return true
      }
      errorResponse = json
    }

    if (response.status >= 400) {
      log.error({ status: response.status, payload: json }, 'Got error from addressdeterminedevents')
      errorResponse = {
        messages: [{ code: SOURCING_FATAL_ERROR }]
      }
    }

    if (errorResponse) {
      const errorParam = `?errors=${Base64.encodeURI(JSON.stringify(errorResponse))}`
      window.location.assign(`cart${errorParam}`)
      return false
    }
  })
}

const checkoutValidationErrorMessages = (props) => {
  if (!props.deliveryIsReady) {
    props.setCheckoutError({
      element: 'address',
      message: 'address not confirmed'
    })
    scrollElementIntoView('shipment_info_section')
    return true
  }

  if (!props.paymentIsReady) {
    props.setCheckoutError({
      element: 'payment',
      message: 'check your payment method'
    })
    scrollElementIntoView('payment_section')
    return true
  }
}

const handleSubmit = (props) => {
  return () => {
    if (checkoutValidationErrorMessages(props) === true) return

    props.toggleLoading()
    const { api, format, lang, userId, addressId, paymentRequestBody } = props
    return publishAddressDeterminedEvent(userId, addressId, { format, lang, api })
      .then((sourcingSucceeded) => {
        if (sourcingSucceeded) {
          return {}
        }
      })
      .catch(() => {
        props.toggleLoading()
      })
  }
}

// removing this will not occur bug
export const actions = { handleSubmit, setCheckoutError }
