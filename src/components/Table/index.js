import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'

const useStyles = makeStyles({
  root: {
    alignSelf: 'center',
    width: '95%',
    margin: 'auto'

  },
  container: {
    height: 340
  }
})

export default function TableComponent ({ data, shortContainer = true }) {
  const rows = useMemo(() => {
    if (data) { return Array.isArray(data) ? data : [data] }
    return []
  }, [data])
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const columns = useMemo(() => {
    const formated = []

    if (rows.length > 0 && rows[0]) {
      Object.keys(rows[0]).map(key => {
        if (key === 'value') formated.push({ id: key, label: 'name' })
        if (typeof rows[0][key] === 'string' || typeof rows[0][key] === 'number') {
          formated.push({ id: key, label: key })
        }
      })
    }
    return formated
  }, [rows])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getContainerStyle = () => {
    if (shortContainer) {
      return {
        height: 340
      }
    }
    return {
      height: 600
    }
  }

  return (
    <Paper className={classes.root}>
      <TableContainer style={getContainerStyle()}>
        <Table stickyHeader aria-label='sticky table' style={{}}>
          <TableHead style={{}}>
            <TableRow style={{}}>
              {columns.map((column) => (
                !['departamento_id', 'matri_resp,nome'].includes(column.label) &&
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ borderRadius: 40 }}>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={index.toString()}>
                  {columns.map((column) => {
                    const value = column.id === 'value' ? row[column.id].name : row[column.id]
                    return !['departamento_id', 'matri_resp,nome'].includes(column.label) && (
                      <TableCell key={column.id} align={column.align}>
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 30, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
