import { formatObjectToArray } from "../utils/fomart"
import _ from 'lodash'
export default class QueryProcessor {
  constructor() {
    this.database = {}
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

  processNode = (node) => {
    console.log(node.label)
    const step = node.step
    this.processStep(step)
  }

  processStep = (step) => {
    // TODO: put an hasMultipleTables?
    const { doWhat, tableName } = step
    // return
    switch (doWhat) {
      case 'getPages':
        this.intermedResults.push(this.getPages(tableName))
        this.stepIndex += 1
        break
      case 'getTable':
        this.intermedResults.push(this.getTable(this.intermedResults[0]))
        this.stepIndex += 1
        // if ( + de uma tabela)
        break
      case 'getBuckets':

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

  getTable = (pages) => {
    let table = []
    pages.map(page => Object.values(page.value.content).map(tuple => table.push(tuple)))
    return table
  }
}
