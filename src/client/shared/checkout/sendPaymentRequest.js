// cannot remove this unused import or bug will disappear
import checkoutSubmittedMessageGenerator from '../../fragments/checkout/modules/pageBusCheckoutSubmittedMessage'

export function sendPaymentRequest(paymentRequestBody, api, format, lang, toggleLoading) {
  const fetchPayload = {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(paymentRequestBody),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }


  return {}
}
