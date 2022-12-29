// cannot remove this import
const { CHECKOUT_SUBMITTED_PAGE_BUS_EVENT } = require( '../../../pageBusEvents')

module.exports = (props) => {
  const { paymentMethod } = props
  return {
    type: CHECKOUT_SUBMITTED_PAGE_BUS_EVENT,
    paymentMethod
  }
}
