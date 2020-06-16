import { formatObjectToArray } from "../utils/fomart"
import _ from 'lodash'
import fp from 'lodash/fp'
export default class QueryProcessor {
  constructor() {
    this.database = {}
    this.intermedResults = []
    this.stepIndex = 0
    this.processedNodes = []
  }

  clear = () => {
    this.intermedResults = []
    this.stepIndex = 0
    this.processedNodes = []
  }

  processGraph = (graph) => {
    const firstNode = Object.keys(graph)[0]
    this.startProcessGraph(graph, firstNode)
  }

  startProcessGraph = (graph, key) => {
    const anotherNode = this.thereIsAnotherEdge(graph, key, graph[key].target)
    if (anotherNode && anotherNode.length > 0) {
      anotherNode.map(node => {
        this.processNode(graph[node])
        this.processedNodes.push(node)
      })
    }
    if (!this.checkIfNodeIsProcessed(key)) {
      this.processNode(graph[key])
      this.processedNodes.push(key)
      if (graph[key].target !== '')
        return this.startProcessGraph(graph, graph[key].target)
    }
    return 'hello'
  }
  /*
  Examples:
  select * from departamento
  select nome from empregado 
  select departamento_nome from departamento, empregado
  select departamento_nome, empregado_salario from departamento, empregado where empregado_salario>8000
  select departamento_nome from departamento, empregado where empregado_matri=200
  select * from departamento where cod_dep=15
  select nome from empregado where matri=500
  select nome, matri from empregado where matri=200
  select * from departamento where cod_dep>5
  select * from empregado left join departamento on empregado.lotacao = departamento.cod_dep where empregado_salario>3000
  select departamento_nome, empregado_salario from empregado left join departamento on empregado.lotacao = departamento.cod_dep where empregado_salario>9000
  select empregado_matri, departamento_nome from empregado left join departamento on empregado.lotacao = departamento.cod_dep
  */


  checkIfNodeIsProcessed = (node) => this.processedNodes.filter(processedNode => processedNode === node).length > 0

  thereIsAnotherEdge = (graph, key) => {
    let anotherNodes = 0
    let nodesList = []
    Object.keys(graph).map(node => {
      if (graph[node].target === key) {
        anotherNodes++
        nodesList.push(node)
      }
    })

    if (anotherNodes >= 2)
      return _.difference(nodesList, this.processedNodes)
    return null
  }

  updateDatabase = (database) => {
    this.database = database
  }

  processNode = (node, operator) => {
    console.log(node.label)
    const step = node.step
    this.processStep(step, operator)
  }

  processStep = (step, operator) => {
    // TODO: put an hasMultipleTables?
    const { doWhat, tableName } = step
    let pages
    // return
    switch (doWhat) {
      case 'getBuckets':
        this.intermedResults.push(this.getBuckets(tableName))
        this.stepIndex += 1
        break
      case 'getBucket':
        this.intermedResults.push(this.getBucket(this.intermedResults[this.stepIndex - 1], step.key))
        this.stepIndex += 1
        break
      case 'getPages':
        this.intermedResults.push(this.getPages(tableName))
        this.stepIndex += 1
        break
      case 'getPage':
        this.intermedResults.push(this.getPage(tableName, this.intermedResults[this.stepIndex - 1]))
        this.stepIndex += 1
        break
      case 'getTable':
        console.log(this.database)
        pages = this.getPages(tableName.replace(' ', ''))
        this.intermedResults.push(this.getTable(pages))
        this.stepIndex += 1
        // if ( + de uma tabela)
        break
      case 'doUnion': 
        this.intermedResults.push(this.doUnion(step))
        this.stepIndex += 1
        break;
      case 'getTableOrdered':
        pages = this.getPages(tableName)
        const table = this.getTable(pages)
        this.intermedResults.push(table.sort(tuple => tuple['cod_dep']))
        this.stepIndex += 1
        break;
      case 'filterColumns':
        this.intermedResults.push(this.getSelectColumns(step.columns))
        this.stepIndex += 1
        break;
      case 'doMergeJoin':
        this.intermedResults.push(this.doMergeJoin(step))
        this.stepIndex += 1
        break;
      case 'treatWhere':
        if(step.where) {
          const whereTable = this[step.operator](step)
          this.intermedResults.push(Array.isArray(whereTable) ? whereTable : [whereTable])
        } else {
          this.intermedResults.push(this.intermedResults[this.intermedResults.length - 1])
        }
        this.stepIndex += 1
        break
      default:
        break
    }
  }
  /// extra function

