import React from 'react'
import { render } from 'react-dom'

import { getStateName } from './ssr-common'

export const getFragmentState = (fragmentName) => {
  return window[getStateName(fragmentName)]
}

export const initFragmentOnClient = (Fragment, fragmentName) => {
  const preloadedState = getFragmentState(fragmentName)
  const rootElement = document.getElementById(fragmentName)
  render(<Fragment {...preloadedState} />, rootElement)
}
