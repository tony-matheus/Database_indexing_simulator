import React from 'react'
import withLogic from './withLogic'
import ReactFlow from 'react-flow-renderer'

const Test = ({ onChange, doSearch, elements, changeRoute }) => {
  return (
    <div>
      <input onChange={onChange} />
      <button onClick={() => doSearch()}>
        Teste
      </button>
      <button onClick={() => changeRoute()}>
        Home
      </button>
      <ReactFlow elements={elements} style={{ width: '100%', height: '500px' }} />
    </div>
  )
}

export default withLogic(Test)
