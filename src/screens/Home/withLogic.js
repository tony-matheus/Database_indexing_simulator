import React, { useMemo, useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { saveDatabase } from '../../redux/actions/database'
import { formatObjectToArray } from '../../utils/fomart'
import { navigate } from '@reach/router'

const withConnect = Component => {
  const mapStateToProps = state => ({})
  const actions = {
    saveDatabase
  }

  return connect(
    mapStateToProps,
    actions
  )(Component)
}

export default Component => withConnect(props => {
  const tables = useSelector(state => state.database.tables)
  const [tablesInfo, setTableInfo] = useState({
    departamento: {
    }
  })
  const departamentTable = useMemo(() => tables.departamento, [])

  useEffect(() => {
    const data = treatTablesInfo()
    setTableInfo({
      ...tablesInfo,
      departamento: data
    })
  }, [tables])

  useEffect(() => {
    console.log(tablesInfo)
  }, [tablesInfo])

  const treatTablesInfo = (tableName = 'departamento') => {
    const pages = getPages(tables[tableName])
    const tuples = getAllTuples(pages)
    const buckets = tables[tableName].disk.hash.buckets()
    const overflows = buckets.flatMap(bucket => bucket.getOverflowBuckets())
    const response = {
      pages,
      tuples,
      buckets,
      overflows
    }
    console.log(response)
    return response
  }

  const getPages = (data) => formatObjectToArray(data.disk.content)

  const getAllTuples = (data) => {
    const response = []
    data.map(page => Object.values(page.value.content).map(tuple => response.push(tuple)))
    return response
  }

  return (
    <Component tables={tablesInfo} />
  )
})
