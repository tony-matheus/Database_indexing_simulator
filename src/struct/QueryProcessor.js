import { formatObjectToArray } from "../utils/fomart"

export default class QueryProcessor {
  constructor() {
    this.database = {}
    this.steps = []
    this.stepIndex = 0
  }

  processGraph = (graph) => {
    graph.map((node) => this.processNode(node))
  }


  updateDatabase = (database) => {
    this.database = database
  }

  processNode = (node) => {
    const id = Object.keys(node)[0]
    const step = node[id].step
    this.processStep(step)
  }

  processStep = (step) => {
    // TODO: put an hasMultipleTables?
    const { doWhat, tableName, } = step
    // return
    switch (doWhat) {
      case 'getPages':
        this.steps.push(this.getPages(tableName))
        this.stepIndex += 1
        break
      case 'getTable':
        this.steps.push(this.getTable(this.steps[0]))
        this.stepIndex += 1
        break
      case 'showResult':
        this.steps.push(this.steps[this.stepIndex - 1])
        break
      default:
        break
    }
  }

  getPages = (tableName) => formatObjectToArray(this.database[tableName].disk.content)

  getTable = (pages) => {
    let table = []
    pages.map(page => Object.values(page.value.content).map(tuple => table.push(tuple)))
    return table
  }
}
