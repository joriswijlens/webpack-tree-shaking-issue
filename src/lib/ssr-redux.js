import React from 'react'
import { Provider } from 'react-redux'

const isServer = typeof window === 'undefined'
const DEFAULT_KEY = '__XXX_AXEDA_SSR_REDUX_STORE__'
const _debug = false

const initStore = ({ makeStore, initialState, ssrReduxConfig }) => {
  const { storeKey } = ssrReduxConfig

  const createStore = () =>
    makeStore(ssrReduxConfig.deserializeState(initialState), {
      ...ssrReduxConfig,
      isServer
    })

  if (isServer) return createStore()

  if (!window[storeKey]) {
    window[storeKey] = createStore()
  }

  return window[storeKey]
}

const createConfig = function (ssrReduxConfig) {
  return {
    storeKey: DEFAULT_KEY,
    debug: _debug,
    serializeState: (state) => state,
    deserializeState: (state) => state,
    ...ssrReduxConfig
  }
}

export const withReduxInitialProps = (makeStore, ssrReduxConfig = {}) => {
  ssrReduxConfig = createConfig(ssrReduxConfig)

  return (getInitialProps) => {
    const wrappedGetInitialProps = async (appCtx) => {
      if (!appCtx) throw new Error('No app context')

      const store = initStore({
        makeStore,
        ssrReduxConfig
      })

      appCtx.store = store
      appCtx.isServer = isServer

      const initialProps = await getInitialProps(appCtx)

      return {
        store,
        isServer,
        initialState: ssrReduxConfig.serializeState(store.getState()),
        initialProps
      }
    }
    return wrappedGetInitialProps
  }
}

export const withReduxComponent = (makeStore, ssrReduxConfig = {}) => {
  ssrReduxConfig = createConfig(ssrReduxConfig)

  return (Component) => {
    class ReduxComponent extends React.Component {
      constructor(props, context) {
        super(props, context)

        let { initialState, store } = props

        const hasStore = store && 'dispatch' in store && 'getState' in store

        store = hasStore
          ? store
          : initStore({
              makeStore,
              initialState,
              ssrReduxConfig
            })

        this.store = store
        if (ssrReduxConfig.listener) {
          ssrReduxConfig.listener(store.dispatch, store.getState)
        }
      }

      render() {
        // Remove store from properties
        const { store, initialProps, ...props } = this.props
        return (
          <Provider store={this.store}>
            <Component {...props} {...initialProps} />
          </Provider>
        )
      }
    }
    return ReduxComponent
  }
}
