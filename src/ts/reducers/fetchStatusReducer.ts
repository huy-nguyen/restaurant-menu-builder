import {
  IAction,
  IActionNotify,
  IActionReceiveItemsFromAPI,
  IActionReceiveItemsFromLocal,
  ActionType,
  IActionFetchFailure,
  IStoreFetchStatus
} from '../utils/Interfaces';
import {
  combineReducers,
} from 'redux';
import {
  IReducer
} from 'external-redux';

// Reducer for the `isFetching` part of the Redux store. Set `isFetching` to
// `true` when a fetch begins and to `false` when a fetch has finished. It also
// records the error message, if any, from the fetch operation. Initial state is
// `false` (not fetching) and no error message.
const fetchStatusReducer: IReducer<IStoreFetchStatus> =
  (currentFetchStatus: IStoreFetchStatus = {isFetching: false, message: null},
    action: IAction): IStoreFetchStatus => {

  const {type} = action;
  let newFetchStatus: IStoreFetchStatus;
  if (type === ActionType.FETCH_BEGIN) {
    newFetchStatus = {
      isFetching: true,
      message: null
    };
  } else if (type === ActionType.FETCH_SUCESS_LOCAL ||
    type === ActionType.FETCH_SUCCESS_REMOTE) {

    newFetchStatus = {
      isFetching: false,
      message: null
    };
  } else if (type === ActionType.FETCH_FAILURE) {
    const {message} = action as IActionFetchFailure;
    newFetchStatus = {
      isFetching: false,
      message
    };
  } else {
    return currentFetchStatus;
  }
  return newFetchStatus;
}

export default fetchStatusReducer;

export const getIsFetchingStatus = (status: IStoreFetchStatus): boolean => status.isFetching;
export const getErrorMessage = (status: IStoreFetchStatus): string => status.message;
