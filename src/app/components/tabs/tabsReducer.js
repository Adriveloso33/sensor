import {
  ADD_TAB,
  REMOVE_TAB,
  REMOVE_ALL,
  PIN_TAB,
  UNPIN_TAB,
  ACTIVE_TAB,
  RESET_TABS,
  DESACTIVE_TAB
} from './TabsActions';

const INITIAL_STATE = { items: [] };

export default function tabsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_TAB:
      return {
        items: state.items.concat(action.data)
      };

    case REMOVE_TAB:
      return {
        items: state.items.length != 1 ? state.items.filter((tab) => tab.id !== action.id) : state.items
      };

    case REMOVE_ALL: // REMOVE ALL EXCEPT PINNED TABS
      return {
        items: state.items.filter((tab) => tab.pin && tab.pin == true)
      };

    case PIN_TAB:
      return {
        items: state.items.map((tab) => {
          if (tab.id == action.id) {
            tab.pin = true;
          }
          return tab;
        })
      };

    case UNPIN_TAB:
      return {
        items: state.items.map((tab) => {
          if (tab.id == action.id) {
            tab.pin = false;
          }
          return tab;
        })
      };

    case ACTIVE_TAB:
      return {
        items: state.items.map((tab) => {
          if (tab.id == action.id) {
            tab.active = true;
          } else {
            tab.active = false;
          }
          return tab;
        })
      };

    case DESACTIVE_TAB:
      return {
        items: state.items.map((tab) => {
          if (tab.id == action.id) {
            tab.active = false;
          }
          return tab;
        })
      };

    case RESET_TABS: // CLOSE ALL REGARDLESS PIN STATE
      return INITIAL_STATE;

    default:
      return state;
  }
}
