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
  const middlewares = [thunk as Middleware, createLogger() as Middleware];
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
