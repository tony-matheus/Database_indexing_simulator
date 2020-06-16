import React, { useState } from 'react'
import withLogic from './withLogic'
import DataForm from '../DataForm'
import ReactFlow from 'react-flow-renderer'
import './styles.css'
import { Drawer, Button as NewButton } from 'antd'
import Table from '../../components/Table'
import { Button, Paper } from '@material-ui/core'
import Tables from '../Tables'
import styled from 'styled-components'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import Options from './Options'

export const VisibleArea = styled.div`
  ${({ hide }) => hide && `
    display: none;
    & * {
      display: none;
    }
  `}

  height: auto;
  width: auto;
`

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
  align-items: center;
`

export const Input = styled.input`
  width: 80%;
  min-height: 40px;
  padding-left: 20px;
  background-color:#FAFAFA;
  border-radius: 60px;
  border-width: 1px;
`

const Test = ({ onChange, doSearch, elements, changeRoute, setSearch, search, intermediateResults, tables, startSimulation, settings, setSettings }) => {
  const [currentInterResult, setCurrentInterResult] = useState(null)
  const [hideTables, setHideTables] = useState(true)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isOptionsVisible, setIsOptionsVisible] = useState(true)

  const hideShowTables = () => {
    setHideTables(!hideTables)
  }

  return (
    <>
      <Drawer
        title='Formulário para nova Simulação'
        className='test mt loko'
        width={500}
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        footer={
          <div />
        }
      >
        <DataForm
          startSimulation={startSimulation}
          setSettings={setSettings}
          settings={settings}
          closeDrawer={() => setIsDrawerVisible(false)}
        />
      </Drawer>
      <Drawer
        title='Formulário para nova Simulação'
        className='test mt loko'
        width={500}
        visible={isOptionsVisible}
        onClose={() => setIsOptionsVisible(false)}
        footer={
          <div />
        }
      >
        <Options setSearch={setSearch} handleClose={() => setIsOptionsVisible(false)} />
      </Drawer>
      <Button
        onClick={() => setHideTables(!hideTables)}
        color='secondary'
        variant='contained'
        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}
      >
        {hideTables
          ? (
            <>
              <VisibilityOffIcon />
              Tabela Visivel
            </>

          )
          : (
            <>
              <VisibilityIcon />
              Tabela Invisivel
            </>
          )}
      </Button>
      <Button
        onClick={() => setIsDrawerVisible(true)}
        color='secondary'
        variant='contained'
        style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 10 }}
      >
        Abrir Form
      </Button>
      <Button
        onClick={() => setIsOptionsVisible(true)}
        color='secondary'
        variant='contained'
        style={{ position: 'absolute', top: '100px', right: '10px', zIndex: 10 }}
      >
        Abrir Opções
      </Button>
      {hideTables
        ? (
          <Paper className='background'>
            <div className='info'>
              <Paper style={{ borderRadius: 30 }} className='flow-container'>
                <span className='title'>Gerenciador de Consultas:</span>
                <InputWrapper>
                  <Input value={search} onChange={onChange} onKeyDown={({ key }) => key === 'Enter' && doSearch()} />
                  <Button
                    onClick={() => doSearch(!hideTables)}
                    color='secondary'
                    variant='contained'
                    style={{ maxHeight: 40 }}
                  >
                    Search
                  </Button>
                </InputWrapper>
                <div style={{ backgroundColor: 'white', borderRadius: 40, justifyContent: '' }}>
                  <ReactFlow
                    className='flow'
                    elements={elements}
                    onElementClick={node => setCurrentInterResult(intermediateResults[parseInt(node.id) - 1])}
                  />
                  {
                    intermediateResults.length > 0 && (
                      <Table data={intermediateResults[intermediateResults.length - 1]} />
                    )
                  }
                </div>
              </Paper>
              {
                currentInterResult !== null && (
                  <Paper style={{ borderRadius: 40 }} className='result-container'>
                    <span className='title'>Passo intermediário:</span><br />
                    <Table data={currentInterResult} />
                  </Paper>
                )
              }
            </div>
          </Paper>
        )
        : <Tables tables={tables} />}
    </>
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
