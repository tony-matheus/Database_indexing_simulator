import { TABLE_ADD_TUPLES } from '../../actionTypes'
import { getTable, readTextFile, formatTuple } from '../../../utils/readFile'
import { getRandomTupleKey, shuffle, createTupleKeys, getRandomPageKey }  from '../../../utils/random'
import _ from 'lodash'

export default () => {
  return async dispatch => {
    const words = readTextFile()
    const tuples = await _.shuffle( words.map(word => ({key: getRandomTupleKey(), value: word})))
    dispatch({type: TABLE_ADD_TUPLES, payload: tuples})
  }
}
