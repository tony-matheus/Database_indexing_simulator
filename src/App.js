import React from 'react'
import { Router } from '@reach/router'
import Test from './screens/Test'

function App () {
  return (
    <div className='App'>
      <Router>
        <Test path='/' />
      </Router>
    </div>
  )
}

export default App
