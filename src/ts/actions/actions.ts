import {
  ActionType,
  IActionModify,
  IActionAdd,
  IActionReceiveItemsFromAPI,
  IActionReceiveItemsFromLocal,
  IActionNotify,
  IActionFetchFailure,
  IMenuItem,
  IMenuItemRaw,
  IMenuItemMetaData,
  IStoreState,
  IThunk
} from '../utils/Interfaces';
import {
  extend,
  doesExist,
  ajax
} from '../utils/Utils';
import {
  loadLocalItems
}from '../utils/localStorage';
import MenuItem from '../models/MenuItem';
import {
  Dispatch
} from 'redux';
import {
  getIsFetchingStatus
}from '../reducers/reducer';
import {Promise}  from 'es6-promise';

// Webpack will locate the JSON file in the `src/data` directory, copy it to the
// build directory and return a URL (with hash) that can be used in the AJAX
// call:
const dataFileURL = require('../../data/menu_items.json');

/** Action creators */
export const addItem = (data: IMenuItemMetaData): IActionAdd => ({
  type: ActionType.ADD_ITEM,
  data
})

export const removeItem = (id: string): IActionModify => ({
  type: ActionType.REMOVE_ITEM,
  id
});

export const toggleItem = (id: string): IActionModify => ({
  type: ActionType.TOGGLE_SELECT,
  id
});

// This is a "thunk" representing the sequence of events surrounding a fetch.
// Basically, instead of returning an action, which is a one-off event, a
// thunk returns a function that takes the `dispatch` function as an argument.
// The `dispatch` function will be injected by the modified `dispatch` function
// created by the `redux-thunk` middleware plugin. This allows the thunk to
// invoke `dispatch` multiple times to choreograph a sequence of events. In this
// case, the thunk notifies the app that a fetch is in progress (so that loading
// spinner can be displayed), execute the fetch and then tells the app that the
// fetch is finished so that the spinner can be removed. For  background on
// thunks, see https://github.com/gaearon/redux-thunk
export const fetchMenuItems: IThunk<IStoreState> = () => {
  return function(dispatch: Dispatch<IStoreState>, getState: () => IStoreState): Promise<any> {

    function onSuccess(rawItems: IMenuItemRaw[]) {
      dispatch({
        type: ActionType.FETCH_SUCCESS_REMOTE,
        data: rawItems
      } as IActionReceiveItemsFromAPI);
    }
    function onFailure(error: any) {
      dispatch({
        type: ActionType.FETCH_FAILURE,
        message: error.message || 'Fetch error'
      } as IActionFetchFailure)
    }
    let result: Promise<any>;

    let localItems = loadLocalItems();
    localItems = null;
    if (getIsFetchingStatus(getState())) {
      // If a fetch is already in progress, do not initiate another fetch. Once
      // again, notice that we do not access the structure of the store directly
      // even though we could:
      result = Promise.resolve(null);
    } else {
      // Let the app know that fetching is about to start (show loading spinner):
      dispatch({
        type: ActionType.FETCH_BEGIN
      } as IActionNotify);
      if (doesExist(localItems)) {
        // If local storage has stored data, load from it:
        dispatch({
          type: ActionType.FETCH_SUCESS_LOCAL,
          data: localItems
        } as IActionReceiveItemsFromLocal);
        result = Promise.resolve(null);
      } else {
        // Otherwise, fetch data from the API and shows the loading spinner until
        // the data has finished loading:
        result = ajax({
          url: dataFileURL,
          dataType: 'json'
        }).then(
          // Here we use the two-callback form of `then` because we want `onFailure`
          // to only handle errors from the API call and not some other internal
          // errors.  Internal errors are passed to the `catch` callback later:
          onSuccess,
          onFailure
        ).catch((error) => {
          console.log(error);
        });
      }
    }
    return result;
  }
}
/** End of action creators */
