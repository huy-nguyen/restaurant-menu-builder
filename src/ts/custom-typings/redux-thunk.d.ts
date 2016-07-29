// Type definitions for redux-thunk v2.0.1
// Project: https://github.com/gaearon/redux-thunk
// Definitions by: Qubo <https://github.com/tkqubo>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'redux-thunk' {

  import * as Redux from "redux";

  var thunk: ReduxThunk.Thunk;
  export default thunk;

  export namespace ReduxThunk {
      export interface Thunk extends Redux.Middleware {}
      export interface ThunkInterface {
        <T>(dispatch: Redux.Dispatch<any>, getState?: () => T): any;
      }
  }
}

