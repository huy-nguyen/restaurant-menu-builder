import {
  IStoreState,
  IMenuItemSerialized,
  IStoreStateSerialized
} from './Interfaces';
import {
  localStorageKey
} from './Constants';
import {
  doesExist
} from './Utils';
import MenuItem from '../models/MenuItem';

export function loadLocalItems(): MenuItem[] {
  try {
    const storedState = localStorage.getItem(localStorageKey);
    if (doesExist(storedState)) {
      const {items} = JSON.parse(storedState as string) as IStoreStateSerialized;
      return items.map((data: IMenuItemSerialized) => MenuItem.deserialize(data));
    } else {
      return undefined;
    }
  } catch(error) {
    console.log(error);
  }
  return undefined;
}

export function saveLocalState(state: IStoreState): void {
  const {items} = state;
  const stateToSave = {
    items: items.map((item: MenuItem) => item.serialize())
  };
  try {
    localStorage.setItem(localStorageKey, JSON.stringify(stateToSave));
  } catch(error) {
    console.log(error);
  }
}
