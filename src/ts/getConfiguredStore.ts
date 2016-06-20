import * as ExternalRedux from 'external-redux';
import {
  createStore,
  applyMiddleware,
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


type applyMiddleWareType = typeof ExternalRedux.applyMiddleware;
type middlewareType = ExternalRedux.IMiddleware<IStoreState>;
type creatStoreType = typeof ExternalRedux.createStore;
type storeType = ExternalRedux.IStore<IStoreState>;

export default function getConfiguredStore() {
  const middlewares = [thunk as middlewareType, createLogger() as middlewareType];
  // TODO: the casting of `reduxLogger` might not be correct:
  const temp = (applyMiddleware as applyMiddleWareType)<IStoreState>(...middlewares);

  // Redux store:
  const store = createStore(
    reducer, {
      // Let the store start out with an empty list of items:
      items: undefined,
      fetchStatus: undefined
  } as IStoreState, temp) as any as storeType

  // Persist the state to `localStorage` whenever the state changes but not more
  // often than every 2 seconds:
  // store.subscribe(_.throttle((state: IStoreState) => {
  //   saveLocalState(state);
  // }, 2000));
  return store;
}
