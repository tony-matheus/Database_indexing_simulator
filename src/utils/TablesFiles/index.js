import { departaments } from './departaments'
import { employers } from './employers'
import { dependents } from './dependents'
import { getRandomTupleKey, shuffle, createTupleKeys, getRandomPageKey } from '../random'

const returnTableContent = (tableName, columns, pk, fk = '', tableReferences = '') => {
  // todo:
  /*
    criar um arquivo unico para pegar
    todos os dados usar formato de json
   */
  switch (tableName) {
    case 'departamento':
      return formatTuple(readTextFile(departaments), columns, pk)
    case 'empregado':
      return formatTuple(readTextFile(employers), columns, pk, fk, tableReferences)
    case 'dependentes':
      return formatTupleComposite(readTextFile(dependents), columns, pk, fk, tableReferences)
    default:
      return 'didn\'t work'
  }
}

export const readTextFile = (lines) => lines.split('\n')

// data name é o nome da informação que vai ta na tabela pq ainda n pensei em uma maneira boa pra fazer dinamico depedendo do numero
const formatTuple = (lines, columns, pk, fk = '', tableReferences) => {
  const tuples = []
  const keys = shuffle([...Array(lines.length).keys()])

  lines.map(line => {
    tuples.push({
      [pk]: keys.pop() + 1,
      ...setTupleColumnValue(columns, line.split('|'), fk, tableReferences)
    })
  })
  return { content: shuffle(tuples), biggerPk: lines.length }
}

const formatTupleComposite = (lines, columns, pk, fk = '', tableReferences) => {
  const tuples = []
  let biggerPk = 0
  lines.map(line => tuples.push({
    ...setTupleColumnCompositeValue(columns, line.split('|'), fk, tableReferences, pk)
  }))
  return { content: tuples }
}

const setTupleColumnCompositeValue = (columns, line, fk, tableReferences, pk) => {
  const foreignKey = generateForeignKey(tableReferences)
  return {
    [pk]: `${foreignKey}_${line[0]}`,
    [columns[0].name]: foreignKey,
    [columns[1].name]: line[0]
  }
}

const setTupleColumnValue = (columns, line, fk, tableReferences) => {
  const response = {}
  columns.map((column, index) => {
    response[column.name] = treatTypeValue(column.type, line[index])
    if (tableReferences) { response[`${tableReferences}_id`] = generateForeignKey(tableReferences) }
  })

  return response
}

const generateForeignKey = (tableRefences) => {
  // if (tableRefences.trim() === 'departamento') { }
  // return Math.floor((Math.random() * 10000) + 1)
  switch (tableRefences.trim()) {
    case 'departamento':
      return Math.floor((Math.random() * 20) + 1)
    case 'dependentes':
      return Math.floor((Math.random() * 3000) + 1)
    default:
      return Math.floor((Math.random() * 10000) + 1)
  }
}

const treatTypeValue = (type, value) => {
  switch (type) {
    case 'int':
      return parseInt(value)
    case 'varchar':
      return value
    case 'decimal':
      return parseFloat(value)
    default:
      break
  }
}

export default returnTableContent
