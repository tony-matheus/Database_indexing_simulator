import React, { useState, useEffect } from 'react'
import withLogic from './withLogic'
import List, { TableList } from '../../components/List'

export const Home = ({ tables }) => {
  const [selected, setSelected] = useState('departamento')
  const [listData, setListData] = useState({
    typeData: 'pages',
    data: tables[selected].pages,
    selectFunction: tupleKey => {
      // setSearch('')
      // openModal(tupleKey, 'pages')
    }
  })

  useEffect(() => {
    setListData({
      typeData: 'pages',
      data: tables[selected].pages,
      selectFunction: tupleKey => {
        // setSearch('')
        // openModal(tupleKey, 'pages')
      }
    })
  }, [tables])
  return (
    <div>
      <List
        data={listData.data}
        typeData={listData.typeData}
      // onSelect={(key) => listData.selectFunction(key)}
      />
    </div>
  )
}

export default withLogic(Home)
