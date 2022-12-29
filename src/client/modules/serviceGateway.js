import { objectToQueryParams } from '../../common/http'

const { createLogger } = require('../../common/log')
const log = createLogger('modules/gateways/serviceGateway')

/**
 * Gateway that communicates with nodejs from the browser.
 *
 * Fetches an API response and normalizes the result JSON according to schema.
 * This makes every API response have the same shape, regardless of how nested it was.
 **/
export const callApi = (options) => {
  return callApiResponse(options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        log.error({ res: response }, 'Error in response')
        return Promise.reject(json)
      }
      return json
    })
  )
}

export const callApiResponse = (options) => {
  const { settings, method, endpoint, params, body, headers } = options
  log.debug(options, 'Calling endpoint')

  const { api, format, lang } = settings
  let fullUrl = endpoint.indexOf(api) === -1 ? api + endpoint : endpoint
  const defaultRequestParameters = { format, lang }
  const requestParams = Object.assign({}, defaultRequestParameters, params)
  fullUrl = `${fullUrl}${objectToQueryParams(requestParams)}`

  return fetch(fullUrl, {
    method,
    body,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...headers
    }
  })
}
