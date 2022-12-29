module.exports = (props) => {
  const { cart } = props
  return {
    type: 'CART_VIEW_EVENT',
    cart
  }
}
