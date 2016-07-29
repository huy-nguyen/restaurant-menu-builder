import MenuItem from '../models/MenuItem';
import {
  Action,
  Store,
  Dispatch
} from 'redux';

// Format of a menu item loaded from the API:
export interface IMenuItemRaw {
  // Which category to put this food item under:
  Category: string,
  // Name of the menu item:
  Name: string,
  // Description of the menu item. Usually the ingredients.
  Description: string,
  // Price: In dollars:
  Price: number,
  // Sometimes food can contain foodstuffs that are undercooked, like a
  // medium­rare steak, which restaurants must report by law. 0 or 1
  "Undercooked Warning": number,
  // 0 or 1:
  Vegetarian: number
}

// Interface for a parsed menu item (minus the id which is not related to
// the content of that item). The difference between this and IMenuItemRaw is
// that only the parsers will interact with IMenuItemRaw whereas the rest of the
// application will use this interface.
export interface IMenuItemMetaData {
  // For these properties, see the definition of IMenuItemRaw:
  category: string
  name: string
  description: string
  price: number
  isUndercooked: boolean
  isVegetarian: boolean

}

export interface IMenuItem extends IMenuItemMetaData {
  // Whether this item is selected to be displayed on the menu or not. By
  // default, all newly added items are selected:
  isSelected: boolean
}

export interface IMenuItemSerialized extends IMenuItem {
  id: string
}

/** Interfaces related to the Redux store */
// Part of the store concerning fetching status:
export interface IStoreFetchStatus {
  // Whether we're in the middle of a fetch
  isFetching: boolean,
  // Error message if there was one:
  message: string
}
// Structure of the Redux store:
export interface IStoreState {
  // The list of all items:
  items: MenuItem[]
  fetchStatus: IStoreFetchStatus
}
// Structure of the redux store while stored in localStorage. Because this structure
// only consists of primitive data types, it can be `JSON.stringify`ed and stored
// in `localStorage`:
export interface IStoreStateSerialized {
  items: IMenuItemSerialized[]
}

/** End of interfaces for the Redux store */

// The context argument to all container components:
export interface IContext {
  store: Store<IStoreState>
}

/** Typings for actions */
// All action types in this application:
export enum ActionType {
  ADD_ITEM,
  REMOVE_ITEM,
  TOGGLE_SELECT,
  // Signal the start of a fetch, either remotely or locally. Used to display
  // loading spinner:
  FETCH_BEGIN,
  // Signal the failure of a fetch so that an error message can be displayed:
  FETCH_FAILURE,
  // Signal success of a fetch, either remotely or locally. Used to update the
  // content of the store and replace the loading spinner with displayed data:
  FETCH_SUCCESS_REMOTE,
  FETCH_SUCESS_LOCAL,
}

// Actions whose only purpose is to notification e.g. start of a fetch:
export interface IActionNotify {
  type: ActionType
}

export interface IActionFetchFailure {
  type: ActionType,
  message: string
}

// Actions that change existing items:
export interface IActionModify extends Action {
  type: ActionType
  id: string
}

// Action to add new item:
export interface IActionAdd extends Action {
  type: ActionType
  data: IMenuItemMetaData
}

export interface IActionReceiveItemsFromAPI extends Action {
  type: ActionType
  data: IMenuItemRaw[]
}

export interface IActionReceiveItemsFromLocal extends Action {
  type: ActionType
  data: MenuItem[]
}

export type IAction = IActionModify | IActionAdd | IActionReceiveItemsFromAPI |
  IActionReceiveItemsFromLocal | IActionNotify | IActionFetchFailure;

export type IThunk<T> = () => (dispatch: Dispatch<IStoreState>, getState?: () => T) => any;
/** End of typings for actions */
