import { initFragmentOnClient } from '../../../lib/ssr-client'
import fragment from './index'

const fragmentName = 'summary'

initFragmentOnClient(fragment.Component, fragmentName)
