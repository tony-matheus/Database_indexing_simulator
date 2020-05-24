import React from 'react'
import { Router } from '@reach/router'
import Test from './screens/Test'
import Home from './screens/Home'
import withStoreProvider from './redux/withStoreProvider'

function App () {
  return (
    <div className='App'>
      <Router>
        <Test path='/' />
        <Home path='/Home' />
      </Router>
    </div>
  )
}

export default withStoreProvider(App)
