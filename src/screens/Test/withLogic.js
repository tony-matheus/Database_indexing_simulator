import React, { useMemo, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Parser from '../../struct/Parser'
import QueryProcessor from '../../struct/QueryProcessor'
import Disk from '../../struct/Disk'
import { saveDatabase } from '../../redux/actions/database'
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
  const parser = useMemo(() => new Parser(), [])
  const queryProcessor = useMemo(() => new QueryProcessor(), [])
  const [search, setSearch] = useState('SELECT * from departamento left join empregado on departamento.cod_dep = empregado.lotacao')
  const [elements, setElements] = useState([])
  const [intermediateResults, setIntermediateResults] = useState([])

  const [tables, setTables] = useState({
    departamento: {},
    empregado: {},
    dependente: {}
  })
  const [settings, setSettings] = useState({
    BUCKET_SIZE: 10,
    HASH_NUMBER: 479,
    NUMBER_MAX_PAGES: 100,
    PAGE_SIZE: 1000
  })

  useEffect(() => {
    startSimulation()
  }, [])

  const startSimulation = () => {
    const departamento = generateDepartaments()
    const empregado = generateEmployers()
    const dependente = generateDependents()

    console.log(tables)
    console.log(settings)

    setTables({
      ...tables,
      departamento,
      empregado,
      dependente
    })
  }

  useEffect(() => {
    parser.updateDatabase(tables)
    queryProcessor.updateDatabase(tables)
    props.saveDatabase(tables)
  }, [tables])

  const clear = () => {
    parser.clear()
    queryProcessor.clear()
  }

  const doSearch = (mock = undefined) => {
    clear()
    try {
      parser.processSQL(mock || search)
      queryProcessor.processGraph(parser.graph, parser.operator)
      setIntermediateResults(queryProcessor.intermedResults)
      setElements([...getGraphLib(parser.uiGraph)])
    } catch (err) {
      console.log('-> err: ', err)
      alert('Consulta mal formada ou inválida, por favor verifique!')
    }
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
    const disk = new Disk(departamentsTable.newContent, settings, departamentsTable.primaryKey, departamentsTable.biggerPk)
    // const departamentsPages = formatObjectToArray(departamentsDisk.content)
    // const departamentsBuckets = departamentsDisk.hash.buckets()
    // const departamentsOverflows = departamentsBuckets.flatMap(bucket => bucket.getOverflowBuckets())
    return { disk }
  }

  const generateEmployers = () => {
    const employersTable = parser.processSQL(`
      create table empregado (
        matri int not null,nome varchar(60) not null,salario decimal(16,2) not null, lotacao int not null,
        constraint pk_matri
          primary key(matri),
        constraint fk_lotacao
          foreign key(lotacao)
          references departamento
      )
    `)

    const disk = new Disk(employersTable.newContent, settings, employersTable.primaryKey, employersTable.biggerPk)
    return { disk }
  }

  const generateDependents = () => {
    const dependentsTable = parser.processSQL(`
      create table dependentes (
        matri_resp int not null, nome varchar(30) not null,
      constraint pk
        primary key(matri_resp,nome),
      constraint fk
        foreign key(matri_resp)
        references empregado
      )
    `)

    const disk = new Disk(dependentsTable.newContent, settings, dependentsTable.primaryKey)
    return { disk }
  }

  const getGraphLib = (graph) => {
    let list = []
    list = translateGraphTolibNodes(graph)
    list = [...list, ...translateGraphTolibEdges(graph)]
    return list
  }

  const translateGraphTolibNodes = (graph) =>
    graph.map((node, index) => {
      const id = Object.keys(node)[0]
      return { id, data: { label: node[id].label, doWhat: node[id].doWhat }, position: { x: 250 * index, y: 5 } }
    })

  const translateGraphTolibEdges = (graph) => {
    const list = []
    graph.forEach((node, index) => {
      const id = Object.keys(node)[0]
      const target = node[id].target
      target.forEach((el, index) => {
        list.push({ id: `e${id}-${el}`, source: id, target: el.toString(), animated: true })
      })
    })
    return list.filter(item => item.target)
  }

  const changeRoute = () => {
    navigate('/Home')
  }
  return (
    <Component
      tables={tables}
      onChange={onChange}
      doSearch={doSearch}
      elements={elements}
      changeRoute={changeRoute}
      intermediateResults={intermediateResults}

      startSimulation={startSimulation}
      setSettings={setSettings}
      settings={settings}
      setSearch={setSearch}
      search={search}
    />
  )
})
