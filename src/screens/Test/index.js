import React, { useState, useEffect, useMemo } from 'react'
import Parser from '../../struct/Parser'
import Disk from '../../struct/Disk'
import ReactFlow from 'react-flow-renderer'
import { formatObjectToArray } from '../../utils/fomart'

const Test = ({ }) => {
  const [search, setSearch] = useState('SELECT nome, salario from departamento')
  const [elements, setElements] = useState([
    { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
    { id: '3', data: { label: 'Node 3' }, position: { x: 300, y: 100 } },
    { id: 'e1-2', source: '2', target: '1', animated: true },
    { id: 'e1-3', source: '3', target: '1', animated: true }
  ])
  const [tables, setTables] = useState({
    departamento: {},
    empregados: {},
    dependentes: {}
  })

  const settings = {
    BUCKET_SIZE: 974,
    HASH_NUMBER: 479,
    NUMBER_MAX_PAGES: 200,
    PAGE_SIZE: 10
  }

  useEffect(() => {
    generateDepartaments()
    generateEmployers()
  }, [])

  useEffect(() => {
    parser.updateTable(tables)
  }, [tables])

  const parser = useMemo(() => new Parser(), [])

  const doSearch = () => {
    console.clear()
    const response = parser.processSQL(search)
    console.log(elements)
    setElements([...response.reverse()])
  }

  const onChange = (evt) => {
    setSearch(evt.target.value)
  }

  const generateDepartaments = () => {
    const departamentsTable = parser.processSQL(`
      create table departamento (
        cod_dep int not null,nome varchar(30) not null,
      constraint pk_dep
        primary key(cod_dep)
      )
    `)
    console.log(departamentsTable.newContent)
    const disk = new Disk(departamentsTable.newContent, settings, departamentsTable.primaryKey)
    // const departamentsPages = formatObjectToArray(departamentsDisk.content)
    // const departamentsBuckets = departamentsDisk.hash.buckets()
    // const departamentsOverflows = departamentsBuckets.flatMap(bucket => bucket.getOverflowBuckets())
    setTables({
      ...tables,
      departamento: {
        disk
      }
    })
  }

  const generateEmployers = () => {
    // const employersTable = parser.processSQL(`
    //   create table empregado (
    //     matri int not null,nome varchar(60) not null,salario decimal(16,2) not null, lotacao int not null,
    //     constraint pk_matri
    //       primary key(matri),
    //     constraint fk_lotacao
    //       foreign key(lotacao)
    //       references departamento
    //   )
    // `)
    // console.log(employersTable.newContent[0])

    // const disk = new Disk(employersTable.newContent, settings)
    // setTables({
    //   ...tables,
    //   empregados: {
    //     disk
    //   }
    // })
  }

  // const generateDependents = () => {

  // }

  return (
    <div>
      <input onChange={onChange} />
      <button onClick={() => doSearch()}>
        Teste
      </button>
      <ReactFlow elements={elements} style={{ width: '100%', height: '500px' }} />
    </div>
  )
}

export default Test
