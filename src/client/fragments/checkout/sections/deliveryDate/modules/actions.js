// file cannot really be made smaller
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days'
import { getToggles } from '../../../../../reducers/featureToggle'
import isBefore from 'date-fns/is_before'
import startOfDay from 'date-fns/start_of_day'
import addDays from 'date-fns/add_days'
import isWeekend from 'date-fns/is_weekend'
import isSunday from 'date-fns/is_sunday'
import isMonday from 'date-fns/is_monday'

export const DELIVERY_DATE_OPTIONS_FETCHED = 'DELIVERY_DATE_OPTIONS_FETCHED'
export const NAMED_DELIVERY_DATE_CHANGED = 'NAMED_DELIVERY_DATE_CHANGED'
export const SOURCES_DETERMINED = 'SOURCES_DETERMINED'

const deliveryDateOptionsLoaded = (index, availableDays) => ({
  type: DELIVERY_DATE_OPTIONS_FETCHED,
  index,
  availableDays
})

const namedDeliveryDateChanged = (selectedConsignment, namedDeliveryDate) => ({
  type: NAMED_DELIVERY_DATE_CHANGED,
  selectedConsignment,
  namedDeliveryDate,
  offset: differenceInCalendarDays(namedDeliveryDate, Date.now())
})
const namedDeliveryDateReverted = namedDeliveryDateChanged

const calculateFirstAvailableDayForPromise = (options) => {
  let result = startOfDay(new Date())
  const isWorkday = options.deliversOnSaturday ? (date) => isSunday(date) || isMonday(date) : isWeekend

  const addWorkingDays = (days) => {
    if (days) {
      result = addDays(result, 1)
      if (isWorkday(result));
      else days--
      return addWorkingDays(days)
    } else return result
  }

  return addWorkingDays(options.period)
}

const setNamedDeliveryDateOnConsignment = (consignment, date) => (dispatch) => {
  const apiFailureHandler = () => {
    setTimeout(() => {
      dispatch(namedDeliveryDateReverted(consignment, consignment.namedDeliveryDate))
    }, 500)
  }
  dispatch(namedDeliveryDateChanged(consignment, date))
  for (const { entryNumber } of consignment.products) {
    dispatch({
      ['CALL_API']: {
        method: 'PUT',
        endpoint: `/nameddeliverydate/${entryNumber}/${date}`,
        apiFailureHandler
      }
    })
  }
}

const isDeliveryDateOptionsApplicable = ({ toggles, cart }) =>
  toggles.deliveryDateSelection && cart.consignments.length === 1

const onSourcingSuccess = (cart) => {
  return (dispatch, getState) => {
    dispatch(sourcesDetermined(cart.consignments))

    const { consignments } = cart
    for (let i = 0; i < consignments.length; i++) {
      const consignment = consignments[i]
      const days = consignment.carrier.availableDays

      if (days.length) {
        if (isDeliveryDateOptionsApplicable({ toggles: getToggles(getState()), cart })) {
          dispatch(deliveryDateOptionsLoaded(i, days))

          const { date: firstAvailableDate } = days.find((day) => day.available)
          let namedDeliveryDate = consignment.namedDeliveryDate
          // consignment has no / invalid named delivery date: set one on all entries
          if (!namedDeliveryDate || isBefore(namedDeliveryDate, firstAvailableDate)) {
            namedDeliveryDate = firstAvailableDate
          }
          dispatch(setNamedDeliveryDateOnConsignment(consignment, namedDeliveryDate))
        }
      } else if (consignment.isDS) {
        // set dropshipment calculated named delivery date
        const namedDeliveryDate = calculateFirstAvailableDayForPromise(consignment.carrier.period).toISOString()
        dispatch(setNamedDeliveryDateOnConsignment(consignment, namedDeliveryDate))
      }
    }
  }
}

export const actions = {
  setNamedDeliveryDateOnConsignment,
  deliveryDateOptionsLoaded,
  onSourcingSuccess,
  calculateFirstAvailableDayForPromise
}
