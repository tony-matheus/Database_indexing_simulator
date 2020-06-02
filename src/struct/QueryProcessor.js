import { formatObjectToArray } from "../utils/fomart"
import _ from 'lodash'
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
    console.log(this.intermedResults)
  }

  startProcessGraph = (graph, key) => {
    const anotherNode = this.thereIsAnotherEdge(graph, key, graph[key].target)
    if (anotherNode && anotherNode.length > 0) {
      anotherNode.map(node => {
        this.processNode(graph[node])
        this.processedNodes.push(node)
      })
    }
    if(!this.checkIfNodeIsProcessed(key)){
      this.processNode(graph[key])
      this.processedNodes.push(key)
      if(graph[key].target !== '')
        return this.startProcessGraph(graph, graph[key].target)
    }
    return 'hello'
  }

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
        this.intermedResults.push(this.getTable(this.intermedResults[this.stepIndex - 1]))
        this.stepIndex += 1
        // if ( + de uma tabela)
        break
      case 'filterColumns':
        this.intermedResults.push(this.getSelectColumns(step.columns, this.intermedResults[this.stepIndex - 1]))
        this.stepIndex += 1
        break;
      case 'treatWhere': 
        console.log(step.operator)
        const whereTable = this[step.operator](this.intermedResults[this.stepIndex - 1], step.where)
        this.intermedResults.push(whereTable)
        this.stepIndex += 1
        break
      case 'showResult':
        this.intermedResults.push(this.intermedResults[this.stepIndex - 1])
        break
      default:
        break
    }
  }
 /// extra function
  getPages = (tableName) => formatObjectToArray(this.database[tableName].disk.content)

  getBuckets = (tableName) => Object.assign([], this.database[tableName].disk.hash.table)
  
  getBucket = (buckets, key) => {
    let tupleAddress
    buckets.map(bucket => {
      const address = bucket.get(key)
      if (address) {
        tupleAddress=address
      }
    })
    return tupleAddress
  }

  getPage = (tableName, tupleAddress) => {
    if (!tupleAddress) return []
    return [{ key: tupleAddress.pageKey, value: this.database[tableName].disk.content[tupleAddress.pageKey]}]
  }
  
  getTable = (pages) => {
    let table = []
    pages.map(page => Object.values(page.value.content).map(tuple => table.push(tuple)))
    return table
  }

  tableScan = (table, where) => {
    const [field, condition,  testValue] = where
    let filteredTable = []
    table.map(tuple => {
      if(this.treatWhereConditon(tuple[field.trim()], condition, testValue))
        filteredTable.push(tuple)
    })
    return filteredTable
  }

  indexSeek = (table, where) => [table.find(row=> row[where[0]] == where[2])]

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

  getSelectColumns = (columns, table) => {
    const keys = Object.keys(table[0])
    const differences = _.difference(keys, columns)
    return table.map(tuple => {
      let copyTuple = {}
      Object.assign(copyTuple, tuple)
      differences.map(diff => { delete copyTuple[diff] })
      return copyTuple
    })
  }
}
