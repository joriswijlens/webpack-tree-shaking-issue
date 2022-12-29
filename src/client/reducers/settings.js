import { ADD_SETTINGS } from '../actions'
import { isX as isFormatCodeX } from '../../common/model/format'
import { isProduction } from '../../common/environments'

export const isX = (state) => isFormatCodeX(getFormatCode(state))
export const getFormatCode = (state) => state.settings.format
export const getLanguage = (state) => state.settings.lang

const settingsReducer = (
  state = {
    api: process.env.API_PATH,
    isProd: isProduction(),
    lang: 'nl',
    format: 'x'
  },
  action = {}
) => {
  const { type, settings } = action

  switch (type) {
    case ADD_SETTINGS:
      return Object.assign({}, state, settings)
    default:
      return state
  }
}

export default settingsReducer
