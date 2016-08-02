// Type definitions for Redux Mock Store v1.0.2
// Project: https://github.com/arnaudbenard/redux-mock-store
// Definitions by: Braulio Díez <https://github.com/brauliodiez/>>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// How to import it:
// import configureStore = require('redux-mock-store');
// Usage:
// const mockStore = configureStore();

declare module 'redux-mock-store' {
  import {Store, Action} from 'redux';

  interface MockStore<StoreState> extends Store<StoreState> {
      getState():any;
      getActions():Array<any>;
      dispatch(action: Action):any;
      clearActions():void;
      subscribe():any;
  }
  export default function configureStore<StoreState>(...args:any[]):(...args:any[]) => MockStore<StoreState>;
}

