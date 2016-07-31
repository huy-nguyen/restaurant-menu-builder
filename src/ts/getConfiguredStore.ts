import {
  createStore,
  applyMiddleware,
  Middleware
} from 'redux';
import {
  IStoreState
} from './utils/Interfaces';
import {
  saveLocalState
} from './utils/localStorage';
import * as _ from 'lodash';
import * as createLogger from 'redux-logger';
import reducer from './reducers/reducer';
import thunk from 'redux-thunk';

export default function getConfiguredStore() {
  let middlewares: Middleware[];
  try {
    if (PRODUCTION) {
      middlewares = [thunk as Middleware];
    } else {
      // Add logger middleware in dev mode:
      middlewares = [thunk as Middleware, createLogger() as Middleware];
    }
  } catch(e) {
    if (e.name === 'ReferenceError') {
      console.log(e);
      console.log('Must define the value of PRODUCTION global variable in webpack config. Set to false for now.');
      middlewares = [thunk as Middleware, createLogger() as Middleware];
    } else {
      throw e;
    }
  }
  const enhancers = applyMiddleware(...middlewares);

  // Redux store:
  const store = createStore(
    reducer, {
      // Let the store start out with an empty list of items:
      items: undefined,
      fetchStatus: undefined
  }, enhancers)

  // Persist the state to `localStorage` whenever the state changes but not more
  // often than every 2 seconds:
  // store.subscribe(_.throttle((state: IStoreState) => {
  //   saveLocalState(state);
  // }, 2000));
  return store;
}
