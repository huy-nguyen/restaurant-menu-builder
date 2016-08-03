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

declare var process: any;

export default function getConfiguredStore() {
  let middlewares: Middleware[];
  try {
    if (process.env.NODE_ENV === 'development') {
      // Add logger middleware in dev mode only:
      middlewares = [thunk as Middleware, createLogger() as Middleware];
    } else {
      middlewares = [thunk as Middleware];
    }
  } catch(e) {
    if (e.name === 'ReferenceError') {
      console.log(e);
      console.log('Must define the value of process.env.NODE_ENV global variable in webpack config. Treat as "development" for now.');
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
