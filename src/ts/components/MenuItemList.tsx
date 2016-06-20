import * as React from 'react';
import MenuItemComponent from './MenuItem';
import MenuItem from '../models/MenuItem';

interface IProps {
  // List of all menu items to be displayed:
  items: MenuItem[]
  // Callback for when one of them is clicked:
  onClickCallback: (id: string) => void
  // Callback for when an item is removed:
  onRemoveCallback: (id: string) => void
}

// Presentational component representing the list of all menu items:
const MenuItemList = (props: IProps) => {
  const {items, onClickCallback, onRemoveCallback} = props;
  // Displayed menu items:
  const itemComponents = items.map((item: MenuItem) => (
    <MenuItemComponent item={item} onClick={onClickCallback}
      onRemove={onRemoveCallback} key={item.id}/>
  ));
  return (
    <ul>
      {itemComponents}
    </ul>
  );
}

export default MenuItemList;
