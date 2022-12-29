import checkout from './checkout'
import checkoutServer from './checkout/server'
import summary from './summary'
import summaryServer from './summary/server'
export default {
  checkout: {
    index: checkout,
    server: checkoutServer
  },
  summary: {
    index: summary,
    server: summaryServer
  },
}
