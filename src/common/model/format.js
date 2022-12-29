import { createNetherlands, createBelgium } from './country'

export const FORMAT_CODE_X = 'x'
export const FORMAT_CODE_Y = 'y'

export const isY = (formatCode) => {
  return formatCode === FORMAT_CODE_Y
}

export const isX = (formatCode) => {
  return formatCode === FORMAT_CODE_X
}

const createFormat = (props) => {
  if (props.code !== FORMAT_CODE_Y && props.code !== FORMAT_CODE_X) {
    throw new Error(`Format: ${props.code}, should be either ${FORMAT_CODE_X} or ${FORMAT_CODE_Y}`)
  }
  return Object.freeze({
    isX: () => isX(props.code),
    isY: () => isY(props.code),
    getCountry: () => (isX(props.code) ? createNetherlands() : createBelgium()),
    serialize: () => Object.freeze(props)
  })
}
export default createFormat
