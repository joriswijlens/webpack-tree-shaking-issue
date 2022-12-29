import { getInitialProps as getIntlProps } from '../../../common/intl'
import { withReduxInitialProps } from '../../../lib/ssr-redux'
import { makeStore, ssrReduxConfig } from './index'

const getInitialProps = async (context) => {
  return { ...getIntlProps(context, 'checkout') }
}

export default {
  getInitialProps: withReduxInitialProps(makeStore, ssrReduxConfig)(getInitialProps)
}
