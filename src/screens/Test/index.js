import React, { useState } from 'react'
import withLogic from './withLogic'
import ReactFlow from 'react-flow-renderer'
import './styles.css'
import Table from '../../components/Table'
import { Button, ButtonGroup, Paper } from '@material-ui/core'

const Test = ({ onChange, doSearch, elements, changeRoute, intermediateResults }) => {
  const [currentInterResult, setCurrentInterResult] = useState(null)

  return (
    <Paper className='background'>
      <div className='info'>
        <Paper style={{ borderRadius: 30 }} className='flow-container'>
          <span className='title'>Gerenciador de Consultas:</span>
          <input className='input' onChange={onChange} onKeyDown={({ key }) => key === 'Enter' && doSearch()} />
          <div style={{ backgroundColor: 'white', borderRadius: 40, justifyContent: '' }}>
            <ReactFlow
              className='flow'
              elements={elements}
              onElementClick={node => setCurrentInterResult(intermediateResults[parseInt(node.id) - 1])}
            />
            {
              intermediateResults.length > 0 &&
                <Table data={intermediateResults[intermediateResults.length - 1]} />
            }
          </div>
        </Paper>
        {
          currentInterResult !== null &&
            <Paper style={{ borderRadius: 40 }} className='result-container'>
              <span className='title'>Passo intermediário:</span><br />
              <Table data={currentInterResult} />
            </Paper>
        }
      </div>
    </Paper>
  )

  // return (
  //   <div>
  //     <input onChange={onChange} />
  //     <button onClick={() => doSearch()}>
  //       Teste
  //     </button>
  //     <button onClick={() => doSearch('SELECT nome, salario from empregado where salario > 1000')}>
  //     Salário>1000
  //     </button>
  //     <button onClick={() => doSearch('SELECT * from empregado where matri=500')}>
  //     cod_dep=2
  //     </button>
  //     <button onClick={() => doSearch('SELECT * from departamento')}>
  //       All Departamentos
  //     </button>
  //     <button onClick={() => changeRoute()}>
  //       Home
  //     </button>
  //     <ReactFlow elements={elements} style={{ width: '100%', height: '500px' }} />
  //   </div>
  // )
}

export default withLogic(Test)
