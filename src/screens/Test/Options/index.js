import React from 'react'
import { Button } from '@material-ui/core'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  padding: 30px;
  flex-direction: column;
  & > * {
    margin-bottom: 15px;
  }
`

const Options = ({ setSearch, handleClose }) => {
  const changeSearch = (query) => {
    setSearch(query)
    handleClose()
  }
  return (
    <Container>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch('select * from dependente where matri_resp<50')}
      >
        Table Scan Linear
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch('select nome from departamento where cod_dep=4')}
      >
        Table Scan Binary
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch('select matri, nome from empregado where matri=500')}
      >
        Table Scan Index Seek
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch('select departamento.nome, empregado.salario from empregado left join departamento on empregado.lotacao = departamento.cod_dep where empregado.salario>5000')}
      >
        Table Scan Merge Join
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch('select cod_dep from departamento where cod_dep>15')}
      >
        Table Scan Index Scan
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch('select empregado.matri, departamento.nome from empregado, departamento where empregado.matri<30')}
      >
        Union
      </Button>
    </Container>
  )
}
export default Options