  doMergeJoin = (step) => {
    const result = []
    for (var i in this.intermedResults[1]) {
      for (var j in this.intermedResults[0]) {
        if (this.intermedResults[1][i][step.columns[1]]===this.intermedResults[0][j][step.columns[0]]) {
          result.push({
            ...this.formatLine(this.intermedResults[1][i], step.tables[1]), 
            ...this.formatLine(this.intermedResults[0][j], step.tables[0])
          })
        }
      }
    }
    return result
    
  }

  formatLine = (line, name) => {
    const formatedTable = {}
    Object.keys(line).map(key=> {
      formatedTable[`${name}.${key}`] = line[key]
    })
    return formatedTable
  }
  
  doUnion = (step) => {
    const result = []
    for (var i in this.intermedResults[0]) {
      const formatedTable1 = {}
      Object.keys(this.intermedResults[0][i]).map(key=> {
        formatedTable1[`${step.tables[0].trim()}.${key}`] = this.intermedResults[0][i][key]
      })
      for (var j in  this.intermedResults[1]) {
        const formatedTable2 = {}
        Object.keys(this.intermedResults[1][j]).map(key=> {
          formatedTable2[`${step.tables[1].trim()}.${key}`] = this.intermedResults[1][j][key]
        })
        result.push({...formatedTable1, ...formatedTable2})
      }
    }

    return result
  }
  tableScanBinary = (step, start=0, end=this.intermedResults[this.stepIndex - 1].length -1) => {
    const table = this.intermedResults[this.stepIndex - 1]
    const field = step.where[0].trim()
    const value = parseInt(step.where[2].trim())

    if (start > end) return [];

    const mid = Math.floor((start + end) / 2);

    if (table[mid][field] === value) return table[mid];

    if (table[mid][field] > value)
      return this.tableScanBinary(step, start, mid - 1);

    return this.tableScanBinary(step, mid + 1, end);
  }

  getPages = (tableName) => formatObjectToArray(this.database[tableName].disk.content)

  getBuckets = (tableName) => Object.assign([], this.database[tableName].disk.hash.table)

  getBucket = (buckets, key) => {
    let tupleAddress
    buckets.map(bucket => {
      const address = bucket.get(key)
      if (address) {
        tupleAddress = address
      }
    })
    return tupleAddress
  }

  getPage = (tableName, tupleAddress) => {
    if (!tupleAddress) return []
    return [{ key: tupleAddress.pageKey, value: this.database[tableName].disk.content[tupleAddress.pageKey] }]
  }

  getTable = (pages) => {
    let table = []
    pages.map(page => Object.values(page.value.content).map(tuple => table.push(tuple)))
    return table
  }
  

  tableScan = (step) => {
    const table = this.intermedResults[this.stepIndex - 1]
    const [field, condition, testValue] = step.where
    let filteredTable = []
    table.map(tuple => {
      if (this.treatWhereConditon(tuple[field.trim()], condition, testValue))
        filteredTable.push(tuple)
    })
    return filteredTable
  }

  indexScan = (step) => {
    const start = parseInt(step.where[2])
    const { biggerPk, get } = this.database[step.tableName].disk
    const filteredTable = []
    for (var i=start+1 ; i<= biggerPk; i++) {
      const tuple = get(i)
      tuple && filteredTable.push(tuple)
    }
    return filteredTable
  }

  indexSeek = (step) => [this.database[step.tableName].disk.get(step.where[2])]

  treatWhereConditon = (value, condition, testValue) => {
    switch (condition) {
      case '>':
        return value > testValue
      case '<':
        return value < testValue
      case '=':
        return value = testValue
      default:
        return false
    }
  }

  getSelectColumns = (columns) => 
    (columns.length===1 && ['*', 'all'].includes(columns[0])) ? 
    this.intermedResults[this.intermedResults.length-1] :
    fp.map(fp.pick(columns.join(',').replace(' ', '').split(',')), this.intermedResults[this.intermedResults.length-1].slice());

}