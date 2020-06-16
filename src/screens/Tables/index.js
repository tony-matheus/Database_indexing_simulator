import React, { useState, useEffect } from 'react'
import Table from '../../components/Table'

import { Button, Paper } from '@material-ui/core'
import { formatObjectToArray } from '../../utils/fomart'
import {
  Container,
  HeaderWrapper,
  BodyWrapper
} from './styles'
const Tables = ({ tables }) => {
  const {
    departamento,
    empregado,
    dependente
  } = tables

  const [content, setContent] = useState([])

  const getContent = (table) => {
    if (Object.keys(table).length > 0) {
      const pages = formatObjectToArray(table.disk.content)
      const response = []
      pages.map(page => Object.values(page.value.content).map(tuple => response.push(tuple)))
      return setContent(response)
    }
  }

  useEffect(() => {
    selectTable('Empregados')
  }, [tables])

  const selectTable = (tableName) => {
    switch (tableName) {
      case 'Departamento':
        return getContent(departamento)
      case 'Empregados':
        return getContent(empregado)
      case 'Dependentes':
        return getContent(dependente)
      default:
        return getContent(dependente)
    }
  }

  return (
    <Container>
      <HeaderWrapper>
        <Button onClick={() => selectTable('Departamento')} variant='contained' color='primary'>
          Departamento
        </Button>
        <Button onClick={() => selectTable('Empregados')} variant='contained' color='primary'>
          Empregados
        </Button>
        <Button onClick={() => selectTable('Dependentes')} variant='contained' color='primary'>
          Dependentes
        </Button>
      </HeaderWrapper>
      <BodyWrapper>
        <Table data={content} shortContainer={false} />
      </BodyWrapper>
    </Container>

  )
}

export default Tables
