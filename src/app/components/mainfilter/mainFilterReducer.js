import { SET_FILTER_DATA } from './MainFilterActions';

const INITIAL_STATE = {};

export default function mainFilterReducer(state = INITIAL_STATE, action) {
  const { type, data } = action;
  switch (type) {
    case SET_FILTER_DATA:
      return data;
    default:
      return state;
  }
}
