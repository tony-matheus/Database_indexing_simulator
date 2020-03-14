import { TABLE_ADD_TUPLES } from '../actionTypes'

const initialState = {
  tuples: []
}

export default function ( state = initialState, action) {
  switch(action.type) {
    case TABLE_ADD_TUPLES: {
      return {
        ...state,
        tuples: action.payload
      }
    }
    default:
      return state
  }
}
