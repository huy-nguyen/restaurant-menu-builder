import {
  Reducer
} from 'redux';
import {
  combineReducers,
} from 'redux';
import itemsReducer, {
  getAvailableMenuItems as getAvailableMenuItemsFromSubReducer,
  getDisplayedItems as getDisplayedItemsFromSubReducer
} from './itemsReducer';
import {
  getIsFetchingStatus as getIsFetchingStatusFromSubReducer,
  getErrorMessage as getErrorMessageFromSubReducer
} from './fetchStatusReducer'
import fetchStatusReducer from './fetchStatusReducer';
import {
  IStoreState,
} from '../utils/Interfaces';
import MenuItem from '../models/MenuItem';

// This file contains the main reducer and all selectors that should be aware of
// the structure of the store.

// Reducer for the entire store.
const reducer = combineReducers({
  items: itemsReducer,
  fetchStatus: fetchStatusReducer
}) as Reducer<IStoreState>

export default reducer;

// These selectors abstract away the knowledge of the internal structure of the
// store and simply delegate to other more specialized functions. They don't
// concern themselves with how each substore is structured:
export function getAvailableMenuItems (state: IStoreState): MenuItem[] {
  return getAvailableMenuItemsFromSubReducer(state.items);
}

export function getDisplayedItems(state: IStoreState): MenuItem[] {
  return getDisplayedItemsFromSubReducer(state.items);
}

export const getIsFetchingStatus = (state: IStoreState): boolean =>
  getIsFetchingStatusFromSubReducer(state.fetchStatus);
export const getErrorMessage = (state: IStoreState): string =>
  getErrorMessageFromSubReducer(state.fetchStatus);
