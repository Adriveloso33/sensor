/**
 * Created by griga on 11/17/16.
 */

import { REQUEST_USER, USER_INFO, REMOVE_USER } from './UserActions';

const INITIAL_STATE = null;

export default function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_INFO:
      return action.data;
    case REMOVE_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
}
