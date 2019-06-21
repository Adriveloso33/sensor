import { NAVIGATION_INIT, NAVIGATION_REFRESH } from './NavigationActions';

export default function navigationReducer(
  state = {
    items: []
  },
  action
) {
  switch (action.type) {
    case NAVIGATION_INIT:
      return {
        items: action.items
      };
    case NAVIGATION_REFRESH:
      return {
        refresh: action.refresh
      };
    default:
      return state;
  }
}
