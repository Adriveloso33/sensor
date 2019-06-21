import Immutable from 'immutable';
import thunk from 'redux-thunk';

import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router/immutable';

import { dumpLayoutToStorage, handleBodyClasses } from '../components/layout';
import rootReducer from '../reducers';
import history from './history';

const initialState = Immutable.Map();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer(history),
  initialState,
  composeEnhancer(applyMiddleware(routerMiddleware(history), thunk, handleBodyClasses, dumpLayoutToStorage))
);

window.store = store;

export default store;
