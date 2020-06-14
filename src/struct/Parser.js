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
      return console.log(options)
    }
    switch (options[1].toLowerCase()) {
      case 'select':
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
    if (where) {
      this.startSelect(which, table, where)
      // if( table === 'empregado' && where[0] === '>'){

      // }
      // function ler pages para pegar table
      // function pegar table
      // pegar a outra tabela
      // juntar as outras duas tabelas => table unica
      // percorrer a tabela e achar salario > 1000 => tabela unica menor
      // filtrar a tabela por nome e salario => retorno uma tabela com nome salario
      // empregado =>  filtro de tabela => resultado final?


      // look for another tables
      return console.log(`selecionar ${which} na tabela ${table} onde ${where[0]} for ${where[1]} que ${where[2]}`)
    }
    // select * from Table
    this.startSelect(which, table)
    return this.graph
  }

  // Search Processor

  startSelect = (fields, tableName, where = '') => {
    // this.graph = {}
    if (where) {
      return this.treatSelectWhere(fields, tableName, where)
    }

    return this.treatSimpleSelect(fields.toLowerCase().trim(), tableName)
  }

  treatSimpleSelect = (fields, tableName) => {
    this.treatDataFromTable(tableName)
    this.treatSelectCondition(fields, tableName)

    // select nome, salario from Empregado where salario > 1000
  }

  treatSelectWhere = (fields, tableName, where) => {
    this.treatDataFromTable(tableName, where)
    // if(this.hasAnotherTable()) { }
    this.treatWhereCondition(where, tableName)
    this.treatSelectCondition(fields, tableName)

  }

  treatDataFromTable = (tableName, where) => {
    if (where && where[1] === '=' && this.isPrimaryKey(where[0])) {
      this.addNode('Juntar Paginas da ' + tableName, this.graphId, {
        doWhat: 'getTableOrdered',
        tableName
      }, this.graphId + 1)
      this.graphId += 1
      return
    } else if (where && this.ifUseIndexSeek(where)) {
      this.addNode('Carregar buckets em memoria', this.graphId, {
        doWhat: 'getBuckets',
        tableName,
      }, this.graphId + 1)
      this.graphId += 1

      this.addNode('Buscar bucket', this.graphId, {
        doWhat: 'getBucket',
        key: where[2]
      }, this.graphId + 1)
      this.graphId += 1

      this.addNode('Pegar Pagina do(a) ' + tableName, this.graphId, {
        doWhat: 'getPage',
        tableName,
        key: where[2]
      }, this.graphId + 1)
      this.graphId += 1

    }
    this.addNode('Juntar Paginas da ' + tableName, this.graphId, {
      doWhat: 'getTable',
      tableName
    }, this.graphId + 1)
    this.graphId += 1
  }

  treatSelectCondition = (fields, tableName) => {
    if (fields.replace(' ', '') === '*' || fields === 'all') {
      return this.addNode('exibir resultado da consulta ', this.graphId, {
        doWhat: 'showResult',
        tableName
      })
    }
    const columns = this.filterSelectFields(fields)
    if (columns.length > 0) {
      return this.addNode('filtrar as colunas e retornar somente ' + columns.join(' '), this.graphId, {
        doWhat: 'filterColumns',
        columns,
        tableName
      })
    }
    console.log(this.filterSelectFields(fields))
  }

  ifUseIndexSeek = (where) => (where[0] === 'cod_dep' || where[0] === 'matri') && where[1] === '=' && 'indexSeek'

  getOperator = (where) => this.ifUseIndexSeek(where) || 'tableScan'

  treatWhereCondition = (where, tableName) => {
    if (where[1] === '=' && this.isPrimaryKey(where[0])) {
      this.addNode('filtrar as tuplas por ' + where.join(' '), this.graphId, {
        doWhat: 'treatWhereBinary',
        where,
        operator: this.getOperator(where),
        tableName
      }, this.graphId + 1)
      this.graphId += 1
    } else {
      this.addNode('filtrar as tuplas por ' + where.join(' '), this.graphId, {
        doWhat: 'treatWhere',
        where,
        operator: this.getOperator(where),
        tableName
      }, this.graphId + 1)
      this.graphId += 1
    }
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

  filterSelectFields = (fields) => fields.trim().split(',').map(field => field.trim())

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
