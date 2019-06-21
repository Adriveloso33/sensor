/**
 * Created by griga on 11/17/16.
 */

import { REQUEST_USER, USER_INFO, REMOVE_USER } from './ElementActions';

const INITIAL_STATE = { name: '', email: '', picture: '', roles: '' };

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
