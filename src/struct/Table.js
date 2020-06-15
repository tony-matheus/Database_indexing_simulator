import { getTable } from '../utils/readFile'
import returnTableContent from '../utils/TablesFiles'

export default class Table {
  // esses parametros é so pra testar e n quebrar a tela de home atual
  constructor(tableName = 'departamens', columns = ['nome'], pk = 'cod_dep', fk = '', tableReferences = '') {
    this.content = getTable()
    this.getTableContent(tableName, columns, pk,  fk, tableReferences)
    this.columns = [pk, ...columns.map(column => column.name)]
    this.primaryKey = pk
    this.foreignKey = fk
  }

  getTableContent = (tableName, columns, pk,  fk, tableReferences) => {
  const { content, biggerPk } = returnTableContent(tableName, columns, pk, fk, tableReferences)
  this.newContent = content;
  this.biggerPk = biggerPk;
  }
}
