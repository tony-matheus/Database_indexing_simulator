import Regex, { createTableSubRegex, testQuerie } from '../utils/Regex'
import Table from './Table';
import _ from 'lodash'
import { formatObjectToArray } from '../utils/fomart';

export default class Parser {

  constructor() {
    this.database = {}
    this.graph = {}
    this.uiGraph = []
    this.graphId = 1
  }

  clear = () => {
    this.graph = {}
    this.uiGraph = []
    this.graphId = 1
  }

  processSQL = (sql) => this.searchAction(this.format(sql))

  updateDatabase = (database) => {
    this.database = database
  }

  format = (sql) => {
    return Regex().map(r => r.exec(sql)).filter(el => el !== null)[0]
  }

  // label, id, step, target = ''

  removeSpaces = (str) => str.replace(' ', '')

  selectWithJoin = (options) => {
    this.addNode('Juntar Paginas da ' + options[9], this.graphId, {
      doWhat: 'getTable',
      tableName: this.removeSpaces(options[9])
    }, this.graphId + 2)
    this.graphId += 1

    this.addNode('Juntar Paginas da ' + options[11], this.graphId, {
      doWhat: 'getTable',
      tableName: this.removeSpaces(options[11])
    }, this.graphId + 1)
    this.graphId += 1

    this.addNode('MergeJoin: ' + options[11] + ', ' + options[9], this.graphId, {
      doWhat: 'doMergeJoin',
      tables: [options[9], options[11]],
      columns: [this.removeSpaces(options[10]), this.removeSpaces(options[12])],
      
    }, this.graphId + 1)
    this.graphId += 1
    options[13]==='where' && this.treatWhereCondition([options[14], options[15], options[16]], options[4])
    this.treatSelectCondition(this.removeSpaces(options[2]), options[4])
  }

  selectMultiTables = (tables) => {
    tables.map((name) => {
      const tableName = this.removeSpaces(name)
      this.addNode('Juntar Paginas da ' + tableName, this.graphId, {
        doWhat: 'getTable',
        tableName,
      }, tables.length +1)
      this.graphId += 1
    })
    this.addNode('União: ' + tables.join(',') , this.graphId, {
      doWhat: 'doUnion',
      tables
    }, this.graphId + 1)
    console.log(this.graphId)
    this.graphId += 1
  }



  searchAction = (options) => {
    if (options[6] === 'join' || options[6] === 'JOIN') {
      const query = {
        select: options[1],
        what: options[2],
        from: options[3],
        table_name1: options[4],
        left: options[5],
        join: options[6],
        table_name2 : options[7],
        on: options[8],
        table_name1on: options[9],
        column_table1: options[10],
        table_name2on: options[11],
        column_table2: options[12]
      }
    }
    switch (options[1].toLowerCase()) {
      case 'select':
        if (options[6] === 'join'){
          return this.selectWithJoin(options)
        }
        if (options[5] === 'where')
          return this.select({ which: options[2], table: options[4], where: [options[6], options[7], options[8]] })
        return this.select({ which: options[2], table: options[4] })
      case 'create table':
        return this.createTable({
          tableName: options[2],
          columns: options[3],
          primaryKeyColumn: options[5],
          foreignKey: options[7],
          tableReferences: options[8]
        })
      default:
        break
    }
  }

  createTable = ({ tableName, columns, primaryKeyColumn, foreignKey, tableReferences }) => {
    return new Table(tableName, this.getColumns(columns, primaryKeyColumn, tableName), primaryKeyColumn, foreignKey, tableReferences)
  }

  getColumns = (columns, primaryKeyColumn, tableName) => {
    columns = this.findTableColumns(columns)
    if (tableName !== 'dependentes') {
      return columns.filter(column => !primaryKeyColumn.trim().includes(column.name))
    }
    return columns
  }

  findTableColumns = (columns) => {
    columns = testQuerie(columns, createTableSubRegex)
    return this.turnRegexToColumnInfo(columns)
  }

