import { Logger } from 'pino'
import { ContextLogger } from './index'

export const getLogger = (baseLogger: Logger): ContextLogger => ({
  baseLogger: baseLogger,
  ...baseLogger,
  addContext: async () => {},
  getContext: () => {},
  updateContext: () => {},
  removeContext: () => {}
})

export default {
  getLogger
}
