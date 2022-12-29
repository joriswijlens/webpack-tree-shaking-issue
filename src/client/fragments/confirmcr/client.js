import 'whatwg-fetch'
import { initFragmentOnClient } from '../../../lib/ssr-client'
import fragment from './index'

const fragmentName = 'confirmcr'

initFragmentOnClient(fragment.Component, fragmentName)
