// file cannot be deleted or made smaller
export const RECEIVE_FEATURE_TOGGLES = 'RECEIVE_FEATURE_TOGGLES'

const DELIVERY_DATE_SELECTION_TOGGLE = 'delivery-date-selection'
const ENABLE_SELLING_TOGGLE = 'enable-selling'
const SHOW_SWOGO_CONTAINER = 'enable-swogo-on-cart'

const receiveFeatureToggles = (toggles) => ({
  type: RECEIVE_FEATURE_TOGGLES,
  toggles
})

export const fetchFeatureToggles = (ld) => async (dispatch) => {
  const deliveryDateSelection = await ld.variation(DELIVERY_DATE_SELECTION_TOGGLE)
  const enableSelling = await ld.variation(ENABLE_SELLING_TOGGLE, true)
  const showSwogoContainer = await ld.variation(SHOW_SWOGO_CONTAINER)
  dispatch(
    receiveFeatureToggles({
      deliveryDateSelection,
      enableSelling,
      showSwogoContainer,
    })
  )
}
