import React from 'react'
import { Provider } from 'react-redux'

import store from './store'

const withStoreProvider = Component => () => (
  <Provider store={store}>
    <Component />
  </Provider>
)

export default withStoreProvider
