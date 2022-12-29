const ENV_NAME_PRODUCTION = 'production'
const ENV_NAME_TEST = 'test'
const ENV_NAME_CI = 'CI'
export const ENV_NAME_DEVELOPMENT = 'development'

export const isDevelopment = () => {
  return process.env.NODE_ENV === ENV_NAME_DEVELOPMENT
}

export const isTest = () => {
  return process.env.NODE_ENV === ENV_NAME_TEST
}

export const isCi = () => {
  return process.env.NODE_ENV === ENV_NAME_CI
}
export const isProduction = () => {
  return process.env.NODE_ENV === ENV_NAME_PRODUCTION
}
