import { DATABASE_ADD_TUPLES } from '../actionTypes'

const initialState = {
  tables: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case DATABASE_ADD_TUPLES: {
      return {
        ...state,
        tables: action.payload
      }
    }
    default:
      return state
  }
}
