import { FILTER_LOAD_CONFIGDASHBOARD } from './ConfigDashboardActions';

const INITIAL_STATE = { filter: null };

export default function configDashboardReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FILTER_LOAD_CONFIGDASHBOARD:
      return {
        filter: action.filter
      };

    default:
      return state;
  }
}
