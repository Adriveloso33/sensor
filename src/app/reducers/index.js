import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import navigationReducer from '../components/navigation/navigationReducer';
import { layoutReducer } from '../components/layout';
import { userReducer } from '../components/user';

import authReducer from '../components/auth/auth_reducer';

import tabsReducer from '../components/tabs/tabsReducer';
import schedulerReducer from '../components/scheduler/schedulerReducer';
import mainFilterReducer from '../components/mainfilter/mainFilterReducer';
import sidebarReducer from '../components/sidebar/sidebarReducer';
import configDashboardReducer from '../components/config-dashboard/ConfigDashboardReducer';

const rootReducer = (history) => {
  return combineReducers({
    layout: layoutReducer,
    navigation: navigationReducer,
    user: userReducer,
    auth: authReducer,
    tabs: tabsReducer,
    scheduler: schedulerReducer,
    mainFilter: mainFilterReducer,
    sidebar: sidebarReducer,
    configDashboard: configDashboardReducer,
    router: connectRouter(history),
  });
};

export default rootReducer;