  turnRegexToColumnInfo = (columns) =>
    columns.map(column =>
      ({
        name: column[1].trim(),
        type: column[2].trim(),
        amount: column[3].trim(),
        isNull: column[4].trim()
      })
    )

  
  select = ({ which, table, where = '' }) => {
    this.startSelect(which, table, where)
    return this.graph
  }

  // Search Processor

  startSelect = (fields, tableName, where = '') => 
    this.treatSelect(fields.toLowerCase().trim(), tableName, where)
  

  treatSelect = (fields, tableName, where) => {
    this.treatDataFromTable(tableName, where)
    where && this.treatWhereCondition(where, tableName)
    this.treatSelectCondition(fields, tableName)
  }

  treatDataFromTable = (tableName, where) => {
    if (where && this.ifUseIndexSeek(where) || this.ifUseIndexScan(where)) return
    if (tableName.split(',').length>1) {
      return this.selectMultiTables(this.removeSpaces(tableName).split(','))
    }

    if(where && where[1] === '=' && this.isPrimaryKey(where[0])){
      this.addNode('Juntar Paginas da ' + tableName, this.graphId, {
        doWhat: 'getTableOrdered',
        tableName: this.removeSpaces(tableName),
      }, this.graphId + 1)
      this.graphId += 1
      return
    }
    this.addNode('Juntar Paginas da ' + tableName, this.graphId, {
      doWhat: 'getTable',
      tableName: this.removeSpaces(tableName),
    }, this.graphId + 1)
    this.graphId += 1
  }

  treatSelectCondition = (fields) => 
  this.addNode('Projeção', this.graphId, {
        doWhat: 'filterColumns',
        columns: this.filterSelectFields(fields),
      })

  ifUseIndexSeek = (where) =>  (where && where[0]==='matri') && where[1]==='=' && 'indexSeek'
  ifUseTableScanBinary = (where) =>  (where &&  where[0]==='cod_dep') && where[1]==='=' && 'tableScanBinary'
  ifUseIndexScan = (where) =>  (where && where[0]==='cod_dep') && where[1]==='>' && 'indexScan'

  getOperator = (where) => 
    this.ifUseIndexSeek(where) || 
    this.ifUseTableScanBinary(where) ||
    this.ifUseIndexScan(where) || 
    'tableScan'

  treatWhereCondition = (where, tableName) => {
      this.addNode('filtrar as tuplas por ' + where.join(' '), this.graphId, {
        doWhat: 'treatWhere',
        where,
        operator: this.getOperator(where),
        tableName: this.removeSpaces(tableName),
      }, this.graphId + 1)
      this.graphId += 1
  }

  getPages = (tableName) => formatObjectToArray(this.database[tableName].disk.content)

  getTable = (pages) => {
    let table = []
    pages.map(page => Object.values(page.value.content).map(tuple => table.push(tuple)))
    return table
  }

  filterTableBySearch = (table, columns = ['salario', 'nome']) => {
    const keys = Object.keys(table[0])
    const differences = _.difference(keys, columns)
    return table.map(tuple => {
      differences.map(diff => { delete tuple[diff] })
      return tuple
    })
  }

  addNode = (label, id, step, target = '') => {
    this.graph[id.toString()] = { target: target.toString(), label, step }
    this.uiGraph.push({ [id]: { target: [target], label }, position: { x: 250, y: 70 * id } })
  }

  filterSelectFields = (fields) => fields.replace(' ', '').split(',').map(field => field)

  isPrimaryKey = (field) => ['matri', 'cod_dep'].includes(field.trim())
}
/*
select * from table
startSelect = (fields, table, hasWhere = false) => {
  if(fields.trim() === '*'){
    const arrayDePaginas = /pegar paginas da table/g // map

    const tabela = pegarTable(arrayDePaginas)

    if(!hasWhere)
      Verificr table
      switch
        case 'empregados'
          binaryScan
        case 'empregados'
          binaryScan
        case 'empregados'
          binaryScan
    else
      c

  }
 processar o a
}
*/
