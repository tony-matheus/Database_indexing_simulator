import Regex, { createTableSubRegex, testQuerie } from '../utils/Regex'
import Table from './Table';
import _ from 'lodash'
import { formatObjectToArray } from '../utils/fomart';

export default class Parser {

  constructor() {
    this.database = {}
    this.graph = {
      6: { target: '2', label: 'Pegar Paginas de generico', step: 'hello', position: { x: 250, y: 70 * 10 } }
    }
    this.uiGraph = [
      { '6': { target: [2],  label: 'Pegar Paginas de generico', step: 'hello' }, position: { x: 250, y: 70 * 10 } }
    ]
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
    return new Table(tableName, this.getColumns(columns, primaryKeyColumn), primaryKeyColumn, foreignKey, tableReferences)
  }

  getColumns = (columns, primaryKeyColumn) => this.findTableColumns(columns).filter(column => !primaryKeyColumn.trim().includes(column.name))

  findTableColumns = (columns, ) => {
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
      if( table === 'empregado' && where[0] === '>'){

      }
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

  startSelect = (fields, tableName, hasWhere = false) => {
    // this.graph = {}
    if (hasWhere) {
    }

    return this.treatSimpleSelect(fields.toLowerCase().trim(), tableName)
  }

  treatSimpleSelect = (fields, tableName) => {
    let id = 1
    if (fields === '*' || fields === 'all') {
      this.addNode('Pegar Paginas da' + tableName, id, {
        doWhat: 'getPages',
        tableName
      }, id + 1)
      id += 1

      this.addNode('Juntar Paginas da' + tableName, id, {
        doWhat: 'getTable',
        tableName
      }, id + 1)
      id += 1

      this.addNode('exibir resultado da consulta', id, {
        doWhat: 'showResult',
        tableName
      })
      return
    }

    // select nome, salario from Empregado where salario > 1000
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
