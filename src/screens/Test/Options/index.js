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
        onClick={() => changeSearch('select * from departamento')}
      >
        Table Scan Linear
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch('SELECT * from empregado where matri = 500')}
      >
        Table Scan Binary
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch()}
      >
        Table Scan Index Seek
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch()}
      >
        Table Scan Merge Join
      </Button>
      <Button
        color='secondary'
        variant='contained'
        onClick={() => changeSearch()}
      >
        Table Scan Index Scan
      </Button>
    </Container>
  )
}
export default Options
