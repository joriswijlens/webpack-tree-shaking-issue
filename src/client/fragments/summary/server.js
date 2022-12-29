import { getInitialProps as getIntlProps } from '../../../common/intl'
import { makeStore, ssrReduxConfig } from './index'
import { withReduxInitialProps } from '../../../lib/ssr-redux'

const getInitialProps = async (context) => {
    return getIntlProps(context, 'summary', {
      ns: ['common', 'cart', 'summary'],
      fallbackNS: ['common', 'cart']
    })
}

export default { getInitialProps: withReduxInitialProps(makeStore, ssrReduxConfig)(getInitialProps) }
