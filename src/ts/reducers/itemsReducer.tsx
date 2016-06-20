import {
  ActionType,
  IAction,
  IActionModify,
  IActionAdd,
  IActionReceiveItemsFromAPI,
  IActionReceiveItemsFromLocal,
  IMenuItemRaw,
  IMenuItem
} from '../utils/Interfaces';
import MenuItem from '../models/MenuItem';
import * as _ from 'lodash';
import {v4} from 'node-uuid';
import {IReducer} from 'external-redux';
import {
  extend
} from '../utils/Utils';

// This file contains all the "reducers" and "selectors" that are involved with
// the menu items part of the store. The thing they have in common is
// that they all work with the "slice" of the Redux store that contains info
// about the items (hence the `MenuItem[]` type signature you'll see). A
// "selector" is a function that takes in the store'd state or part of the
// store's state and return some information such as the list of all items or
// the list of all selected items.

// Perform the toggle or delete action if the passed in item is the item that
// the action should be applied to. Otherwise, return the item untouched:
function getModifiedItem(item: MenuItem, action: IActionModify): MenuItem {
  const {type, id} = action;
  let result: MenuItem;
  if (item.id !== id) {
    // If the item isn't affect by the action, returns it unchanged:
    result = item;
  } else {
    if (type === ActionType.REMOVE_ITEM) {
      // Set result to `null` because the call to `_.compact` in the `items` reducer
      // will remove this item from the `items` array:
      result = null;
    } else {
      result = item.clone();
      result.isSelected = !item.isSelected;
    }
  }
  return result;
}

// Reducer for the list of menu items. It takes the current list of items and an
// action dispatched from some other place in the application and return the new
// list of menu items. Initial state of `items` (in case no initial state can be
// provided e.g. no locally stored data) in the store will be empty list of
// items:
const itemsReducer: IReducer<MenuItem[]> = (currentItems: MenuItem[] = [], action: IAction): MenuItem[] => {
  const {type} = action;
  let newItems: MenuItem[];
  if (type === ActionType.ADD_ITEM) {
    const {data} = action as IActionAdd;
    const dataForConstructor = extend(data, {
      isSelected: true
    }) as IMenuItem;
    const newItem = new MenuItem(dataForConstructor, v4());
    newItems = [...currentItems, newItem];
  } else if (type === ActionType.REMOVE_ITEM || type === ActionType.TOGGLE_SELECT) {
    const preprocessedItem = currentItems.map((item: MenuItem) => getModifiedItem(item, action as IActionModify));
    // Call `_.compact` to remove falsy items (useful for remove action);
    newItems = _.compact(preprocessedItem);
  } else if (type === ActionType.FETCH_SUCCESS_REMOTE) {
    // This is the same as overwriting the existing items with the newly fetched
    // items. This is OK because we don't keep a back-end storage of menu items.
    // As such, this action could  have only been dispatched in the event that
    // `localStorage` is empty or unavailable:
    const {data} = action as IActionReceiveItemsFromAPI;
    newItems = data.map((rawItem: IMenuItemRaw) => new MenuItem(rawItem, v4()));
  } else if (type === ActionType.FETCH_SUCESS_LOCAL) {
    const {data} = action as IActionReceiveItemsFromLocal;
    newItems = data;
  } else {
    // Return the state unchanged for unkonwn action:
    newItems = currentItems
  }
  return newItems;
}

export default itemsReducer;

/** Selectors involving menu items: */

// These functions are trivial right now but will have more substance once we
// switch to a new store structure in which the data about all menu items is
// stored in a lookup table and the list of available (i.e. not deleted) items
// is stored in a list. At tha time these functions will have to cross reference
// the list with the lookup table to return the lsit of actual menu items
// (instead of a list of id strings). These functions should only be used by the
// correspondingly named functions in the `reducer` module. If a view component
// needs the list of all available items or all selected items, it should call
// those identically named functions in the `reducer` module because they are
// store-structure-agnostic:
export const getAvailableMenuItems = (items: MenuItem[]): MenuItem[] => items;

export function getDisplayedItems(items: MenuItem[]) {
  return items.filter((item: MenuItem) => item.isSelected);
}
