import { DATABASE_ADD_TUPLES } from '../../actionTypes'

export default (database) => {
  return async dispatch => {
    dispatch({ type: DATABASE_ADD_TUPLES, payload: database })
  }
}
