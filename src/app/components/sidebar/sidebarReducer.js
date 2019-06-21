import { BLOCK_SIDEBAR, UNBLOCK_SIDEBAR } from './SidebarActions';

const INITIAL_STATE = { block: false };

export default function sidebarReducer(state = INITIAL_STATE, action) {
  const { type } = action || {};
  switch (type) {
    case BLOCK_SIDEBAR:
      return {
        block: true
      };

    case UNBLOCK_SIDEBAR:
      return {
        block: false
      };

    default:
      return state;
  }
}
